import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, DEFAULT_PAYLOAD, TitleTmpl, reactFormatter } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import ActivityDetails from "./ActivityDetails";
import ConfirmModal from "../../common/ConfirmModal";
import { useDeleteActivity, useGetActivities } from "../../../backend/masters";
import { ActivityType, CalendarType, GetMastersBreadcrumb, Periodicity } from "./Master.constants";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";
import TableFilters from "../../common/TableFilter";
import { useRef } from "react";
import { ERROR_MESSAGES } from "../../../utils/constants";
import { downloadFileContent } from "../../../utils/common";
import { useExportActivities } from "../../../backend/exports";
import ActivitiesImportModal from "./ActivitiesImportModal";
import styles from "./Masters.module.css";
import { hasUserAccess } from "../../../backend/auth";
import { USER_PRIVILEGES } from "../UserManagement/Roles/RoleConfiguration";
import TableActions, { ActionButton } from "../../common/TableActions";

function Activity() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Activity'));
    const [action, setAction] = useState(ACTIONS.NONE);
    const [activity, setActivity] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { activities, total, isFetching, refetch } = useGetActivities(payload);
    const { deleteActivity, deleting } = useDeleteActivity(({ name }: any) => {
        toast.success(`Activiy ${name} deleted successfully.`);
        refetch();
    });
    const { exportActivity, exporting } = useExportActivities((response: any) => {
        downloadFileContent({
            name: 'Activities.xlsx',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    const buttons: ActionButton[] = [{
        label: 'Add New',
        name: 'addNew',
        privilege: USER_PRIVILEGES.ADD_ACTIVITY,
        icon: 'plus',
        action: () => setAction(ACTIONS.ADD)
    }, {
        label: 'Export',
        name: 'export',
        privilege: USER_PRIVILEGES.EXPORT_ACTIVITIES,
        icon: 'download',
        disabled: !total,
        action: handleExport
    }, {
        label: 'Import',
        name: 'import',
        privilege: USER_PRIVILEGES.ADD_ACTIVITY,
        icon: 'upload',
        action: () => setAction(ACTIONS.IMPORT)
    }];

    const filterConfig = [
        {
            label: 'Type',
            name: 'type',
            options: ActivityType.map((x: any) => {
                return { value: x, label: x };
            })
        },
        {
            label: 'Periodicity',
            name: 'periodicity',
            options: Periodicity.map((x: any) => {
                return { value: x, label: x };
            })
        },
        {
            label: 'Calendar Type',
            name: 'calendarType',
            options: CalendarType.map((x: any) => {
                return { value: x, label: x };
            })
        }
    ]

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                {
                    hasUserAccess(USER_PRIVILEGES.EDIT_ACTIVITY) &&
                    <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                        setActivity(row);
                        setAction(ACTIONS.EDIT)
                    }} />
                }
                {
                    // hasUserAccess(USER_PRIVILEGES.DELETE_ACTIVITY) &&
                    // <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                    //     setActivity(row);
                    //     setAction(ACTIONS.DELETE)
                    // }} />
                }
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setActivity(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        {
            title: "Activity", field: "name", widthGrow: 2,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Type", field: "type",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Periodicity", field: "periodicity",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Calendar Type", field: "calendarType",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Actions", hozAlign: "center", width: 140,
            headerSort: false, formatter: reactFormatter(<ActionColumnElements />)
        }
    ]

    const [tableConfig] = useState({
        paginationMode: 'remote',
        ajaxRequestFunc,
        columns,
        rowHeight: 54,
        selectable: false,
        paginate: true,
        initialSort: [{ column: 'name', dir: 'asc' }]
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
                columnName: field || 'name',
                order: dir || 'asc'
            }
        };
        setParams(_params);
        setPayload({ ...DEFAULT_PAYLOAD, ...filterRef.current, ..._params });
        return Promise.resolve(formatApiResponse(params, activities, total));
    }

    function successCallback() {
        setAction(ACTIONS.NONE);
        setActivity(null);
        refetch();
    }

    function cancelCallback() {
        setAction(ACTIONS.NONE);
        setActivity(null);
    }

    function onDelete() {
        deleteActivity(activity);
    }

    function onFilterChange(e: any) {
        setFilters(e);
        setPayload({ ...DEFAULT_PAYLOAD, ...params, ...e });
    }

    function handlePageNav(_pagination: any) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params })
    }

    function handleExport() {
        exportActivity({ ...payload, pagination: null });
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, activities, total));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Activity" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                    placeholder={"Search for Activity"} />
                                <TableActions buttons={buttons} />
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <ActivityDetails action={action} data={action !== ACTIONS.ADD ? activity : null}
                    onClose={cancelCallback} onSubmit={successCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Activity Master'} onSubmit={onDelete} onClose={cancelCallback}>
                    <div className="text-center mb-4">Are you sure you want to delete the Activity, <strong>{(activity || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {
                action === ACTIONS.IMPORT &&
                <ActivitiesImportModal onSubmit={refetch} onClose={() => setAction(ACTIONS.NONE)} />
            }
            {
                deleting && <PageLoader>Deleting...</PageLoader>
            }
            {
                exporting && <PageLoader>Preparing Data...</PageLoader>
            }

        </>
    )
}

export default Activity;