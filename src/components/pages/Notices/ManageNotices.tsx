import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { ACTIONS } from "../../common/Constants";
import Table, { CellTmpl, DEFAULT_PAGE_SIZE, TitleTmpl, reactFormatter } from "../../common/Table";
import { useDeleteComplianceSchedule, useGetAllComplianceActivities } from "../../../backend/compliance";
import TableActions, { ActionButton } from "../../common/TableActions";
import { USER_PRIVILEGES } from "../UserManagement/Roles/RoleConfiguration";
import { hasUserAccess, isAdmin, isComplianceUser } from "../../../backend/auth";
import Icon from "../../common/Icon";
import { COMPLIANCE_ACTIVITY_INDICATION, ComplianceActivityStatus, ComplianceStatusMapping } from "../../../constants/Compliance.constants";
import MastersLayout from "../Masters/MastersLayout";
import ConfirmModal from "../../common/ConfirmModal";
import AddEditNotice from "./AddEditNotice";
import styles from "./Notices.module.css";
import NoticeFilters from "./NoticeFilters";
import ComplianceAssignUser from "../ComplianceMasters/ComplianceAssignUser";
import OptionalLocations from "../../common/OptionalLocations";
import ComplianceScheduleAdvanceFilter from "../ComplianceMasters/ComplianceScheduleAdvanceFilter";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import { toast } from "react-toastify";
import PageLoader from "../../shared/PageLoader";
import Location from "../../common/Location";
import ComplianceOwnerFilters from "../ComplianceOwner/ComplianceOwnerFilters";

const DEFAULT_PAYLOAD = {
    pagination: {
        pageSize: DEFAULT_PAGE_SIZE,
        pageNumber: 1
    },
    filters: [],
    search: ''
}

const SortFields: any = {
    'act.name': 'actname',
    'rule.name': 'rulename',
    'activity.name': 'activityname',
    'activity.type': 'activitytype',
    'associateCompany.name': 'associatecompanyname',
    'location.name': 'locationname'
};

function ManageNotices() {
    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'notices', label: 'Notices', path: '/notices' }
    ]);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [notice, setNotice] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [locationFilters, setLocationFilter] = useState<any>();
    const lfRef: any = useRef();
    lfRef.current = locationFilters;
    const [advaceSearchFilters, setAdvanceSearchFilters] = useState<any>();
    const afRef: any = useRef();
    afRef.current = advaceSearchFilters;
    const [payload, setPayload] = useState<any>(null);
    const payloadRef: any = useRef();
    payloadRef.current = payload;
    const { activities, total, isFetching, refetch } = useGetAllComplianceActivities(payload, hasFilters(null));
    const { deleteComplianceSchedule, deleting } = useDeleteComplianceSchedule(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success('Notice deleted successfully.');
            handleCancel(true);
        } else {
            toast.error(value || ERROR_MESSAGES.DEFAULT)
        }
    });

    const buttons: ActionButton[] = [{
        label: 'Add Notice',
        name: 'addNew',
        privilege: USER_PRIVILEGES.ADD_NOTICE,
        icon: 'plus',
        action: () => setAction(ACTIONS.ADD)
    }];

    function hasFilters(ref: any) {
        const _filters = (ref ? ref.current : { ...(payloadRef.current || {}) }.filters) || [];
        const isNotice = _filters.find((x: any) => x.columnName === 'isNotice');
        const hasNoticefilter = Boolean((isNotice || {}).value);
        if (isAdmin()) {
            return hasNoticefilter;
        } else if (isComplianceUser()) {
            const company = _filters.find((x: any) => x.columnName === 'companyId');
            return hasNoticefilter && Boolean((company || {}).value);
        } else {
            const location = _filters.find((x: any) => x.columnName === 'locationId');
            return hasNoticefilter && Boolean((location || {}).value);
        }
    }

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100 gap-3">
                <Icon type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setNotice(row);
                    setAction(ACTIONS.VIEW)
                }} />
                {/* <Icon name="download" text={'Download Form'} data={row} action={downloadForm} /> */}
                {
                    hasUserAccess(USER_PRIVILEGES.ASSIGN_NOTICE) &&
                    <Icon type="button" name={'people'} text={'Assign'} data={row} action={() => {
                        setNotice(row);
                        setAction(ACTIONS.ASSIGN_SINGLE)
                    }} disabled={![ComplianceActivityStatus.DUE, ComplianceActivityStatus.NON_COMPLIANT].includes(row.status)} />
                }
                {
                    hasUserAccess(USER_PRIVILEGES.EDIT_NOTICE) &&
                    <Icon type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                        setNotice(row);
                        setAction(ACTIONS.EDIT)
                    }} disabled={![ComplianceActivityStatus.DUE, ComplianceActivityStatus.NON_COMPLIANT].includes(row.status)} />
                }
                {
                    // hasUserAccess(USER_PRIVILEGES.DELETE_NOTICE) &&
                    // <Icon type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                    //     setNotice(row);
                    //     setAction(ACTIONS.DELETE)
                    // }} />
                }

            </div>
        )
    }

    function FormStatusTmpl({ cell }: any) {
        const status = cell.getValue();
        return (
            <div className="d-flex align-items-center position-relative">
                <span className="ellipse" style={{ color: COMPLIANCE_ACTIVITY_INDICATION[status] || '' }}>{ComplianceStatusMapping[status] || status}</span>
            </div>
        )
    }

    function FormIndicationTmpl({ cell }: any) {
        const status = cell.getValue();
        return (
            <div className="d-flex align-items-center">
                <Icon name="circle" style={{ color: COMPLIANCE_ACTIVITY_INDICATION[status] || '' }} text={ComplianceStatusMapping[status]} />
            </div>
        )
    }

    function MonthTmpl({ cell }: any) {
        const row = cell.getData();
        return (
            <div className="ellipse two-lines">{row.month} ({row.year})</div>
        )
    }

    function LocationTmpl({ cell }: any) {
        const { company, associateCompany, location } = cell.getData();
        return (
            <>{company.code}-{associateCompany.code}-{location.code}</>
        )
    }

    function DueDateTmpl({ cell }: any) {
        const value = cell.getValue();
        return (
            <span className="text-warn" >{dayjs(value).format('DD-MM-YYYY')}</span>
        )
    }

    const columns = [

        {
            title: "", width: 30, field: "status",
            headerSort: false,
            formatter: reactFormatter(<FormIndicationTmpl />)
        },
        {
            title: "Month (Year)", field: "month", width: 120,
            formatter: reactFormatter(<MonthTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Owner", field: "complianceOwner.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 1
        },
        {
            title: "Manager", field: "complianceManager.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 1
        },
        {
            title: "Vertical", field: "veritical.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 1
        },
        {
            title: "Department", field: "department.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 1
        },
        {
            title: "Location", field: "location", headerSort: false,
            formatter: reactFormatter(<LocationTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 1, minWidth: 140
        },
        {
            title: "Act", field: "act.name", widthGrow: 2, minWidth: 140, maxWidth: 300,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Rule", field: "rule.name", widthGrow: 2, minWidth: 140, maxWidth: 300,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Activity", field: "activity.name", minWidth: 140, maxWidth: 300,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 2
        },
        {
            title: "Activity Type", field: "activity.type",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            minWidth: 140, maxWidth: 200
        },
        {
            title: "Due Date", field: "dueDate", width: 120,
            formatter: reactFormatter(<DueDateTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Evidence Status", field: "status", width: 160,
            formatter: reactFormatter(<FormStatusTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "", width: 160,
            headerSort: false,
            formatter: reactFormatter(<ActionColumnElements />)
        },
    ]

    const [tableConfig] = useState({
        paginationMode: 'remote',
        ajaxRequestFunc,
        columns,
        rowHeight: 'auto',
        minHeight: '100%',
        selectable: false,
        paginate: true,
        bufferSpacing: 20,
        initialSort: [{ column: 'startDate', dir: 'desc' }]
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
                columnName: SortFields[field] || field || 'startDate',
                order: dir || 'desc'
            }
        };
        setParams(_params);
        const _payload = { ...DEFAULT_PAYLOAD, ...payloadRef.current };
        const _filters = _payload.filters || [];
        setPayload({
            ...DEFAULT_PAYLOAD,
            ..._params,
            filters: addDefaultFilters(_filters)
        });
        return Promise.resolve(formatApiResponse(params, activities, total));
    }

    function handlePageNav(_pagination: any) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params, filters: addDefaultFilters(payload.filters) })
    }

    function addDefaultFilters(_filters: any) {
        _filters = _filters || [];
        const isNotice = (_filters || []).find(({ columnName }: any) => columnName === 'isNotice');
        if (!isNotice) {
            _filters.push({ columnName: 'isNotice', value: 'true' });
        }
        return _filters;
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setNotice(null);
        refetch();
    }

    function onLocationChange(event: any) {
        const keys = Object.keys(event);
        setLocationFilter(keys.map(key => ({ columnName: key, value: event[key] })).filter(({ value }: any) => !!value));
    }

    function onLocationChangeForAuditUser({company, associateCompany, location} : any) {
        const _filters = [];
        if (company) {
            _filters.push({ columnName: 'companyId', value: company });
        }
        if (associateCompany) {
            _filters.push({ columnName: 'associateCompanyId', value: associateCompany });
        }
        if (location) {
            _filters.push({ columnName: 'locationId', value: location });
        }
        setLocationFilter(_filters);
    }

    function onLocationChangeForComplianceUser(event: any) {
        setLocationFilter(event);
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

    function performDelete() {
        deleteComplianceSchedule([notice.id]);
    }

    function handleExport() {
        setNotice({ ...payload, pagination: null });
    }

    function handleCancel(reload = false) {
        setAction(ACTIONS.NONE);
        setNotice(undefined);
        if (reload) {
            refetch();
        }
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
                filters: addDefaultFilters([
                    ...locationFilters,
                    ...(afRef.current || [])
                ])
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
                filters: addDefaultFilters([
                    ...(lfRef.current || []),
                    ...advaceSearchFilters
                ])
            });
        }
    }, [advaceSearchFilters]);

    useEffect(() => {
        if (!isFetching && payload) {
            setTimeout(() => {
                setData(formatApiResponse(params, activities, total));
            });
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Notices" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                {
                                    isAdmin() ?
                                        <OptionalLocations onChange={onLocationChange} /> :
                                        <>
                                            {
                                                isComplianceUser() ?
                                                    <ComplianceOwnerFilters onFilterChange={onLocationChangeForComplianceUser} forNotices={true} /> :
                                                    <Location onChange={onLocationChangeForAuditUser} />
                                            }
                                        </>
                                }
                                <div>
                                    <ComplianceScheduleAdvanceFilter onChange={search} filterForNotice={true} />
                                </div>
                                <TableActions buttons={buttons} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.tableWrapper}>
                        <div className={styles.flexibleContainer}>
                            <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
                        </div>
                    </div>
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <AddEditNotice action={action} data={action !== ACTIONS.ADD ? notice : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.ASSIGN_SINGLE && Boolean(notice) &&
                <ComplianceAssignUser action={action} activities={[notice]} onCancel={handleCancel} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Notice'} onSubmit={performDelete} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the notice ?</div>
                </ConfirmModal>
            }
            {deleting && <PageLoader />}
        </>
    )
}

export default ManageNotices;
