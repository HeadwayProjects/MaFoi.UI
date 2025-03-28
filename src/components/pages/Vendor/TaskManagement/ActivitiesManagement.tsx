import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import SubmitToAuditorModal from "./SubmitToAuditorModal";
import * as api from "../../../../backend/request";
import { hasUserAccess, getUserDetails, getUserRole } from "../../../../backend/auth";
import EditActivityModal from "./EditActivityModal";
import { toast } from 'react-toastify';
import PageLoader from "../../../shared/PageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faUpload, faInfoCircle, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import BulkUploadModal from "./BulkuploadModal";
import { Link, usePath, useHistory } from "raviger";
import Table, { CellTmpl, DEFAULT_PAYLOAD, TitleTmpl, reactFormatter } from "../../../common/Table";
import {
    ACTIONS, ACTIVITY_STATUS, AUDIT_STATUS,
    FILTERS, STATUS_MAPPING, TOOLTIP_DELAY
} from "../../../common/Constants";
import Location from "../../../common/Location";
import { useExportTodos, useGetAllActivities } from "../../../../backend/query";
import Icon from "../../../common/Icon";
import { download, downloadFileContent, preventDefault, reduceArraytoObj } from "../../../../utils/common";
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from 'react-bootstrap/Tooltip';
import AdvanceSearch from "../../../common/AdvanceSearch";
import AlertModal from "../../../common/AlertModal";
import { ACTIVITY_TYPE, ACTIVITY_TYPE_ICONS, API_DELIMITER, ERROR_MESSAGES } from "../../../../utils/constants";
import { getAuditReportFileName, useAuditReport } from "../../../../backend/exports";
import { USER_PRIVILEGES } from "../../UserManagement/Roles/RoleConfiguration";
import styles from "./TaskManagement.module.css";
import TableActions, { ActionButton } from "../../../common/TableActions";
import SendEmailModal from "../../Auditor/SendEmailModal";
import VendorBulkUploadModal from "./VendorBulkModal";

const STATUS_BTNS = [
    { name: ACTIVITY_STATUS.ACTIVITY_SAVED, label: STATUS_MAPPING[ACTIVITY_STATUS.ACTIVITY_SAVED], style: 'secondary' },
    { name: ACTIVITY_STATUS.PENDING, label: STATUS_MAPPING[ACTIVITY_STATUS.PENDING], style: 'warning' },
    { name: ACTIVITY_STATUS.OVERDUE, label: STATUS_MAPPING[ACTIVITY_STATUS.OVERDUE], style: 'danger' },
    { name: ACTIVITY_STATUS.SUBMITTED, label: STATUS_MAPPING[ACTIVITY_STATUS.SUBMITTED], style: 'danger' },
    { name: ACTIVITY_STATUS.REJECTED, label: STATUS_MAPPING[ACTIVITY_STATUS.REJECTED], style: 'danger' },
    { name: ACTIVITY_STATUS.AUDITED, label: STATUS_MAPPING[ACTIVITY_STATUS.AUDITED], style: 'danger' }
];

const SortFields: any = {
    'act.name': 'actname',
    'rule.name': 'rulename',
    'activity.name': 'activityname',
    'activity.type': 'activitytype',
    'associateCompany.name': 'associatecompanyname',
    'location.name': 'locationname'
};

// const AuditTypeFilter = [{ columnName: 'auditted', value: ACTIVITY_TYPE.AUDIT }];
const AuditTypeFilter: any[] = [];

function getAdvanceSearch(state: any) {
    const filters = [];
    if ((state || {}).fromDate) {
        filters.push({ columnName: 'fromDate', value: dayjs(state.fromDate).startOf('D').toISOString() })
        filters.push({ columnName: 'toDate', value: dayjs(state.toDate).endOf('D').toISOString() })
    }

    if ((state || {}).auditType) {
        filters.push({ columnName: 'auditType', value: state.auditType })
    }
    return filters.length > 0 ? filters : undefined;
}

function ActivitiesManagement() {
    const { state }: any = useHistory();
    const [action, setAction] = useState(ACTIONS.NONE);
    const [statusBtns] = useState(STATUS_BTNS);
    const [submitting, setSubmitting] = useState(false);
    const [checkedStatuses, setCheckedStatuses] = useState<any>((state || {}).status ? { [state.status]: true } : {});
    const [activity, setActivity] = useState<any>(null);
    const [bulkUpload, setBulkUpload] = useState(false);
    const [vendorUpload, setVendorUpload] = useState<boolean>(false);
    const [submitToAuditor, setSubmitToAuditor] = useState(false);
    const path: any = usePath();
    const [fromDashboard] = useState(path.includes('/dashboard/activities'));
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [locationFilters, setLocationFilter] = useState<any>();
    const lfRef = useRef();
    lfRef.current = locationFilters;
    const [advaceSearchFilters, setAdvanceSearchFilters] = useState(getAdvanceSearch(state));
    const afRef: any = useRef();
    afRef.current = advaceSearchFilters;
    const [statusFilters, setStatusFilters] = useState<any>();
    const sfRef = useRef();
    sfRef.current = statusFilters;
    const [payload, setPayload] = useState<any>();
    const payloadRef = useRef();
    payloadRef.current = payload;
    const { activities, total, isFetching, refetch } = useGetAllActivities(payload, Boolean(hasFilters(null, 'companyId')));
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [alertMessage, setAlertMessage] = useState<any>(null);
    const { auditReport, exporting } = useAuditReport((response: any) => {
        if (response) {
            downloadFileContent({
                name: getAuditReportFileName(data.data[0], response.headers['content-type']),
                type: response.headers['content-type'],
                content: response.data
            });
        }
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT)
    });
    const { exportTodos, exporting: exportingTodos } = useExportTodos((response: any) => {
        downloadFileContent({
            name: 'Audit Activities.xlsx',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    const buttons: ActionButton[] = [
        // {
        //     label: 'Bulk Upload',
        //     name: 'bulkUpload',
        //     privilege: USER_PRIVILEGES.SUBMITTER_ACTIVITIES_UPLOAD,
        //     action: () => {
        //         setBulkUpload(true)
        //     }
        // },
        {
            label: 'Submit to Auditor',
            name: 'submitToAuditor',
            privilege: USER_PRIVILEGES.SUBMITTER_ACTIVITIES_SUBMIT,
            action: () => {
                onSubmitToAuditor();
            }
        },
        // {
        //     label: 'Send Report',
        //     name: 'sendReport',
        //     action: () => {
        //         setAction(ACTIONS.SEND_REPORT);
        //     }
        // }
    ]

    function onLocationChange(event: any) {
        const { company, associateCompany, location } = event;
        setLocationFilter([
            { columnName: 'companyId', value: company },
            { columnName: 'associateCompanyId', value: associateCompany },
            { columnName: 'locationId', value: location }
        ]);
    }

    function editActivity(activity: any) {
        setActivity(activity);
    }

    function downloadForm(activity: any) {
        setSubmitting(true);
        api.get(`/api/ActStateMapping/Get?id=${activity.actStateMappingId}`).then(response => {
            if (response.data.filePath) {
                download(response.data.fileName, response.data.filePath)
            } else {
                toast.warn('No files available');
            }
        }).finally(() => setSubmitting(false));
    }

    function downloadReport(event: any) {
        preventDefault(event);
        setSubmitting(true);
        const _request = { ...reduceArraytoObj(lfRef.current as any), ...reduceArraytoObj(afRef.current) };
        const _payload: any = {
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
                const _report = list.filter((x: any) => x.published);
                if (_report.length > 0) {
                    const user = getUserDetails();
                    _payload['auditorId'] = user.userid;
                    auditReport(_payload);
                } else {
                    toast.warn('There are no reports available for the selected month and year.');
                }
            }
        }).finally(() => setSubmitting(false));
    }

    function onSubmitToAuditor() {
        const _filter = hasFilters(afRef, 'month');
        if (!Boolean(_filter)) {
            setAlertMessage(`
                <div class="mb-2">Submit to auditor can be performed on a specfic month only. Please refine your search to specific month and year.</div>
                <p class="mt-3"><strong>Advance Search &gt; Select Specific Month and Year</strong</p>
            `);
        } else {
            setSubmitting(true);
            const _request = { ...reduceArraytoObj(lfRef.current as any), ...reduceArraytoObj(afRef.current) };
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
                    const _applicableRows = _rows.filter((x: any) => x.auditted === ACTIVITY_TYPE.AUDIT && x.status !== ACTIVITY_STATUS.AUDITED && x.status !== ACTIVITY_STATUS.SUBMITTED);
                    const _published = _applicableRows.filter((x: any) => x.published);
                    if (_published.length > 0) {
                        setAlertMessage('All the activities are published for the selected month and year. See Audit report for more details.');
                    } else if (_applicableRows.length) {
                        setSelectedRows(_applicableRows);
                        setSubmitToAuditor(true);
                    } else {
                        toast.warn('There are no activities available for submission.');
                    }
                }
            }).finally(() => setSubmitting(false));
        }
    }

    function onSubmitToAuditorHandler(e: any) {
        preventDefault(e);
        setSubmitting(true);
        const ids = selectedRows.map(x => x.id);
        api.post('/api/ToDo/SubmitToAudit', ids).then(() => {
            toast.success('Selected activities submitted successfully.');
            refetch();
            setSubmitToAuditor(false);
        }).finally(() => setSubmitting(false));
    }

    function onFormStatusChangeHandler(e: any) {
        setCheckedStatuses({
            ...(checkedStatuses || {}),
            [e.target.name]: e.target.checked
        });
    }

    function search(event: any) {
        const _filters: any = [];
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

    function MonthTmpl({ cell }: any) {
        const row = cell.getData();
        return (
            <>{row.month} ({row.year})</>
        )
    }
    function DueDateTmpl({ cell }: any) {
        const value = cell.getValue();
        return (
            <span className="text-warn" >{dayjs(value).format('DD-MM-YYYY')}</span>
        )
    }

    function ActionHeaderTmpl() {
        return (
            <div className={`nav-item dropdown ${styles.tableActions}`}>
                <div className="nav-link text-white" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon icon={faEllipsisV} />
                </div>
                <div className="dropdown-menu">
                    <a className="dropdown-item" href="/" onClick={handleExport}>Export</a>
                    {
                    selectedRows.length !== 0 && 
                    <a className="dropdown-item" onClick={(e) => {e.preventDefault();setVendorUpload(true)}}>Bulk Upload</a>
                    }
                </div>
            </div>
        )
    }

    function FormStatusTmpl({ cell }: any) {
        const status = cell.getValue();
        const row = cell.getData();
        return (
            <div className="d-flex align-items-center position-relative">
                {
                    !!row.formsStatusRemarks &&
                    <OverlayTrigger overlay={<Tooltip>{row.formsStatusRemarks}</Tooltip>}
                        placement="bottom" delay={{ show: TOOLTIP_DELAY } as any}>
                        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    </OverlayTrigger>
                }
                <span className={`status-${status} ellipse`}>{STATUS_MAPPING[status] || status}</span>
            </div>
        )
    }

    function AuditStatusTmpl({ cell }: any) {
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
                        placement="bottom" delay={{ show: TOOLTIP_DELAY } as any}>
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

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative">
                <Icon className="mx-2" type="button" name={hasUserAccess(USER_PRIVILEGES.SUBMITTER_ACTIVITIES_UPLOAD) ? 'pencil' : 'eye'}
                    text={hasUserAccess(USER_PRIVILEGES.SUBMITTER_ACTIVITIES_UPLOAD) ? 'Edit' : 'View'} data={row} action={editActivity} />
                <Icon className="ms-1" type="button" name="download" text="Download" data={row} action={downloadForm} />
            </div>
        )
    }

    function ActivityTypeTmpl({ cell }: any) {
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
            headerClick: (e: any, col: any) => {
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
            title: "Compliance Status", field: "auditStatus", maxWidth: 160,
            formatter: reactFormatter(<AuditStatusTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Evidence Status", field: "status", maxWidth: 160,
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
        selectable: getUserRole() === 'Vendor User' ? true : false,
        paginate: true,
        initialSort: [{ column: 'month', dir: 'desc' }],
        rowFormatter
    });

    function rowFormatter(row: any) {
        const data = row.getData();
        const element = row.getElement();
        if (data.published) {
            element.classList.add('activity-published');
        }
    }

    function formatApiResponse(params: any, list: any, totalRecords: number) {
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

    function hasFilters(ref: any, field = 'companyId') {
        const _filters: any = (ref ? ref.current : ({ ...(payloadRef.current || {}) } as any)['filters']) || [];
        const company = _filters.find((x: any) => x.columnName === field);
        return (company || {}).value;
    }

    function ajaxRequestFunc(url: any, config: any, params: any) {
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

    function handlePageNav(_pagination: any) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...(payload as any), ..._params });
    }

    function getAdvanceSearchPayload() {
        const _filters = [...(afRef.current || [])];
        const _payload: any = {};
        _filters.forEach(x => {
            _payload[x.columnName] = x.value;
        });
        return _payload;
    }

    function handleVendorBulkUploadClose(refresh = false) {
        if (refresh) {
            refetch();
        }
        setVendorUpload(false);
    }
    function handleBulkUploadClose(refresh = false) {
        if (refresh) {
            refetch();
        }
        setBulkUpload(false);
    }

    function handleExport(event: any) {
        event.preventDefault();
        if (total < 1) {
            toast.warn('There are no records available for this filter criteria.');
            return;
        }
        const _payload = {
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
            ],
            pagination: null
        };
        exportTodos(_payload);
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
                    ...(advaceSearchFilters || []),
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
                    ...(statusFilters || []),
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
                                    downloadReport={hasUserAccess(USER_PRIVILEGES.SUBMITTER_ACTIVITIES_DOWNLOAD_REPORT) ? downloadReport : undefined} />
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
                                                <label className={`btn bg-status-${btn.name}`} htmlFor={btn.name}>{btn.label}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div className="d-flex">
                                <TableActions buttons={buttons} />

                            </div>
                        </div>
                    </div>
                </form>
                <div className="position-relative">
                    <ActionHeaderTmpl />
                    <Table data={data} options={tableConfig} isLoading={isFetching}
                        onSelectionChange={setSelectedRows} onPageNav={handlePageNav} />
                </div>
            </div>

            {
                vendorUpload &&
                <VendorBulkUploadModal onClose={handleVendorBulkUploadClose} selectedItems={selectedRows} />
            }
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
                !!activity && selectedRows.length >= 0 &&
                <EditActivityModal activity={activity} onClose={() => setActivity(null)} onSubmit={refetch} selectedItems={selectedRows} />
            }
            {
                !!alertMessage &&
                <AlertModal message={alertMessage} onClose={(e: any) => {
                    preventDefault(e);
                    setAlertMessage(null);
                }} />
            }
            {
                action === ACTIONS.SEND_REPORT &&
                <SendEmailModal onCancel={() => setAction(ACTIONS.NONE)} />
            }
            {(submitting || exporting || exportingTodos) && <PageLoader />}
        </>
    ); 
}

export default ActivitiesManagement;
