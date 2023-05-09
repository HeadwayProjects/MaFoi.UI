import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from 'react-bootstrap/Tooltip';
import Location from "../../common/Location";
import { useGetAuditorActivites } from "../../../backend/auditor";
import PageLoader from "../../shared/PageLoader";
import * as api from "../../../backend/request";
import { toast } from 'react-toastify';
import { ACTIVITY_STATUS, AUDIT_STATUS, FILTERS, STATUS_MAPPING, TOOLTIP_DELAY } from "../../common/Constants";
import Icon from "../../common/Icon";
import Table, { reactFormatter, CellTmpl, TitleTmpl } from "../../common/Table";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import AdvanceSearch from "../../common/AdvanceSearch";
import AlertModal from "../../common/AlertModal";
import { checkList, download, preventDefault } from "../../../utils/common";
import PublishModal from "./PublishModal";
import Report from "../../shared/Report";
import ActivityModal from "./ActivityModal";

const STATUS_BTNS = [
    { name: ACTIVITY_STATUS.SUBMITTED, label: STATUS_MAPPING[ACTIVITY_STATUS.SUBMITTED], style: 'danger' },
    { name: ACTIVITY_STATUS.AUDITED, label: STATUS_MAPPING[ACTIVITY_STATUS.AUDITED], style: 'success' },
    { name: ACTIVITY_STATUS.REJECTED, label: STATUS_MAPPING[ACTIVITY_STATUS.REJECTED], style: 'danger' },
    // { name: ACTIVITY_STATUS.PUBLISHED, label: STATUS_MAPPING[ACTIVITY_STATUS.PUBLISHED], style: 'danger' }
];

const ACTIONS = {
    EDIT: 1,
    VIEW: 2
};

function TaskManagement() {
    const [statusBtns] = useState(STATUS_BTNS);
    const [submitting, setSubmitting] = useState(false);
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
    const [alertMessage, setAlertMessage] = useState(null);
    const [publish, setPublish] = useState(false);
    const [report, setReport] = useState(null);

    function onLocationChange(event) {
        setFilters({ ...filterRef.current, ...event });
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

    function search(event) {
        setFilters({
            ...filterRef.current,
            ...event
        });
    }

    function editActivity(activity) {
        setAction(ACTIONS.EDIT);
        setActivity(activity);
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
            statuses: STATUS_BTNS.map(x => x.name)
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

    function dismissAction() {
        setAction(null);
        setActivity(null);
    }

    function publishActivity(e) {
        preventDefault(e);
        const _filter = filterRef.current;
        if (!_filter.month) {
            setAlertMessage(`
                <div class="mb-2">Publish activities can be performed on a specfic month only. Please refine your search to specific month and year.</div>
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
                statuses: STATUS_BTNS.map(x => x.name)
            };
            api.post('/api/ToDo/GetToDoByCriteria', _payload).then(response => {
                if (response && response.data) {
                    const _rows = response.data || [];
                    const submittedRows = _rows.filter(x => x.status === ACTIVITY_STATUS.SUBMITTED);
                    const published = _rows.filter(x => x.published);
                    if (_rows.length === 0) {
                        setAlertMessage(
                            `<p class="my-3">There are no Audited / Rejected activities available to publish for the selected month and year</p>`
                        );
                    } else if (published.length > 0) {
                        setAlertMessage(
                            `<p class="my-3">There are no pending activities available to publish for the selected month and year</p>`
                        );
                    } else if (submittedRows.length > 0) {
                        setAlertMessage(
                            `<p class="my-3">There are ${submittedRows.length} submitted activities available for the selected month and year. You cannot publish submitted activies.</p>
                            <p>Please Approve / Reject them before publishing.</p>`
                        );
                    } else if (_rows.length > 0) {
                        setSelectedRows(_rows);
                        setPublish(true);
                    }
                }
            }).finally(() => setSubmitting(false));
        }
    }

    function onPublish(e) {
        preventDefault(e);
        setSubmitting(true);
        const _payload = {
            companyId: payload.company,
            associateCompanyId: payload.associateCompany,
            locationId: payload.location,
            month: payload.month,
            year: payload.year
        };
        api.post('/api/Auditor/UpdatePublishStatus', _payload).then(response => {
            refetch();
            setPublish(false);
            toast.success(`Activites published successfully.`);
        }).finally(() => setSubmitting(false));
    }

    function onFormStatusChangeHandler(e) {
        setCheckedStatuses({
            ...(checkedStatuses || {}),
            [e.target.name]: e.target.checked
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
                <Icon className="mx-1" type="button" name="download" text="Download" data={row} action={downloadForm} />
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={editActivity} />
            </div>
        )
    }

    const columns = [
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
            title: "Actions", hozAlign: "center", width: 120,
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
        setPayload((filterRef.current || {}).company ? { ...filterRef.current, ...params, dateFilter: 'submittedDate' } : null);
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
                ...params,
                dateFilter: 'submittedDate'
            });
        }
    }, [filters]);

    useEffect(() => {
        if (checkedStatuses) {
            const keys = Object.keys(checkedStatuses);
            const result = keys.filter(key => !!checkedStatuses[key]);
            setFilters({ ...filterRef.current, statuses: result.length ? result : STATUS_BTNS.map(x => x.name) });
        }
    }, [checkedStatuses]);

    useEffect(() => {
        if (!isFetching && payload) {
            setSelectedRows([]);
            setData(formatApiResponse(params, activities));
        }
    }, [isFetching]);

    return (
        <>
            <div className="d-flex flex-column">
                <div className="d-flex  p-2 align-items-center pageHeading">
                    <div className="ps-4">
                        <h4 className="mb-0 ps-1">Auditor - Activity</h4>
                    </div>
                    <div className="d-flex align-items-end h-100">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 d-flex justify-content-end">
                                <li className="breadcrumb-item">Home</li>
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
                                <AdvanceSearch fields={[FILTERS.MONTH, FILTERS.SUBMITTED_DATE]} payload={payload} onSubmit={search}
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
                            <div className="d-flex">
                                <button className="btn btn-success" onClick={publishActivity}
                                >
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
                action === ACTIONS.EDIT &&
                <ActivityModal activity={activity} onClose={dismissAction} onSubmit={refetch} />
            }
            {
                !!alertMessage &&
                <AlertModal message={alertMessage} onClose={(e) => {
                    preventDefault(e);
                    setAlertMessage(null);
                }} />
            }
            {
                publish &&
                <PublishModal
                    onClose={() => setPublish(false)}
                    onSubmit={onPublish}
                    selectedRows={selectedRows} />
            }
            {submitting && <PageLoader />}
            {
                !!report &&
                <Report data={report} onClose={(e) => {
                    preventDefault(e);
                    setReport(null);
                }} />
            }
        </>
    );
}

export default TaskManagement;
