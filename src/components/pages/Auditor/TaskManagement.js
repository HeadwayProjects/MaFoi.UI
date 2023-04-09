import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ViewActivityModal from "./ViewActivityModal";
import EditActivityModal from "./EditActivityModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from 'react-bootstrap/Tooltip';
import Location from "../../common/Location";
import { useGetAuditorActivites } from "../../../backend/auditor";
import PageLoader from "../../shared/PageLoader";
import * as api from "../../../backend/request";
import { toast } from 'react-toastify';
import { ACTIVITY_STATUS, AUDIT_STATUS, STATUS_MAPPING, TOOLTIP_DELAY } from "../../common/Constants";
import Icon from "../../common/Icon";
import Table, { reactFormatter, CellTmpl, TitleTmpl } from "../../common/Table";
import { faSave } from "@fortawesome/free-regular-svg-icons";

const STATUS_BTNS = [
    { name: ACTIVITY_STATUS.SUBMITTED, label: STATUS_MAPPING[ACTIVITY_STATUS.SUBMITTED], style: 'danger' },
    { name: ACTIVITY_STATUS.AUDITED, label: STATUS_MAPPING[ACTIVITY_STATUS.AUDITED], style: 'success' },
    { name: ACTIVITY_STATUS.REJECTED, label: STATUS_MAPPING[ACTIVITY_STATUS.REJECTED], style: 'danger' }
];

const ACTIONS = {
    EDIT: 1,
    VIEW: 2
};

function TaskManagement() {
    const [statusBtns] = useState(STATUS_BTNS);
    const [submitting, setSubmitting] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [checkedStatuses, setCheckedStatuses] = useState({});
    const [activity, setActivity] = useState(null);
    const [action, setAction] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [filters, setFilters] = useState();
    const filterRef = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState();
    const { activities, isFetching, refetch } = useGetAuditorActivites(payload);
    const [selectedRows, setSelectedRows] = useState([]);

    function onLocationChange(event) {
        setFilters({ ...filterRef.current, ...event });
    }

    function downloadForm(activity) {
        setSubmitting(true);
        api.get(`/api/ActStateMapping/Get?id=${activity.actStateMappingId}`).then(response => {
            if (response.data.filePath) {
                const link = document.createElement('a');
                link.href = response.data.filePath;
                link.download = response.data.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                toast.warn('No files available');
            }
        }).finally(() => setSubmitting(false));
    }

    function search() {
        setFilters({
            ...filterRef.current,
            fromDate: fromDate ? new Date(fromDate).toISOString() : null,
            toDate: toDate ? new Date(toDate).toISOString() : null,
        });
    }

    function editActivity(activity) {
        setAction(ACTIONS.EDIT);
        setActivity(activity);
    }

    function viewActivity(activity) {
        setAction(ACTIONS.VIEW);
        setActivity(activity);
    }

    function dismissAction() {
        setAction(null);
        setActivity(null);
    }

    function publishActivity() {

    }

    function onFormStatusChangeHandler(e) {
        setCheckedStatuses({
            ...(checkedStatuses || {}),
            [e.target.name]: e.target.checked
        });
    }

    function fromDateChange(date) {
        setFromDate(date);
        if (toDate && date > toDate) {
            setToDate(date);
        }
    }

    function toDateChange(date) {
        if (fromDate && date > fromDate) {
            setToDate(date);
        } else {
            setToDate(fromDate);
        }
    }

    function MonthTmpl({ cell }) {
        const row = cell.getData();
        return (
            <>{row.month} (${row.year})</>
        )
    }

    function DueDateTmpl({ cell }) {
        const value = cell.getValue();
        return (
            <span className="text-warning" >{dayjs(value).format('DD-MM-YYYY')}</span>
        )
    }

    function FormStatusTmpl({ cell }) {
        const status = cell.getValue();
        const row = cell.getData();
        return (
            <div className="d-flex align-items-center position-relative">
                {
                    !!row.formsStatusRemarks &&
                    <OverlayTrigger overlay={<Tooltip>{row.formsStatusRemarks}</Tooltip>}
                        placement="bottom" delay={{ show: TOOLTIP_DELAY }}>
                        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    </OverlayTrigger>
                }
                <span className={`status-${status} ellipse`}>{STATUS_MAPPING[status] || status}</span>
            </div>
        )
    }

    function AuditStatusTmpl({ cell }) {
        const status = cell.getValue();
        const row = cell.getData();
        const color = {
            [AUDIT_STATUS.COMPLIANT]: 'status-compliant',
            [AUDIT_STATUS.NON_COMPLIANCE]: 'status-non-compliance',
            [AUDIT_STATUS.NOT_APPLICABLE]: 'status-not-applicable',
        }
        return (
            <div className="d-flex align-items-center position-relative">
                {
                    !!row.auditRemarks &&
                    <OverlayTrigger overlay={<Tooltip>{row.auditRemarks}</Tooltip>}
                        placement="bottom" delay={{ show: TOOLTIP_DELAY }}>
                        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    </OverlayTrigger>
                }
                {
                    status &&
                    <span className={`${color[status]} ellipse`}>{STATUS_MAPPING[status] || status}</span>
                }
            </div>
        )
    }

    function ActionColumnElements({ cell }) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative">
                <Icon className="mx-1" name="download" text="Download" data={row} action={downloadForm} />
                {
                    row.status === ACTIVITY_STATUS.SUBMITTED ?
                        <Icon className="ms-2" name={'edit'} text={'Edit'} data={row} action={editActivity} /> :
                        <Icon className="ms-2" name={'view'} text={'View'} data={row} action={viewActivity} />
                }
            </div>
        )
    }

    const columns = [
        // {
        //     formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, width: 10, cellClick: function (e, cell) {
        //         preventDefault(e);
        //         cell.getRow().toggleSelect();
        //     }
        // },
        {
            title: "Month (year)", field: "month", width: 140,
            formatter: reactFormatter(<MonthTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Act", field: "act.name", widthGrow: 2,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Rule", field: "rule.name", maxWidth: 140,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Forms / Registers & Returns", field: "activity.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 2
        },
        {
            title: "Associate Company", field: "associateCompany.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 1
        },
        {
            title: "Location Name", field: "location.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 1
        },
        {
            title: "Audit Due Date", field: "dueDate", width: 120,
            formatter: reactFormatter(<DueDateTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Vendor Submitted Date", field: "submittedDate", width: 120,
            formatter: reactFormatter(<DueDateTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Audit Status", field: "auditStatus", maxWidth: 160,
            formatter: reactFormatter(<AuditStatusTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Forms Status", field: "status", maxWidth: 160,
            formatter: reactFormatter(<FormStatusTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Action", hozAlign: "center", width: 100,
            sortable: false,
            formatter: reactFormatter(<ActionColumnElements />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        }
    ]

    const [tableConfig] = useState({
        paginationMode: 'remote',
        ajaxRequestFunc,
        columns,
        rowHeight: 'auto',
        selectableCheck: (row) => {
            // const data = row.getData();
            // return data.status === ACTIVITY_STATUS.SUBMITTED;
            return true;
        }
    });

    function formatApiResponse(params, list, pagination = {}) {
        const total = list.length;
        const tdata = {
            data: list,
            total,
            last_page: Math.ceil(total / params.size) || 1,
            page: params.page || 1
        };
        setData(tdata);
        return tdata;
    }

    function ajaxRequestFunc(url, config, params) {
        setParams(params);
        setPayload((filterRef.current || {}).company ? { ...filterRef.current, ...params } : null);
        return Promise.resolve(formatApiResponse(params, activities));
    }

    useEffect(() => {
        if (filters) {
            setPayload({
                fromDate: fromDate ? new Date(fromDate).toISOString() : null,
                toDate: toDate ? new Date(toDate).toISOString() : null,
                ...filterRef.current, ...params
            });
        }
    }, [filters]);

    useEffect(() => {
        if (checkedStatuses) {
            const keys = Object.keys(checkedStatuses);
            const result = keys.filter(key => !!checkedStatuses[key]);
            setFilters({ ...filterRef.current, statuses: result.length ? result : ['Submitted', 'Approved', 'Rejected'] });
        }
    }, [checkedStatuses]);

    useEffect(() => {
        if (!isFetching && payload) {
            setSelectedRows([]);
            setData(formatApiResponse(params, activities));
        }
    }, [isFetching])

    return (
        <>
            <div className="d-flex flex-column">
                <div className="d-flex  p-2 align-items-center pageHeading">
                    <div className="ps-4">
                        <h4 className="mb-0 ps-1">Task Management</h4>
                    </div>
                    <div className="d-flex align-items-end h-100">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 d-flex justify-content-end">
                                <li className="breadcrumb-item">Home</li>
                                <li className="breadcrumb-item active">Task Management</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <form className="card border-0 p-0 mb-3 mx-3">
                    <div className="card-body">
                        <div className="row">
                            <Location onChange={onLocationChange} />
                            <div className="col-5">
                                <div className="d-flex justify-content-end">
                                    <div className="d-flex flex-column me-2">
                                        <label className="filter-label"><small>Submitted: From</small></label>
                                        <DatePicker className="form-control" selected={fromDate} dateFormat="dd-MM-yyyy"
                                            onChange={fromDateChange} placeholderText="dd-mm-yyyy"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select" />
                                    </div>
                                    <div className="d-flex flex-column ms-3">
                                        <label className="filter-label"><small>Submitted: To</small></label>
                                        <DatePicker className="form-control" selected={toDate} dateFormat="dd-MM-yyyy"
                                            onChange={toDateChange} placeholderText="dd-mm-yyyy"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select" />
                                    </div>
                                    <div className="d-flex align-items-end ms-3">
                                        <div className="d-flex flex-column">
                                            <button type="submit" className="btn btn-primary d-flex align-items-center"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    search();
                                                }}>
                                                <FontAwesomeIcon icon={faSearch} />
                                                <span className="ms-2">Search</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer border-0 px-2">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center status-btn-group">
                                <div className="text-appprimary">Forms Status</div>
                                {
                                    statusBtns.map(btn => {
                                        return (
                                            <div className="mx-2" key={btn.name}>
                                                <input name={btn.name} type="checkbox" className="btn-check" id={btn.name} autoComplete="off"
                                                    onChange={onFormStatusChangeHandler}
                                                    checked={checkedStatuses[btn.name]} />
                                                <label className={`btn btn-outline-${btn.style}`} htmlFor={btn.name}>{btn.label}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="d-flex">
                                <button className="btn btn-success" onClick={(e) => {
                                    e.preventDefault();
                                    publishActivity();
                                }} disabled={selectedRows.length === 0}>
                                    <div className="d-flex align-items-center">
                                        <FontAwesomeIcon icon={faSave} />
                                        <span className="ms-2">Publish</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <Table data={data} options={tableConfig} isLoading={isFetching} onSelectionChange={setSelectedRows} />
            </div>
            {
                action === ACTIONS.VIEW && <ViewActivityModal activity={activity} onClose={dismissAction} />
            }

            {
                action === ACTIONS.EDIT &&
                <EditActivityModal activity={activity} onClose={dismissAction} onSubmit={refetch} />
            }
            {submitting && <PageLoader />}
        </>
    );
}

export default TaskManagement;
