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

function Activity() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Activity'));
    const [action, setAction] = useState(ACTIONS.NONE);
    const [activity, setActivity] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [filters, setFilters] = useState();
    const filterRef = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { activities, total, isFetching, refetch } = useGetActivities(payload);
    const { deleteActivity, deleting } = useDeleteActivity(({ name }) => {
        toast.success(`Activiy ${name} deleted successfully.`);
        refetch();
    });
    const filterConfig = [
        {
            label: 'Type',
            name: 'type',
            options: ActivityType.map(x => {
                return { value: x, label: x };
            })
        },
        {
            label: 'Periodicity',
            name: 'periodicity',
            options: Periodicity.map(x => {
                return { value: x, label: x };
            })
        },
        {
            label: 'Calendar Type',
            name: 'calendarType',
            options: CalendarType.map(x => {
                return { value: x, label: x };
            })
        }
    ]

    function ActionColumnElements({ cell }) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    setActivity(row);
                    setAction(ACTIONS.EDIT)
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setActivity(row);
                    setAction(ACTIONS.DELETE)
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
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

    function onFilterChange(e) {
        setFilters(e);
        setPayload({ ...DEFAULT_PAYLOAD, ...params, ...e });
    }

    function handlePageNav(_pagination) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params })
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
                    <div className="card d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                    placeholder={"Search for Activity"}/>
                                <Button variant="primary" className="px-3 ms-auto text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>
                                    <Icon name={'plus'} className="me-2"></Icon>Add New
                                </Button>
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
                deleting && <PageLoader>Deleting...</PageLoader>
            }

        </>
    )
}

export default Activity;