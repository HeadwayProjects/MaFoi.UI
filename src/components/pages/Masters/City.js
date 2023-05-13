import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button, InputGroup } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, reactFormatter } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import CityDetails from "./CityDetails";
import ConfirmModal from "../../common/ConfirmModal";
import { useGetCities, useDeleteCity } from "../../../backend/masters";
import { toast } from "react-toastify";
import { GetMastersBreadcrumb } from "./Master.constants";
import { useRef } from "react";
import { filterData } from "../../../utils/common";

function City() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('City'));
    const searchRef = useRef();
    const [search, setSearch] = useState(null);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [city, setCity] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [payload, setPayload] = useState();
    const { cities, isFetching, refetch } = useGetCities();

    const { deleteCity } = useDeleteCity(() => {
        toast.success(`${city.name} deleted successsfully.`);
        setAction(ACTIONS.NONE);
        setCity(null);
        refetch();
    }, () => {
        toast.error('Something went wrong! Please try again.');
    });

    function ActionColumnElements({ cell }) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    setCity(row);
                    setAction(ACTIONS.EDIT)
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setCity(row);
                    setAction(ACTIONS.DELETE)
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
                    setCity(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        { title: "Code", field: "code", formatter: reactFormatter(<CellTmpl />) },
        { title: "Name", field: "name", widthGrow: 2, formatter: reactFormatter(<CellTmpl />) },
        { title: "State", field: "state.name", widthGrow: 2, formatter: reactFormatter(<CellTmpl />) },
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
        if (searchRef.current.value) {
            list = list.filter(x => filterData(x, searchRef.current.value, ['code', 'name', 'state.name']));
        }
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
        return Promise.resolve(formatApiResponse(params, cities));
    }

    function handleSearch() {
        setData(formatApiResponse(params, cities));
    }

    function successCallback() {
        setAction(ACTIONS.NONE);
        setCity(null);
        refetch();
    }

    function onDelete() {
        deleteCity(city.id);
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, cities));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - City" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0 mt-4">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <div className="col-12 px-4">
                            <div className="d-flex justify-content-between">
                                <div className="col-6">
                                    <InputGroup>
                                        <input type="text" ref={searchRef} className="form-control" placeholder="Search for City / Code / Name" />
                                        <InputGroup.Text style={{ backgroundColor: 'var(--blue)' }} onClick={handleSearch}>
                                            <div className="d-flex flex-row align-items-center text-white">
                                                <Icon name={'search'} />
                                                <span className="ms-2">Search</span>
                                            </div>
                                        </InputGroup.Text>
                                    </InputGroup>

                                </div>
                                <Button variant="primary" className="px-4 ms-auto text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>Add New City</Button>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} />
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <CityDetails action={action} data={action !== ACTIONS.ADD ? city : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={successCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete City Master'} onSubmit={onDelete} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the city, <strong>{(city || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
        </>
    )
}

export default City;