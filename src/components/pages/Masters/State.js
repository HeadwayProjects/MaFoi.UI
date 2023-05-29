import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, DEFAULT_PAYLOAD, reactFormatter } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import StateDetails from "./StateDetails";
import ConfirmModal from "../../common/ConfirmModal";
import { useGetStates, useDeleteState } from "../../../backend/masters";
import { toast } from "react-toastify";
import TableFilters from "../../common/TableFilter";
import { useRef } from "react";
import { downloadFileContent } from "../../../utils/common";
import { ERROR_MESSAGES } from "../../../utils/constants";
import { useExportStates } from "../../../backend/exports";

function State() {
    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'masters', label: 'Masters', path: '/masters/act' },
        { id: 'state', label: 'State' }
    ]);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [state, setState] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [filters, setFilters] = useState();
    const filterRef = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { states, total, isFetching, refetch } = useGetStates(payload);

    const { deleteState } = useDeleteState(() => {
        toast.success(`${state.name} deleted successsfully.`);
        setAction(ACTIONS.NONE);
        setState(null);
        refetch();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });
    const { exportStates, exporting } = useExportStates((response) => {
        downloadFileContent({
            name: 'States.xlsx',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    function ActionColumnElements({ cell }) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    setState(row);
                    setAction(ACTIONS.EDIT)
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setState(row);
                    setAction(ACTIONS.DELETE)
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
                    setState(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        { title: "Code", field: "code", formatter: reactFormatter(<CellTmpl />) },
        { title: "Name", field: "name", widthGrow: 2, formatter: reactFormatter(<CellTmpl />) },
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
        return Promise.resolve(formatApiResponse(params, states, total));
    }

    function successCallback() {
        setAction(ACTIONS.NONE);
        setState(null);
        refetch();
    }

    function onDelete() {
        deleteState(state.id);
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

    function handleExport() {
        exportStates({ ...payload, pagination: null });
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, states, total));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - State" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters search={true} onFilterChange={onFilterChange} placeholder={"Search for State Code/Name"} />
                                <div className="d-flex">
                                    <Button variant="primary" className="px-3 text-nowrap" onClick={handleExport}>
                                        <Icon name={'download'} className="me-2"></Icon>Export
                                    </Button>
                                    <Button variant="primary" className="px-3 ms-3 text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>
                                        <Icon name={'plus'} className="me-2"></Icon>Add New
                                    </Button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <StateDetails action={action} data={action !== ACTIONS.ADD ? state : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={successCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete State Master'} onSubmit={onDelete} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the state, <strong>{(state || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
        </>
    )
}

export default State;