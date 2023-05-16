import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button, InputGroup } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, reactFormatter } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import ActDetails from "./ActDetails";
import ConfirmModal from "../../common/ConfirmModal";
import { useDeleteAct, useGetActs, useGetLaws } from "../../../backend/masters";
import { EstablishmentTypes, GetMastersBreadcrumb } from "./Master.constants";
import { toast } from "react-toastify";
import { API_DELIMITER, ERROR_MESSAGES, UI_DELIMITER } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";
import { useRef } from "react";
import TableFilters from "../../common/TableFilter";

function Act() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Act'));
    const [action, setAction] = useState(ACTIONS.NONE);
    const [act, setAct] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [filters, setFilters] = useState();
    const filterRef = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { laws } = useGetLaws({ ...DEFAULT_OPTIONS_PAYLOAD });
    const { acts, total, isFetching, refetch } = useGetActs(payload);
    const { deleteAct, deleting } = useDeleteAct(() => {
        toast.success(`${act.name} deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    const filterConfig = [
        {
            label: 'Establishment Type',
            name: 'establishmentType',
            options: [
                { value: "", label: 'Blank' },
                { value: EstablishmentTypes[0], label: EstablishmentTypes[0] },
                { value: EstablishmentTypes[1], label: EstablishmentTypes[1] },
                { value: EstablishmentTypes[2], label: EstablishmentTypes[2] },
                {
                    value: `${EstablishmentTypes[0]}${API_DELIMITER}${EstablishmentTypes[1]}`,
                    label: `${EstablishmentTypes[0]}${UI_DELIMITER}${EstablishmentTypes[1]}`
                },
                {
                    value: `${EstablishmentTypes[0]}${API_DELIMITER}${EstablishmentTypes[2]}`,
                    label: `${EstablishmentTypes[0]}${UI_DELIMITER}${EstablishmentTypes[2]}`
                },
                {
                    value: `${EstablishmentTypes[1]}${API_DELIMITER}${EstablishmentTypes[2]}`,
                    label: `${EstablishmentTypes[1]}${UI_DELIMITER}${EstablishmentTypes[2]}`
                },
                {
                    value: `${EstablishmentTypes[0]}${API_DELIMITER}${EstablishmentTypes[1]}${API_DELIMITER}${EstablishmentTypes[2]}`,
                    label: `${EstablishmentTypes[0]}${UI_DELIMITER}${EstablishmentTypes[1]}${UI_DELIMITER}${EstablishmentTypes[2]}`
                }
            ]
        },
        {
            label: 'Law',
            name: 'lawId',
            options: (laws || []).map(x => {
                return { value: x.id, label: x.name };
            })
        }
    ]

    function TypeTmpl({ cell }) {
        const value = (cell.getValue() || '').replaceAll(API_DELIMITER, UI_DELIMITER);
        return (
            <div className="d-flex align-items-center h-100 w-auto">
                <div className="ellipse two-lines">{value}</div>
            </div>
        )
    }

    function ActionColumnElements({ cell }) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    setAct(row);
                    setAction(ACTIONS.EDIT)
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setAct(row);
                    setAction(ACTIONS.DELETE)
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
                    setAct(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        { title: "Act Name", field: "name", widthGrow: 2, formatter: reactFormatter(<CellTmpl />) },
        { title: "Establishment Type", field: "establishmentType", formatter: reactFormatter(<TypeTmpl />) },
        { title: "Law", field: "law.name", formatter: reactFormatter(<CellTmpl />), headerSort: false },
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
        return Promise.resolve(formatApiResponse(params, acts, total));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setAct(null);
        refetch();
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
            setData(formatApiResponse(params, acts, total));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Act" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0 mt-4">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <div className="col-12 px-4">
                            <div className="d-flex justify-content-between">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange} />
                                <Button variant="primary" className="px-3 ms-auto text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>
                                    <Icon name={'plus'} className="me-2"></Icon>Add New
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav}/>
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <ActDetails action={action} data={action !== ACTIONS.ADD ? act : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Act Master'} onSubmit={() => deleteAct(act.id)} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Act, <strong>{(act || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {
                deleting && <PageLoader>Deleting Act...</PageLoader>
            }
        </>
    )
}

export default Act;