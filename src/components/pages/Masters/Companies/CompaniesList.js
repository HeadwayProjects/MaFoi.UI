import React, { useEffect, useState } from "react";
import { useDeleteCompany, useGetCompanies } from "../../../../backend/masters";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import Icon from "../../../common/Icon";
import { VIEWS } from "./Companies";
import { ACTIONS, TOOLTIP_DELAY } from "../../../common/Constants";
import Table, { CellTmpl, DEFAULT_PAYLOAD, TitleTmpl, reactFormatter } from "../../../common/Table";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import ViewCompany from "./ViewCompany";
import ConfirmModal from "../../../common/ConfirmModal";
import PageLoader from "../../../shared/PageLoader";
import { preventDefault } from "../../../../utils/common";
import { navigate } from "raviger";
import TableFilters from "../../../common/TableFilter";
import { useRef } from "react";

function CompaniesList({ changeView }) {
    const [t] = useState(new Date().getTime());
    const [action, setAction] = useState(ACTIONS.NONE);
    const [company, setCompany] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [filters, setFilters] = useState({ filters: [{ columnName: 'isParent', value: 'true' }], search: '' });
    const filterRef = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' }, ...filterRef.current, t });
    const { companies, total, isFetching, refetch, invalidate } = useGetCompanies(payload, Boolean(payload));
    const { deleteCompany, isLoading: deletingCompany } = useDeleteCompany(() => {
        refetch();
    }, () => toast.error(ERROR_MESSAGES.DEFAULT));

    function ActionColumnElements({ cell }) {
        const row = cell.getData();
        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    changeView(VIEWS.EDIT, { company: row });
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setCompany(row);
                    setAction(ACTIONS.DELETE);
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
                    setCompany(row);
                    setAction(ACTIONS.VIEW);
                }} />
                <Icon className="mx-2" type="button" name={'external-link'} text={row.websiteUrl} data={row} action={(event) => {
                    if (row.websiteUrl) {
                        const url = row.websiteUrl.match(/^https?:/) ? row.websiteUrl : '//' + row.websiteUrl;
                        window.open(url)
                    }
                }} />
            </div>
        )
    }

    function NameTmpl({ cell }) {
        const value = cell.getValue();
        const row = cell.getData();
        return (
            <div className="d-flex align-items-center h-100">
                {
                    row.logo &&
                    <img src={row.logo} width={'30px'} height={'30px'} className="me-2 rounded-circle" />
                }
                <OverlayTrigger overlay={<Tooltip>{value}</Tooltip>} placement="bottom" delay={{ show: TOOLTIP_DELAY }}>
                    <div className="d-flex align-items-center h-100">
                        <div className="ellipse two-lines">{value}</div>
                    </div>
                </OverlayTrigger>
            </div>
        )
    }

    function LocationTmpl({ cell }) {
        const row = cell.getData();
        const { location, city, state } = row;
        const tooltip = `${(location || {}).name || 'NA'} - ${(city || {}).name || 'NA'} - ${(state || {}).name || 'NA'}`
        return (
            <OverlayTrigger overlay={<Tooltip>{tooltip}</Tooltip>} placement="bottom" delay={{ show: TOOLTIP_DELAY }}>
                <div className="d-flex align-items-center h-100">
                    {(location || {}).code || 'NA'} - {(city || {}).code || 'NA'} - {(state || {}).code || 'NA'}
                </div>
            </OverlayTrigger>
        )
    }

    function ACTmpl({ cell }) {
        const value = cell.getValue();
        const row = cell.getData();
        return (
            <div className="d-flex align-items-center h-100">
                <a href="/" onClick={(e) => {
                    preventDefault(e);
                    navigate('/companies/associateCompanies', { query: { company: row.id } });
                }}>{value || 0}</a>
            </div>
        )
    }

    const columns = [
        {
            title: "Name", field: "name", widthGrow: 2,
            formatter: reactFormatter(<NameTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Code", field: "code",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Contact No.", field: "contactNumber", minWidth: 140,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Email Address", field: "email", minWidth: 140,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Associate Companies", field: "associateCompanies", maxWidth: 200,
            formatter: reactFormatter(<ACTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            headerSort: false
        },
        {
            title: "Actions", hozAlign: "center", width: 160,
            headerSort: false, formatter: reactFormatter(<ActionColumnElements />)
        }
    ];

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
        setPayload({ ...DEFAULT_PAYLOAD, ...filterRef.current, ..._params, t });
        return Promise.resolve(formatApiResponse(params, companies, total));
    }

    function deleteCompanyMaster() {
        deleteCompany(company.id);
    }

    function onFilterChange(e) {
        const _filters = { ...e };
        _filters.filters.push({ columnName: 'isParent', value: 'true' });
        setFilters(_filters);
        setPayload({ ...DEFAULT_PAYLOAD, ...params, ..._filters, t });
    }

    function handlePageNav(_pagination) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params, t })
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setTimeout(() => {
                setData(formatApiResponse(params, companies, total));
            });
        }
    }, [isFetching]);

    useEffect(() => {
        return () => {
            invalidate();
        };
    }, [])

    return (
        <>
            <div className="d-flex flex-column mx-0">
                <div className="card d-flex flex-row justify-content-center m-3 p-3">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-end">
                            <TableFilters search={true} onFilterChange={onFilterChange}
                                placeholder={"Search for Company Code/Name/Contact No./Email"} />
                            <Button variant="primary" className="px-3 ms-auto text-nowrap" onClick={() => changeView(VIEWS.ADD)}>
                                <Icon name={'plus'} className="me-2"></Icon>Add New
                            </Button>
                        </div>
                    </div>
                </div>
                <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
            </div>
            {
                action === ACTIONS.VIEW && company &&
                <ViewCompany company={company} onClose={() => {
                    setAction(ACTIONS.NONE);
                    setCompany(null);
                }} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Company Master'} onSubmit={deleteCompanyMaster} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Company, <strong>{(company || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {deletingCompany && <PageLoader message={'Deleting Company...'} />}
        </>
    )
}

export default CompaniesList;