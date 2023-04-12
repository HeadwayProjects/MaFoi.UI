import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import SubmitToAuditorModal from "./SubmitToAuditorModal";
import * as api from "../../../../backend/request";
import * as auth from "../../../../backend/auth";
import EditActivityModal from "./EditActivityModal";
import { toast } from 'react-toastify';
import PageLoader from "../../../shared/PageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faUpload, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import BulkUploadModal from "./BulkuploadModal";
import { Link, usePath, useHistory } from "raviger";
import "react-datepicker/dist/react-datepicker.css";
import Table, { CellTmpl, TitleTmpl, reactFormatter } from "../../../common/Table";
import { ACTIVITY_STATUS, AUDIT_STATUS, FILTERS, STATUS_MAPPING, TOOLTIP_DELAY } from "../../../common/Constants";
import Location from "../../../common/Location";
import { useGetVendorActivites } from "../../../../backend/query";
import Icon from "../../../common/Icon";
import { checkList, download, preventDefault } from "../../../../utils/common";
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from 'react-bootstrap/Tooltip';
import AdvanceSearch from "../../../common/AdvanceSearch";
import AlertModal from "../../../common/AlertModal";

const STATUS_BTNS = [
    { name: ACTIVITY_STATUS.ACTIVITY_SAVED, label: STATUS_MAPPING[ACTIVITY_STATUS.ACTIVITY_SAVED], style: 'secondary' },
    { name: ACTIVITY_STATUS.PENDING, label: STATUS_MAPPING[ACTIVITY_STATUS.PENDING], style: 'warning' },
    { name: ACTIVITY_STATUS.OVERDUE, label: STATUS_MAPPING[ACTIVITY_STATUS.OVERDUE], style: 'danger' },
    { name: ACTIVITY_STATUS.SUBMITTED, label: STATUS_MAPPING[ACTIVITY_STATUS.SUBMITTED], style: 'danger' },
    { name: ACTIVITY_STATUS.REJECTED, label: STATUS_MAPPING[ACTIVITY_STATUS.REJECTED], style: 'danger' },
    { name: ACTIVITY_STATUS.AUDITED, label: STATUS_MAPPING[ACTIVITY_STATUS.AUDITED], style: 'danger' },
    // { name: ACTIVITY_STATUS.PUBLISHED, label: STATUS_MAPPING[ACTIVITY_STATUS.PUBLISHED], style: 'danger' }
];

function ActivitiesManagement() {
    const [readOnly] = useState(!auth.isVendor());
    const { state } = useHistory();
    const [statusBtns] = useState(STATUS_BTNS);
    const [submitting, setSubmitting] = useState(false);
    const [checkedStatuses, setCheckedStatuses] = useState((state || {}).status ? { [state.status]: true } : {});
    const [activity, setActivity] = useState(null);
    const [bulkUpload, setBulkUpload] = useState(false);
    const [submitToAuditor, setSubmitToAuditor] = useState(false);
    const path = usePath();
    const [fromDashboard] = useState(path.includes('/dashboard/activities'));
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [filters, setFilters] = useState({ fromDate: (state || {}).fromDate || null, toDate: (state || {}).toDate || null });
    const filterRef = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState();
    const { activities, isFetching, refetch } = useGetVendorActivites(payload);
    const [selectedRows, setSelectedRows] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);

    function onLocationChange(event) {
        setFilters({ ...filterRef.current, ...event });
    }

    function editActivity(activity) {
        setActivity(activity);
    }

    function downloadForm(activity) {
        setSubmitting(true);
        api.get(`/api/ActStateMapping/Get?id=${activity.actStateMappingId}`).then(response => {
            if (response.data.filePath) {
                download(response.data.fileName, response.data.filePath)
            } else {
                toast.warn('No files available');
            }
        }).finally(() => setSubmitting(false));
    }

    function downloadReport(event) {
        preventDefault(event);
        setSubmitting(true);
        const _payload = {
            company: payload.company,
            associateCompany: payload.associateCompany,
            location: payload.location,
            month: payload.month,
            year: payload.year,
            statuses: ['']
        };

        api.post('/api/ToDo/GetToDoByCriteria', _payload).then(response => {
            if (response && response.data) {
                const list = response.data || [];
                const _report = list.filter(x => x.published);
                if (_report.length > 0) {
                    const _record = _report[0];
                    const _summary = {
                        company: _record.company.name,
                        associateCompany: _record.associateCompany.name,
                        location: _record.location.name,
                        month: _record.month,
                        year: _record.year
                    };
                    checkList(_summary, _report);
                } else {
                    toast.warn('There are no reports available for the selected month and year.');
                }
            }
        }).finally(() => setSubmitting(false));
    }

    function onSubmitToAuditor(e) {
        preventDefault(e);
        const _filter = filterRef.current;
        if (!_filter.month) {
            setAlertMessage(`
                <div class="mb-2">There might be some hidden activies or activities from different months and years. Please restrict your search to specific month and year.</div>
                <p class="mt-3"><strong>Advance Search &gt; Filter By Month & Year &gt; Select Specific Month and Year</strong</p>
            `);
        } else {
            setSubmitting(true);
            const _payload = {
                company: payload.company,
                associateCompany: payload.associateCompany,
                location: payload.location,
                month: payload.month,
                year: payload.year,
                statuses: ['']
            };
            api.post('/api/ToDo/GetToDoByCriteria', _payload).then(response => {
                if (response && response.data) {
                    const _rows = response.data || [];
                    if (_rows.length) {
                        setSelectedRows(_rows);
                        setSubmitToAuditor(true);
                    }
                }
            }).finally(() => setSubmitting(false));
        }
    }

    function onSubmitToAuditorHandler(e) {
        preventDefault(e);
        setSubmitting(true);
        const ids = selectedRows.map(x => x.id);
        api.post('/api/ToDo/SubmitToAudit', ids).then(() => {
            toast.success('Selected activities submitted successfully.');
            refetch();
            setSubmitToAuditor(false);
        }).finally(() => setSubmitting(false));
    }

    function onFormStatusChangeHandler(e) {
        setCheckedStatuses({
            ...(checkedStatuses || {}),
            [e.target.name]: e.target.checked
        });
    }

    function search(event) {
        setFilters({
            ...filterRef.current,
            ...event
        });
    }

    function MonthTmpl({ cell }) {
        const row = cell.getData();
        return (
            <>{row.month} ({row.year})</>
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
                    (readOnly || [ACTIVITY_STATUS.AUDITED, ACTIVITY_STATUS.REJECTED, ACTIVITY_STATUS.SUBMITTED].includes(row.status)) ?
                        <Icon className="ms-2" name="view" text="View" data={row} action={editActivity} />
                        : <Icon className="ms-2" name="edit" text="Edit" data={row} action={editActivity} />
                }
            </div>
        )
    }

    const columns = [
        {
            title: "Month (year)", field: "month", width: 140,
            formatter: reactFormatter(<MonthTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            headerClick: (e, col) => {
                preventDefault(e);
                console.log(e, col);
            }
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
        selectable: false
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
        setPayload((filterRef.current || {}).company ? {
            ...filterRef.current,
            ...params
        } : null);
        return Promise.resolve(formatApiResponse(params, activities));
    }

    useEffect(() => {
        if (filters) {
            setPayload({
                fromDate: null,
                toDate: null,
                month: '',
                year: null,
                ...filterRef.current,
                ...params
            });
        }
    }, [filters]);

    useEffect(() => {
        if (checkedStatuses) {
            const keys = Object.keys(checkedStatuses);
            const result = keys.filter(key => !!checkedStatuses[key]);
            setFilters({ ...filterRef.current, statuses: result.length ? result : [''] });
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
                        <h4 className="mb-0 ps-1">Vendor - Activity</h4>
                    </div>
                    <div className="d-flex align-items-end h-100">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 d-flex justify-content-end">
                                <li className="breadcrumb-item">Home</li>
                                {
                                    fromDashboard &&
                                    <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
                                }
                                <li className="breadcrumb-item active">Activity</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <form className="card border-0 p-0 mb-3 mx-3">
                    <div className="card-body">
                        <div className="row">
                            <Location onChange={onLocationChange} />
                            <div className="col-5">
                                <AdvanceSearch fields={[FILTERS.MONTH, FILTERS.DUE_DATE]} payload={payload} onSubmit={search}
                                    downloadReport={downloadReport} />
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
                            {
                                !readOnly &&
                                <div className="d-flex">
                                    <div className="mx-2">
                                        <button className="btn btn-primary" onClick={(e) => {
                                            e.preventDefault();
                                            setBulkUpload(true)
                                        }}>
                                            <div className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faUpload} />
                                                <span className="ms-2">Bulk Upload</span>
                                            </div>
                                        </button>
                                    </div>

                                    <div>
                                        <button className="btn btn-primary" onClick={onSubmitToAuditor}
                                            disabled={activities.length === 0}>
                                            <div className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faSave} />
                                                <span className="ms-2">Submit To Auditor</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </form>
                <Table data={data} options={tableConfig} isLoading={isFetching} onSelectionChange={setSelectedRows} />
            </div>

            {
                bulkUpload &&
                <BulkUploadModal onClose={() => setBulkUpload(false)} onSubmit={refetch} />
            }
            {
                submitToAuditor &&
                <SubmitToAuditorModal
                    onClose={() => setSubmitToAuditor(false)}
                    onSubmit={onSubmitToAuditorHandler}
                    selectedRows={selectedRows} />
            }
            {
                !!activity &&
                <EditActivityModal activity={activity} onClose={() => setActivity(null)} onSubmit={refetch} />
            }
            {
                !!alertMessage &&
                <AlertModal message={alertMessage} onClose={(e) => {
                    preventDefault(e);
                    setAlertMessage(null);
                }} />
            }
            {submitting && <PageLoader />}
        </>
    );
}

export default ActivitiesManagement;
