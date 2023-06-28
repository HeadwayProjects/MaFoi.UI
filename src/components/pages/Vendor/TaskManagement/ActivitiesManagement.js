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
import Table, { CellTmpl, DEFAULT_PAYLOAD, TitleTmpl, reactFormatter } from "../../../common/Table";
import { ACTIVITY_STATUS, AUDIT_STATUS, FILTERS, STATUS_MAPPING, TOOLTIP_DELAY } from "../../../common/Constants";
import Location from "../../../common/Location";
import { useGetAllActivities } from "../../../../backend/query";
import Icon from "../../../common/Icon";
import { download, downloadFileContent, preventDefault, reduceArraytoObj } from "../../../../utils/common";
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from 'react-bootstrap/Tooltip';
import AdvanceSearch from "../../../common/AdvanceSearch";
import AlertModal from "../../../common/AlertModal";
import { ACTIVITY_TYPE, ACTIVITY_TYPE_ICONS, API_DELIMITER, ERROR_MESSAGES } from "../../../../utils/constants";
import { useAuditReport } from "../../../../backend/exports";

const STATUS_BTNS = [
    { name: ACTIVITY_STATUS.ACTIVITY_SAVED, label: STATUS_MAPPING[ACTIVITY_STATUS.ACTIVITY_SAVED], style: 'secondary' },
    { name: ACTIVITY_STATUS.PENDING, label: STATUS_MAPPING[ACTIVITY_STATUS.PENDING], style: 'warning' },
    { name: ACTIVITY_STATUS.OVERDUE, label: STATUS_MAPPING[ACTIVITY_STATUS.OVERDUE], style: 'danger' },
    { name: ACTIVITY_STATUS.SUBMITTED, label: STATUS_MAPPING[ACTIVITY_STATUS.SUBMITTED], style: 'danger' },
    { name: ACTIVITY_STATUS.REJECTED, label: STATUS_MAPPING[ACTIVITY_STATUS.REJECTED], style: 'danger' },
    { name: ACTIVITY_STATUS.AUDITED, label: STATUS_MAPPING[ACTIVITY_STATUS.AUDITED], style: 'danger' }
];

const SortFields = {
    'act.name': 'actname',
    'rule.name': 'rulename',
    'activity.name': 'activityname',
    'activity.type': 'activitytype',
    'associateCompany.name': 'associatecompanyname',
    'location.name': 'locationname'
};

// const AuditTypeFilter = [{ columnName: 'auditted', value: ACTIVITY_TYPE.AUDIT }];
const AuditTypeFilter = [];

function getAdvanceSearch(state) {
    const filters = [];
    if ((state || {}).fromDate) {
        filters.push({ columnName: 'fromDate', value: state.fromDate })
        filters.push({ columnName: 'toDate', value: state.toDate })
    }

    if ((state || {}).auditType) {
        filters.push({ columnName: 'auditType', value: state.auditType })
    }
    return filters.length > 0 ? filters : undefined;
}

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
    const [locationFilters, setLocationFilter] = useState();
    const lfRef = useRef();
    lfRef.current = locationFilters;
    const [advaceSearchFilters, setAdvanceSearchFilters] = useState(getAdvanceSearch(state));
    const afRef = useRef();
    afRef.current = advaceSearchFilters;
    const [statusFilters, setStatusFilters] = useState();
    const sfRef = useRef();
    sfRef.current = statusFilters;
    const [payload, setPayload] = useState();
    const payloadRef = useRef();
    payloadRef.current = payload;
    const { activities, total, isFetching, refetch } = useGetAllActivities(payload, Boolean(hasFilters(null, 'companyId')));
    const [selectedRows, setSelectedRows] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);
    const { auditReport, exporting } = useAuditReport((response) => {
        downloadFileContent({
            name: 'AuditReport.pdf',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT)
    });

    function onLocationChange(event) {
        const { company, associateCompany, location } = event;
        setLocationFilter([
            { columnName: 'companyId', value: company },
            { columnName: 'associateCompanyId', value: associateCompany },
            { columnName: 'locationId', value: location }
        ]);
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
                    const user = auth.getUserDetails();
                    _payload['auditorId'] = user.userid;
                    auditReport(_payload);
                } else {
                    toast.warn('There are no reports available for the selected month and year.');
                }
            }
        }).finally(() => setSubmitting(false));
    }

    function onSubmitToAuditor(e) {
        preventDefault(e);
        const _filter = hasFilters(afRef, 'month');
        if (!Boolean(_filter)) {
            setAlertMessage(`
                <div class="mb-2">Submit to auditor can be performed on a specfic month only. Please refine your search to specific month and year.</div>
                <p class="mt-3"><strong>Advance Search &gt; Select Specific Month and Year</strong</p>
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
                statuses: ['']
            };
            api.post('/api/ToDo/GetToDoByCriteria', _payload).then(response => {
                if (response && response.data) {
                    const _rows = response.data || [];
                    const _applicableRows = _rows.filter(x => x.auditted === ACTIVITY_TYPE.AUDIT);
                    const _published = _applicableRows.filter(x => x.published);
                    if (_published.length > 0) {
                        setAlertMessage('All the activities are published for the selected month and year. See Audit report for more details.');
                    } else if (_applicableRows.length) {
                        setSelectedRows(_applicableRows);
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
                <Icon className="mx-2" type="button" name={readOnly ? 'eye' : 'pencil'}
                    text={readOnly ? 'View' : 'Edit'} data={row} action={editActivity} />
                <Icon className="ms-1" type="button" name="download" text="Download" data={row} action={downloadForm} />
            </div>
        )
    }

    function ActivityTypeTmpl({ cell }) {
        const value = cell.getValue() || ACTIVITY_TYPE.AUDIT;
        return (
            <div className="d-flex flex-row align-items-center justify-content-center position-relative">
                <Icon name={ACTIVITY_TYPE_ICONS[value]} text={value} />
            </div>
        )
    }

    const columns = [
        {
            title: "", field: "auditted", width: 40,
            formatter: reactFormatter(<ActivityTypeTmpl />)
        },
        {
            title: "Month & Year", field: "month", width: 140,
            formatter: reactFormatter(<MonthTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            headerClick: (e, col) => {
                preventDefault(e);
            }
        },
        {
            title: "Act", field: "act.name", widthGrow: 2,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },

        {
            title: "Rule", field: "rule.name", widthGrow: 2,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Activity", field: "activity.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 2
        },
        {
            title: "Activity Type", field: "activity.type",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
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
            title: "Actions", hozAlign: "center", width: 100,
            headerSort: false,
            formatter: reactFormatter(<ActionColumnElements />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        }
    ]

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

    function rowFormatter(row) {
        const data = row.getData();
        const element = row.getElement();
        if (data.published) {
            element.classList.add('activity-published');
        }
    }

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

    function hasFilters(ref, field = 'companyId') {
        const _filters = (ref ? ref.current : { ...(payloadRef.current || {}) }.filters) || [];
        const company = _filters.find(x => x.columnName === field);
        return (company || {}).value;
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
                ...(sfRef.current || []),
                ...AuditTypeFilter
            ]
        });
        return Promise.resolve(formatApiResponse(params, activities, total));
    }

    function handlePageNav(_pagination) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params });
    }

    function getAdvanceSearchPayload() {
        const _filters = [...(afRef.current || [])];
        const _payload = {};
        _filters.forEach(x => {
            _payload[x.columnName] = x.value;
        });
        return _payload;
    }

    function handleBulkUploadClose(refresh = false) {
        if (refresh) {
            refetch();
        }
        setBulkUpload(false);
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
                    ...(sfRef.current || []),
                    ...AuditTypeFilter
                ]
            });
        }
    }, [locationFilters]);

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
                    ...(lfRef.current || []),
                    ...advaceSearchFilters,
                    ...(sfRef.current || []),
                    ...AuditTypeFilter
                ]
            });
        }
    }, [advaceSearchFilters]);

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
                    ...(lfRef.current || []),
                    ...(afRef.current || []),
                    ...statusFilters,
                    ...AuditTypeFilter
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
                <div className="d-flex  p-2 align-items-center pageHeading shadow">
                    <h4 className="mb-0">Vendor - Activity</h4>
                    <div className="d-flex align-items-end h-100">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 d-flex justify-content-end">
                                <li className="breadcrumb-item">Home</li>
                                {
                                    fromDashboard &&
                                    <li className="breadcrumb-item fw-bold"><Link href="/dashboard">Dashboard</Link></li>
                                }
                                <li className="breadcrumb-item  fw-bold active">Activity</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <form className="p-0 mx-3 my-2">
                    <div className="card shadow border-0 p-2 mt-2 mb-3">
                        <div className="d-flex flex-row filters">
                            <Location onChange={onLocationChange} />
                            <div className="col-5">
                                <AdvanceSearch fields={[FILTERS.MONTH, FILTERS.DUE_DATE]} payload={getAdvanceSearchPayload()} onSubmit={search}
                                    downloadReport={downloadReport} />
                            </div>
                        </div>
                    </div>
                    <div className="card shadow border-0 p-2 mb-2">
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
                <Table data={data} options={tableConfig} isLoading={isFetching} onSelectionChange={setSelectedRows} onPageNav={handlePageNav} />
            </div>

            {
                bulkUpload &&
                <BulkUploadModal onClose={handleBulkUploadClose} onSubmit={refetch} />
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
            {(submitting || exporting) && <PageLoader />}
        </>
    );
}

export default ActivitiesManagement;
