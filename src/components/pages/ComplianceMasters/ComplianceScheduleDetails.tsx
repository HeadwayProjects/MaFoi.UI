import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { ACTIONS } from "../../common/Constants";
import { ACTIVITY_TYPE, ACTIVITY_TYPE_ICONS, API_DELIMITER, API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import { useDeleteComplianceSchedule, useGetAllComplianceActivities } from "../../../backend/compliance";
import Icon from "../../common/Icon";
import Table, { CellTmpl, DEFAULT_PAYLOAD, TitleTmpl, reactFormatter } from "../../common/Table";
import { preventDefault } from "../../../utils/common";
import AlertModal from "../../common/AlertModal";
import ConfirmModal from "../../common/ConfirmModal";
import PageLoader from "../../shared/PageLoader";
import { hasUserAccess } from "../../../backend/auth";
import { USER_PRIVILEGES } from "../UserManagement/Roles/RoleConfiguration";
import ComplianceAssignUser from "./ComplianceAssignUser";
import MastersLayout from "../Masters/MastersLayout";
import { GetComplianceBreadcrumb } from "./Compliance.constants";
import { COMPLIANCE_ACTIVITY_INDICATION, ComplianceActivityStatus, ComplianceStatusMapping } from "../../../constants/Compliance.constants";
import ComplianceScheduleAdvanceFilter from "./ComplianceScheduleAdvanceFilter";
import TableActions, { ActionButton } from "../../common/TableActions";
import OptionalLocations from "../../common/OptionalLocations";

const SortFields: any = {
    'act.name': 'actname',
    'rule.name': 'rulename',
    'activity.name': 'activityname',
    'associateCompany.name': 'associatecompanyname',
    'location.name': 'locationname',
    'activity.type': 'activityType',
    'veritical.name': 'verticalName'
};

function ComplianceScheduleDetails(this: any) {
    const [breadcrumb] = useState(GetComplianceBreadcrumb('Compliance Schedule Details'));
    const [activity, setActivity] = useState<any>();
    const [action, setAction] = useState(ACTIONS.NONE);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [locationFilters, setLocationFilter] = useState<any>();
    const lfRef: any = useRef();
    lfRef.current = locationFilters;
    const [advaceSearchFilters, setAdvanceSearchFilters] = useState<any>();
    const afRef: any = useRef();
    afRef.current = advaceSearchFilters;
    const [statusFilters] = useState([{ columnName: 'status', value: [ComplianceActivityStatus.DUE, ComplianceActivityStatus.NON_COMPLIANT].join(API_DELIMITER) }]);
    const sfRef: any = useRef();
    sfRef.current = statusFilters;
    const [payload, setPayload] = useState<any>();
    const payloadRef: any = useRef();
    payloadRef.current = payload;
    const { activities, total, isFetching, refetch } = useGetAllComplianceActivities(payload, Boolean(payload));
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [alertMessage, setAlertMessage] = useState<any>(null);
    const { deleteComplianceSchedule, deleting } = useDeleteComplianceSchedule(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success('Activity deleted successfully.');
            dismissAction();
            refetch();
        } else {
            toast.error(value || ERROR_MESSAGES.DEFAULT)
        }
    });

    const buttons: ActionButton[] = [
        {
            label: 'Assign User',
            name: 'assignUser',
            icon: 'people',
            disabled: !(selectedRows || []).length,
            action: handleAssignUser,
            privilege: USER_PRIVILEGES.ASSIGN_COMPLIANCE_SCHEDULE_DETAILS
        }, {
            label: 'Bulk Delete',
            name: 'bulkDelete',
            icon: 'trash',
            disabled: !(selectedRows || []).length,
            action: handleBulkDelete,
            privilege: USER_PRIVILEGES.DELETE_COMPLIANCE_SCHEDULE_DETAILS
        }
    ];

    function hasFilters(ref: any, field = 'companyId') {
        const _filters = (ref ? ref.current : { ...(payloadRef.current || {}) }.filters) || [];
        const company = _filters.find((x: any) => x.columnName === field);
        return (company || {}).value;
    }

    function onLocationChange(event: any) {
        const keys = Object.keys(event);
        setLocationFilter(keys.map(key => ({ columnName: key, value: event[key] })));
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

    function dismissAction() {
        setAction(ACTIONS.NONE);
        setActivity(null);
    }

    function MonthTmpl({ cell }: any) {
        const row = cell.getData();
        return (
            <div className="ellipse two-lines">{row.month} ({row.year})</div>
        )
    }

    function DueDateTmpl({ cell }: any) {
        const value = cell.getValue();
        return (
            <span className="text-warn" >{dayjs(value).format('DD-MM-YYYY')}</span>
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

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative">
                {
                    hasUserAccess(USER_PRIVILEGES.ASSIGN_COMPLIANCE_SCHEDULE_DETAILS) &&
                    <Icon className="me-3" type="button" name="people" text="Assign User" data={row} action={handleSingleAssign} />
                }
                {
                    hasUserAccess(USER_PRIVILEGES.DELETE_COMPLIANCE_SCHEDULE_DETAILS) &&
                    <Icon type="button" name="trash" text="Delete" data={row} action={handleDelete} />
                }
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
            title: "Month (Year)", field: "month", width: 100,
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
            titleFormatter: reactFormatter(<TitleTmpl />),
            minWidth: 140
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
            title: "Actions", hozAlign: "center", width: 120,
            headerSort: false,
            formatter: reactFormatter(<ActionColumnElements />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        }
    ];

    function rowFormatter(row: any) {
        const data = row.getData();
        const element = row.getElement();
        if (data.isNotice) {
            element.classList.add('notice-activity');
        }
    }

    const [tableConfig] = useState({
        paginationMode: 'remote',
        ajaxRequestFunc,
        columns,
        rowHeight: 'auto',
        selectable: true,
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
        const _params = { ...params };
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

    function handleSingleAssign(_activity: any) {
        setActivity(_activity)
        setAction(ACTIONS.ASSIGN_SINGLE);
    }

    function handleDelete(_activity: any) {
        setActivity(_activity)
        setAction(ACTIONS.DELETE);
    }

    function handleCancel(refresh = false) {
        setAction(ACTIONS.NONE);
        if (refresh) {
            refetch();
        }
    }

    function performDelete() {
        deleteComplianceSchedule([activity.id]);
    }
    function performBulkDelete() {
        deleteComplianceSchedule(selectedRows.map((x: any) => x.id));
    }

    function handleBulkDelete() {
        if ((selectedRows || []).length > 0) {
            setAction(ACTIONS.BULK_DELETE);
        }
    }

    function handleAssignUser() {
        if ((selectedRows || []).length > 0) {
            setAction(ACTIONS.ASSIGN_BULK);
        }
    }

    function handleCopyTo() {
        if ((selectedRows || []).length > 0) {
            setAction(ACTIONS.COPY_TO);
        }
    }

    function onSelectionChange(_selectedRows: any) {
        setSelectedRows(_selectedRows);
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
        if (!isFetching && payload) {
            setSelectedRows([]);
            setData(formatApiResponse(params, activities, total));
        }
    }, [isFetching])

    return (
        <>
            <MastersLayout title="Compliance Schedule Details" breadcrumbs={breadcrumb}>
                <form className="p-0 mx-3 my-2">
                    <div className="card shadow border-0 p-2 mt-2 mb-3 filters">
                        <div className="d-flex flex-row m-0 align-items-end">
                            <OptionalLocations onChange={onLocationChange} />
                            <div>
                                <ComplianceScheduleAdvanceFilter onChange={search} />
                            </div>
                            <TableActions buttons={buttons} />
                        </div>
                    </div>
                </form>
                <Table data={data} options={tableConfig} isLoading={isFetching} onSelectionChange={onSelectionChange.bind(this)} onPageNav={handlePageNav} />
            </MastersLayout>
            {
                !!alertMessage &&
                <AlertModal message={alertMessage} onClose={(e: any) => {
                    preventDefault(e);
                    setAlertMessage(null);
                }} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Activity'} onSubmit={performDelete} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the activity ?</div>
                </ConfirmModal>
            }
            {
                action === ACTIONS.BULK_DELETE &&
                <ConfirmModal title={'Delete Activities'} onSubmit={performBulkDelete} onClose={() => setAction(ACTIONS.NONE)}>
                    <p className="text-center mb-4">There are {selectedRows.length} record(s) selected for deleting.</p>
                    <div className="text-center mb-4">Are you sure you want to delete all of them ?</div>
                </ConfirmModal>
            }
            {
                (action === ACTIONS.ASSIGN_BULK || action === ACTIONS.ASSIGN_SINGLE) &&
                <ComplianceAssignUser action={action}
                    activities={action === ACTIONS.ASSIGN_BULK ? selectedRows : [activity]} onCancel={handleCancel} />
            }
            {deleting && <PageLoader message={'Deleting...'} />}
        </>
    );

}

export default ComplianceScheduleDetails;