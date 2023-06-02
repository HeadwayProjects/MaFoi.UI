import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from 'react-bootstrap/Tooltip';
import Location from "../../common/Location";
import PageLoader from "../../shared/PageLoader";
import * as api from "../../../backend/request";
import { toast } from 'react-toastify';
import { ACTIVITY_STATUS, AUDIT_STATUS, FILTERS, STATUS_MAPPING, TOOLTIP_DELAY } from "../../common/Constants";
import Icon from "../../common/Icon";
import Table, { reactFormatter, CellTmpl, TitleTmpl, DEFAULT_PAYLOAD } from "../../common/Table";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import AdvanceSearch from "../../common/AdvanceSearch";
import AlertModal from "../../common/AlertModal";
import { download, preventDefault, reduceArraytoObj } from "../../../utils/common";
import PublishModal from "./PublishModal";
import ActivityModal from "./ActivityModal";
import { getUserDetails } from "../../../backend/auth";
import { useAuditReport } from "../../../backend/exports";
import { API_DELIMITER, ERROR_MESSAGES } from "../../../utils/constants";
import { useGetAllActivities } from "../../../backend/query";

const STATUS_BTNS = [
    // { name: ACTIVITY_STATUS.PENDING, label: STATUS_MAPPING[ACTIVITY_STATUS.PENDING], style: 'warning' },
    { name: ACTIVITY_STATUS.SUBMITTED, label: STATUS_MAPPING[ACTIVITY_STATUS.SUBMITTED], style: 'danger' },
    { name: ACTIVITY_STATUS.AUDITED, label: STATUS_MAPPING[ACTIVITY_STATUS.AUDITED], style: 'success' },
    { name: ACTIVITY_STATUS.REJECTED, label: STATUS_MAPPING[ACTIVITY_STATUS.REJECTED], style: 'danger' }
];

const ACTIONS = {
    EDIT: 1,
    VIEW: 2
};

const SortFields = {
    'act.name': 'actname',
    'rule.name': 'rulename',
    'activity.name': 'activityname',
    'associateCompany.name': 'associatecompanyname',
    'location.name': 'locationname'
};

function TaskManagement() {
    const [statusBtns] = useState(STATUS_BTNS);
    const [submitting, setSubmitting] = useState(false);
    const [checkedStatuses, setCheckedStatuses] = useState({});
    const [activity, setActivity] = useState(null);
    const [action, setAction] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [locationFilters, setLocationFilter] = useState();
    const lfRef = useRef();
    lfRef.current = locationFilters;
    const [advaceSearchFilters, setAdvanceSearchFilters] = useState();
    const afRef = useRef();
    afRef.current = advaceSearchFilters;
    const [statusFilters, setStatusFilters] = useState([{ columnName: 'status', value: STATUS_BTNS.map(x => x.name).join(API_DELIMITER) }]);
    const sfRef = useRef();
    sfRef.current = statusFilters;
    const [payload, setPayload] = useState();
    const payloadRef = useRef();
    payloadRef.current = payload;
    const { activities, total, isFetching, refetch } = useGetAllActivities(payload, Boolean(hasFilters(null, 'companyId')));
    const [selectedRows, setSelectedRows] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);
    const [publish, setPublish] = useState(false);
    const [report, setReport] = useState(null);
    const { auditReport, exporting } = useAuditReport((response) => {
        const blob = new Blob([response.data], { type: response.headers['content-type'] })
        const URL = window.URL || window.webkitURL;
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = 'AuditReport.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT)
    });

    function hasFilters(ref, field = 'companyId') {
        const _filters = (ref ? ref.current : {...(payloadRef.current || {})}.filters) || [];
        const company = _filters.find(x => x.columnName === field);
        return (company || {}).value;
    }

    function onLocationChange(event) {
        const { company, associateCompany, location } = event;
        setLocationFilter([
            {
                columnName: 'companyId',
                value: company
            },
            {
                columnName: 'associateCompanyId',
                value: associateCompany
            },
            {
                columnName: 'locationId',
                value: location
            }
        ]);
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
        const _filters = [];
        const keys = Object.keys(event || {});
        if (keys.length > 0) {
            keys.forEach(key => {
                _filters.push({
                    columnName: key,
                    value: event[key]
                })
            });
        }
        setAdvanceSearchFilters(_filters);
    }

    function editActivity(activity) {
        setAction(ACTIONS.EDIT);
        setActivity(activity);
    }

    function downloadReport(event) {
        preventDefault(event);
        setSubmitting(true);
        const _request = { ...reduceArraytoObj(lfRef.current), ...reduceArraytoObj(afRef.current) };
        const _payload = {
            company: _request.companyId,
            associateCompany: _request.associateCompanyId,
            location: _request.locationId,
            month: _request.month,
            year: _request.year,
            statuses: ['']
        };

        api.post('/api/ToDo/GetToDoByCriteria', _payload).then(response => {
            if (response && response.data) {
                const list = response.data || [];
                const _report = list.filter(x => x.published);
                if (_report.length > 0) {
                    const user = getUserDetails();  
                    _payload['auditorId'] = user.userid;
                    //delete _payload.statuses;
                    auditReport(_payload);
                } else {
                    toast.warn('One or more forms are not published for the selected month and year.');
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
        const _filter = hasFilters(afRef, 'month');
        if (!Boolean(_filter)) {
            setAlertMessage(`
                <div class="mb-2">Publish activities can be performed on a specfic month only. Please refine your search to specific month and year.</div>
                <p class="mt-3"><strong>Advance Search &gt; Filter By Month & Year &gt; Select Specific Month and Year</strong</p>
            `);
        } else {
            setSubmitting(true);
            const _request = { ...reduceArraytoObj(lfRef.current), ...reduceArraytoObj(afRef.current) };
            const _payload = {
                company: _request.companyId,
                associateCompany: _request.associateCompanyId,
                location: _request.locationId,
                month: _request.month,
                year: _request.year,
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

    function onPublish(e, recommendations) {
        preventDefault(e);
        setSubmitting(true);
        const _request = { ...reduceArraytoObj(lfRef.current), ...reduceArraytoObj(afRef.current) };
        const _payload = {
            companyId: _request.companyId,
            associateCompanyId: _request.associateCompanyId,
            locationId: _request.locationId,
            month: _request.month,
            year: _request.year,
            recommendations: recommendations || ''
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
            title: "Month & Year", field: "month", width: 140,
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
            title: "Audit Type", field: "auditType", maxWidth: 100,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Actions", hozAlign: "center", width: 120,
            headerSort: false,
            formatter: reactFormatter(<ActionColumnElements />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        }
    ]

    function rowFormatter(row) {
        const data = row.getData();
        const element = row.getElement();
        if (data.published) {
            element.classList.add('activity-published');
        }
    }

    const [tableConfig] = useState({
        paginationMode: 'remote',
        ajaxRequestFunc,
        columns,
        rowHeight: 'auto',
        selectable: false,
        paginate: true,
        initialSort: [{ column: 'month', dir: 'desc' }],
        rowFormatter
    });

    function formatApiResponse(params, list, totalRecords) {
        const { pagination } = params || {};
        const { pageSize, pageNumber } = pagination || {};
        const tdata = {
            data: list,
            total: totalRecords,
            last_page: Math.ceil(totalRecords / (pageSize || 1)) || 1,
            page: pageNumber || 1
        };
        setData(tdata);
        return tdata;
    }

    function ajaxRequestFunc(url, config, params) {
        const { field, dir } = (params.sort || [])[0] || {};
        const _params = {
            pagination: {
                pageSize: params.size,
                pageNumber: params.page
            },
            sort: {
                columnName: SortFields[field] || field || 'month',
                order: dir || 'desc'
            }
        };
        setParams(_params);
        setPayload({
            ...DEFAULT_PAYLOAD,
            sort: {
                columnName: 'month',
                order: 'desc'
            },
            ..._params,
            filters: [
                ...(lfRef.current || []),
                ...(afRef.current || []),
                ...(sfRef.current || [])
            ]
        });
        return Promise.resolve(formatApiResponse(params, activities, total));
    }

    function handlePageNav(_pagination) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params })
    }

    function getAdvanceSearchPayload() {
        const _filters = [...(afRef.current || [])];
        const _payload = {};
        _filters.forEach(x => {
            _payload[x.columnName] = x.value;
        });
        return _payload;
    }

    useEffect(() => {
        if (locationFilters) {
            setPayload({
                ...DEFAULT_PAYLOAD,
                sort: {
                    columnName: 'month',
                    order: 'desc'
                },
                ...params,
                filters: [
                    ...locationFilters,
                    ...(afRef.current || []),
                    ...(sfRef.current || [])
                ]
            });
        }
    }, [locationFilters]);

    useEffect(() => {
        if (advaceSearchFilters) {
            setPayload({
                ...DEFAULT_PAYLOAD,
                sort: {
                    columnName: 'month',
                    order: 'desc'
                },
                ...params,
                filters: [
                    ...(lfRef.current || []),
                    ...advaceSearchFilters,
                    ...(sfRef.current || [])
                ]
            });
        }
    }, [advaceSearchFilters]);

    useEffect(() => {
        if (statusFilters) {
            setPayload({
                ...DEFAULT_PAYLOAD,
                sort: {
                    columnName: 'month',
                    order: 'desc'
                },
                ...params,
                filters: [
                    ...(lfRef.current || []),
                    ...(afRef.current || []),
                    ...statusFilters
                ]
            });
        }
    }, [statusFilters]);

    useEffect(() => {
        if (checkedStatuses) {
            const keys = Object.keys(checkedStatuses);
            const result = keys.filter(key => !!checkedStatuses[key]);
            const _result = [];
            if (result.length > 0) {
                _result.push({
                    columnName: 'status',
                    value: result.join(API_DELIMITER)
                });
            } else {
                _result.push({
                    columnName: 'status',
                    value: STATUS_BTNS.map(x => x.name).join(API_DELIMITER)
                });
            }
            setStatusFilters(_result)
        }
    }, [checkedStatuses]);

    useEffect(() => {
        if (!isFetching && payload) {
            setSelectedRows([]);
            setData(formatApiResponse(params, activities, total));
        }
    }, [isFetching])

    return (
        <>
            <div className="d-flex flex-column">
                <div className="d-flex p-2 align-items-center pageHeading">
                    <h4 className="mb-0">Auditor - Activity</h4>
                    <div className="d-flex align-items-end h-100">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 d-flex justify-content-end">
                                <li className="breadcrumb-item">Home</li>
                                <li className="breadcrumb-item fw-bold active">Activity</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <form className="p-0 mx-3 my-2">
                    <div className="card border-0 p-2 mt-2 mb-3 filters">
                        <div className="d-flex flex-row m-0">
                            <Location onChange={onLocationChange} />
                            <div className="col-5">
                                <AdvanceSearch fields={[FILTERS.MONTH, FILTERS.SUBMITTED_DATE]} payload={getAdvanceSearchPayload()} onSubmit={search}
                                    downloadReport={downloadReport} />
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 p-2 mb-2">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center status-btn-group">
                                <label className="filter-label"><small>Forms Status</small></label>
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

                <Table data={data} options={tableConfig} isLoading={isFetching} onSelectionChange={setSelectedRows} onPageNav={handlePageNav} />
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
            {(submitting || exporting) && <PageLoader />}
        </>
    );
}

export default TaskManagement;
