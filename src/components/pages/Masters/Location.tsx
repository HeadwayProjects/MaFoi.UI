import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, reactFormatter } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import ConfirmModal from "../../common/ConfirmModal";
import { useDeleteLocation, useGetLocations } from "../../../backend/masters";
import LocationDetails from "./LocationDetails";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";

function Location() {
    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'masters', label: 'Masters', path: '/masters/act' },
        { id: 'location', label: 'Location' }
    ]);
    const [search] = useState<any>(null);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [location, setLocation] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [payload, setPayload] = useState<any>();
    const { locations, isFetching, refetch } = useGetLocations(null);
    const { deleteLocation } = useDeleteLocation(() => {
        toast.success(`${location.name} deleted successfully.`);
        setAction(ACTIONS.NONE);
        setLocation(null);
        refetch();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                    setLocation(row);
                    setAction(ACTIONS.EDIT)
                }} />
                {/* <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                    setLocation(row);
                    setAction(ACTIONS.DELETE)
                }} /> */}
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setLocation(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        { title: "Code", field: "code", formatter: reactFormatter(<CellTmpl />), width: 120 },
        { title: "Name", field: "name", formatter: reactFormatter(<CellTmpl />) },
        { title: "City", field: "cities.name", formatter: reactFormatter(<CellTmpl />) },
        { title: "State", field: "states.name", formatter: reactFormatter(<CellTmpl />) },
        {
            title: "", hozAlign: "center", width: 140,
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

    function formatApiResponse(params: any, list: any[], pagination = {}) {
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

    function ajaxRequestFunc(url: any, config: any, params: any) {
        setParams(params);
        setPayload(search ? { ...params, search } : { ...params });
        return Promise.resolve(formatApiResponse(params, locations));
    }

    function onDelete() {
        deleteLocation(location.id);
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, locations));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Location" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0 mt-4">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <div className="col-12 px-4">
                            <div className="d-flex">
                                {/* <InputGroup>
                                    <input type="text" className="form-control" placeholder="Search for Location / Code / Name" />
                                    <InputGroup.Text style={{ backgroundColor: 'var(--blue)' }}>
                                        <div className="d-flex flex-row align-items-center text-white">
                                            <Icon name={'search'} />
                                            <span className="ms-2">Search</span>
                                        </div>
                                    </InputGroup.Text>
                                </InputGroup> */}
                                <Button variant="primary" className="px-4 ms-auto text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>Add New Location</Button>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} />
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <LocationDetails action={action} data={action !== ACTIONS.ADD ? location : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={() => {
                        setData(null);
                        setAction(ACTIONS.NONE);
                        refetch();
                    }} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Location Master'} onSubmit={onDelete} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete <strong>{(location || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
        </>
    )
}

export default Location;