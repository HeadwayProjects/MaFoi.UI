import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button, InputGroup } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, TitleTmpl, reactFormatter } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import ActivityDetails from "./ActivityDetails";
import ConfirmModal from "../../common/ConfirmModal";
import { useDeleteActivity, useGetActivities } from "../../../backend/masters";
import { GetMastersBreadcrumb } from "./Master.constants";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";

function Activity() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Activity'));
    const [search, setSearch] = useState(null);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [activity, setActivity] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [payload, setPayload] = useState();
    const { activities, isFetching, refetch } = useGetActivities();
    const { deleteActivity, deleting } = useDeleteActivity(({name}) => {
        toast.success(`Activiy ${name} deleted successfully.`);
        refetch();
    });

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
        setPayload(search ? { ...params, search } : { ...params });
        return Promise.resolve(formatApiResponse(params, activities));
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

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, activities));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Activity" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0 mt-4">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <div className="col-12 px-4">
                            <div className="d-flex">
                                {/* <InputGroup>
                                    <input type="text" className="form-control" placeholder="Search for Activity / Code / Name" />
                                    <InputGroup.Text style={{ backgroundColor: 'var(--blue)' }}>
                                        <div className="d-flex flex-row align-items-center text-white">
                                            <Icon name={'search'} />
                                            <span className="ms-2">Search</span>
                                        </div>
                                    </InputGroup.Text>
                                </InputGroup> */}
                                <Button variant="primary" className="px-4 ms-auto text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>Add New Activity</Button>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} />
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