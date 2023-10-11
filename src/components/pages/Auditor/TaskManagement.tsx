import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
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
import { download, downloadFileContent, preventDefault, reduceArraytoObj } from "../../../utils/common";
import PublishModal from "./PublishModal";
import ActivityModal from "./ActivityModal";
import { getUserDetails, hasUserAccess } from "../../../backend/auth";
import { useAuditReport } from "../../../backend/exports";
import { ACTIVITY_TYPE, ACTIVITY_TYPE_ICONS, API_DELIMITER, ERROR_MESSAGES } from "../../../utils/constants";
import { useExportTodos, useGetAllActivities } from "../../../backend/query";
import { USER_PRIVILEGES } from "../UserManagement/Roles/RoleConfiguration";

const STATUS_BTNS = [
    { name: ACTIVITY_STATUS.ACTIVITY_SAVED, label: STATUS_MAPPING[ACTIVITY_STATUS.ACTIVITY_SAVED], style: 'secondary' },
    { name: ACTIVITY_STATUS.PENDING, label: STATUS_MAPPING[ACTIVITY_STATUS.PENDING], style: 'warning' },
    { name: ACTIVITY_STATUS.OVERDUE, label: STATUS_MAPPING[ACTIVITY_STATUS.OVERDUE], style: 'danger' },
    { name: ACTIVITY_STATUS.SUBMITTED, label: STATUS_MAPPING[ACTIVITY_STATUS.SUBMITTED], style: 'danger' },
    { name: ACTIVITY_STATUS.REJECTED, label: STATUS_MAPPING[ACTIVITY_STATUS.REJECTED], style: 'danger' },
    { name: ACTIVITY_STATUS.AUDITED, label: STATUS_MAPPING[ACTIVITY_STATUS.AUDITED], style: 'danger' }
];

const ACTIONS = {
    EDIT: 1,
    VIEW: 2
};

const SortFields: any = {
    'act.name': 'actname',
    'rule.name': 'rulename',
    'activity.name': 'activityname',
    'activity.type': 'activitytype',
    'associateCompany.name': 'associatecompanyname',
    'location.name': 'locationname'
};

function TaskManagement() {
    const [statusBtns] = useState(STATUS_BTNS);
    const [submitting, setSubmitting] = useState(false);
    const [checkedStatuses, setCheckedStatuses] = useState<any>({});
    const [activity, setActivity] = useState<any>(null);
    const [action, setAction] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [locationFilters, setLocationFilter] = useState<any>();
    const lfRef: any = useRef();
    lfRef.current = locationFilters;
    const [advaceSearchFilters, setAdvanceSearchFilters] = useState<any>();
    const afRef: any = useRef();
    afRef.current = advaceSearchFilters;
    const [statusFilters, setStatusFilters] = useState<any>([{ columnName: 'status', value: STATUS_BTNS.map(x => x.name).join(API_DELIMITER) }]);
    const sfRef: any = useRef();
    sfRef.current = statusFilters;
    const [payload, setPayload] = useState<any>();
    const payloadRef: any = useRef();
    payloadRef.current = payload;
    const { activities, total, isFetching, refetch } = useGetAllActivities(payload, Boolean(hasFilters(null, 'companyId')));
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [alertMessage, setAlertMessage] = useState<any>(null);
    const [publish, setPublish] = useState(false);
    const { auditReport, exporting } = useAuditReport((response: any) => {
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

    const { exportTodos, exporting: exportingTodos } = useExportTodos((response: any) => {
        downloadFileContent({
            name: 'Audit Activities.xlsx',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    function hasFilters(ref: any, field = 'companyId') {
        const _filters = (ref ? ref.current : { ...(payloadRef.current || {}) }.filters) || [];
        const company = _filters.find((x: any) => x.columnName === field);
        return (company || {}).value;
    }

    function onLocationChange(event: any) {
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

    function editActivity(activity: any) {
        setAction(ACTIONS.EDIT);
        setActivity(activity);
    }

    function downloadReport(event: any) {
        preventDefault(event);
        setSubmitting(true);
        const _request = { ...reduceArraytoObj(lfRef.current), ...reduceArraytoObj(afRef.current) };
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

    function publishActivity(e: any) {
        preventDefault(e);
        const _filter = hasFilters(afRef, 'month');
        if (!Boolean(_filter)) {
            setAlertMessage(`
                <div class="mb-2">Publish activities can be performed on a specfic month only. Please refine your search to specific month and year.</div>
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
                statuses: STATUS_BTNS.map(x => x.name)
            };
            api.post('/api/ToDo/GetToDoByCriteria', _payload).then(response => {
                if (response && response.data) {
                    const _rows = response.data || [];
                    const auditableRows = _rows.filter((x: any) => [ACTIVITY_TYPE.AUDIT, ACTIVITY_TYPE.PHYSICAL_AUDIT].includes(x.auditted));
                    const submittedRows = auditableRows.filter((x: any) => [ACTIVITY_STATUS.SUBMITTED, ACTIVITY_STATUS.PENDING, ACTIVITY_STATUS.OVERDUE, ACTIVITY_STATUS.ACTIVITY_SAVED].includes(x.status));
                    const published = _rows.filter((x: any) => x.published);
                    if (_rows.length === 0) {
                        setAlertMessage(
                            `<p class="my-3">There are no activties available for the selected month and year.</p>`
                        );
                    } else if (published.length > 0) {
                        setAlertMessage(
                            `<p class="my-3">All activites are published of the selected month and year. View Audit report for more details.</p>`
                        );
                    } else if (submittedRows.length > 0) {
                        setAlertMessage(
                            `<p class="my-3">There are ${submittedRows.length} activities not reviewed for the selected month and year.</p>
                            <p>Review them before publishing.</p>`
                        );
                    } else if (_rows.length > 0) {
                        setSelectedRows(_rows);
                        setPublish(true);
                    }
                }
            }).finally(() => setSubmitting(false));
        }
    }

    function onPublish(e: any, recommendations: any) {
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

    function onFormStatusChangeHandler(e: any) {
        setCheckedStatuses({
            ...(checkedStatuses || {}),
            [e.target.name]: e.target.checked
        });
    }

    function MonthTmpl({ cell }: any) {
        const row = cell.getData();
        return (
            <>{row.month} ({row.year})</>
        )
    }

    function DueDateTmpl({ cell }: any) {
        const value = cell.getValue();
        const { auditted = ACTIVITY_TYPE.AUDIT } = cell.getData();
        return (
            <>
                {
                    auditted !== ACTIVITY_TYPE.NO_AUDIT && value !== '0001-01-01T00:00:00' &&
                    <span className="text-warn" >{dayjs(value).format('DD-MM-YYYY')}</span>
                }
            </>
        )
    }


    function ActionHeaderTmpl() {
        return (
            <div className={`nav-item dropdown todoTableActions`}>
                <div className="nav-link text-white" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon icon={faEllipsisV} />
                </div>
                <div className="dropdown-menu">
                    <a className="dropdown-item" href="/" onClick={handleExport}>Export</a>
                </div>
            </div>
        )
    }

    function FormStatusTmpl({ cell }: any) {
        const status = cell.getValue();
        const { formsStatusRemarks, published, auditted = ACTIVITY_TYPE.AUDIT } = cell.getData() || {};
        return (
            <div className="d-flex align-items-center position-relative">
                {
                    !!formsStatusRemarks &&
                    <OverlayTrigger overlay={<Tooltip>{formsStatusRemarks}</Tooltip>}
                        placement="bottom" delay={{ show: TOOLTIP_DELAY } as any}>
                        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    </OverlayTrigger>
                }
                {
                    (auditted !== ACTIVITY_TYPE.NO_AUDIT || published) &&
                    <span className={`status-${status} ellipse`}>{STATUS_MAPPING[status] || status}</span>
                }
            </div>
        )
    }

    function AuditStatusTmpl({ cell }: any) {
        const status = cell.getValue();
        const { auditRemarks, published, auditted = ACTIVITY_TYPE.AUDIT } = cell.getData() || {};
        const color = {
            [AUDIT_STATUS.COMPLIANT]: 'status-compliant',
            [AUDIT_STATUS.NON_COMPLIANCE]: 'status-non-compliance',
            [AUDIT_STATUS.NOT_APPLICABLE]: 'status-not-applicable',
        }
        return (
            <div className="d-flex align-items-center position-relative">
                {
                    !!auditRemarks &&
                    <OverlayTrigger overlay={<Tooltip>{auditRemarks}</Tooltip>}
                        placement="bottom" delay={{ show: TOOLTIP_DELAY } as any}>
                        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    </OverlayTrigger>
                }
                {
                    (auditted !== ACTIVITY_TYPE.NO_AUDIT || published) && status &&
                    <span className={`${color[status]} ellipse`}>{STATUS_MAPPING[status] || status}</span>
                }
            </div>
        )
    }

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <>
                {
                    row.auditted !== ACTIVITY_TYPE.NO_AUDIT &&
                    <div className="d-flex flex-row align-items-center position-relative">
                        <Icon className="mx-1" type="button" name="download" text="Download" data={row} action={downloadForm} />
                        {
                            ((row.auditted === ACTIVITY_TYPE.AUDIT
                                && [ACTIVITY_STATUS.SUBMITTED, ACTIVITY_STATUS.AUDITED, ACTIVITY_STATUS.REJECTED].includes(row.status))
                                || row.auditted === ACTIVITY_TYPE.PHYSICAL_AUDIT) &&
                            <Icon className="mx-2" type="button" name={hasUserAccess(USER_PRIVILEGES.REVIEWER_ACTIVITIES_AUDIT) ? 'pencil' : 'eye'}
                                text={hasUserAccess(USER_PRIVILEGES.REVIEWER_ACTIVITIES_AUDIT) ? 'Edit' : 'View'} data={row} action={editActivity} />
                        }
                    </div>
                }
            </>
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
            formatter: reactFormatter(<ActivityTypeTmpl />),
            // headerSort: false
        },
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
            title: "Forms Status", field: "status", width: 160,
            formatter: reactFormatter(<FormStatusTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Actions", hozAlign: "center", width: 120,
            headerSort: false,
            formatter: reactFormatter(<ActionColumnElements />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        }
    ]

    function rowFormatter(row: any) {
        const data = row.getData();
        const element = row.getElement();
        if (data.published) {
            element.classList.add('activity-published');
        }
        if (data.auditted === ACTIVITY_TYPE.NO_AUDIT) {
            element.classList.add('activity-no-audit');
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

    function formatApiResponse(params: any, list: any[], totalRecords: number) {
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
                ...(sfRef.current || [])
            ]
        });
        return Promise.resolve(formatApiResponse(params, activities, total));
    }

    function handlePageNav(_pagination: any) {
        const _params: any = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params })
    }

    function getAdvanceSearchPayload() {
        const _filters = [...(afRef.current || [])];
        const _payload: any = {};
        _filters.forEach(x => {
            _payload[x.columnName] = x.value;
        });
        return _payload;
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
                ...(sfRef.current || [])
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
                <div className="d-flex p-2 align-items-center pageHeading shadow">
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
                    <div className="card shadow border-0 p-2 mt-2 mb-3 filters">
                        <div className="d-flex flex-row m-0">
                            <Location onChange={onLocationChange} />
                            <div className="col-5">
                                <AdvanceSearch fields={[FILTERS.MONTH, FILTERS.SUBMITTED_DATE]} payload={getAdvanceSearchPayload()} onSubmit={search}
                                    downloadReport={hasUserAccess(USER_PRIVILEGES.REVIEWER_ACTIVITIES_DOWNLOAD_REPORT) ? downloadReport : undefined} />
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
                            {
                                hasUserAccess(USER_PRIVILEGES.REVIEWER_ACTIVITIES_PUBLISH) &&
                                <div className="d-flex">
                                    <button className="btn btn-success" onClick={publishActivity}>
                                        <div className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={faSave} />
                                            <span className="ms-2">Publish</span>
                                        </div>
                                    </button>
                                </div>
                            }
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
                action === ACTIONS.EDIT && Boolean(activity) &&
                <ActivityModal activity={activity} onClose={dismissAction} onSubmit={refetch} />
            }
            {
                !!alertMessage &&
                <AlertModal message={alertMessage} onClose={(e: any) => {
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
