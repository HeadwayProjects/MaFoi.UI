import React, { useEffect, useState } from "react";
import { useDeleteCompany, useGetCompanies } from "../../../../backend/masters";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import Icon from "../../../common/Icon";
import { ACTIONS, TOOLTIP_DELAY } from "../../../common/Constants";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, TitleTmpl, reactFormatter } from "../../../common/Table";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import ConfirmModal from "../../../common/ConfirmModal";
import PageLoader from "../../../shared/PageLoader";
import { useQueryParams } from "raviger";
import AssociateCompanyDetails from "./AssociateCompanyDetails";
import { COMPANY_STATUS } from "./Companies.constants";
import { VIEWS } from "./AssociateCompanies";
import { useRef } from "react";
import TableFilters from "../../../common/TableFilter";

function AssociateCompaniesList({ changeView, parent }) {
    const [t] = useState(new Date().getTime());
    const [query] = useQueryParams();
    const [action, setAction] = useState(ACTIONS.NONE);
    const [parentCompanyId, setParentCompanyId] = useState(null);
    const [parentCompany, setParentCompany] = useState(parent || null);
    const [associateCompany, setAssociateCompany] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [filters, setFilters] = useState();
    const filterRef = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState();
    const { companies: parentCompanies, isFetching: fetching } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }], t });
    const { companies, total, isFetching, refetch } = useGetCompanies({ ...payload, t }, Boolean(parentCompany && payload));
    const { deleteCompany, isLoading: deletingCompany } = useDeleteCompany(() => {
        refetch();
    }, () => toast.error(ERROR_MESSAGES.DEFAULT));

    const filterConfig = [
        {
            label: 'Company',
            name: 'parentCompanyId',
            options: parentCompanies.map(x => {
                return { value: x.id, label: x.name };
            }),
            hideAll: true,
            value: parentCompany
        }
    ]

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setAssociateCompany(null);
        refetch();
    }

    function ActionColumnElements({ cell }) {
        const row = cell.getData();
        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    changeView(VIEWS.EDIT, { company: row, parentCompany: row.parentCompany });
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setAssociateCompany(row);
                    setAction(ACTIONS.DELETE);
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
                    setAssociateCompany(row);
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

    function StatusTmpl({ cell }) {
        const value = cell.getValue();
        return (
            <div className="d-flex align-items-center h-100">
                {value ? COMPANY_STATUS.ACTIVE : COMPANY_STATUS.INACTIVE}
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
            title: "Code", field: "code", width: 120,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Business Type", field: "businessType",
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
            title: "Status", field: "isActive", minWidth: 140,
            formatter: reactFormatter(<StatusTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
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
            data: list.map(x => {
                return { ...x, parentCompany }
            }),
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
        setPayload({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' }, ...filterRef.current, ..._params });
        return Promise.resolve(formatApiResponse(params, companies, total));
    }

    function deleteCompanyMaster() {
        deleteCompany(associateCompany.id);
    }

    function onFilterChange(e) {
        setFilters(e);
    }

    function handlePageNav(_pagination) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params })
    }

    useEffect(() => {
        if (query && query.company && !parent) {
            setParentCompanyId(query.company);
        }
    }, [query]);

    useEffect(() => {
        if (filters) {
            const { filters: _filters, search } = filters;
            const _parentCompanyId = (_filters.find(x => x.columnName === 'parentCompanyId') || {}).value;
            if (_parentCompanyId || parentCompanyId) {
                const _parentCompany = parentCompanies.find(x => x.id === (_parentCompanyId || parentCompanyId));
                if (_parentCompany) {
                    setParentCompany({ value: _parentCompany.id, label: _parentCompany.name });
                }
                const _x = {
                    filters: [
                        { columnName: 'isParent', value: 'false' },
                        { columnName: 'parentCompanyId', value: _parentCompanyId || parentCompanyId }
                    ],
                    search
                }
                setPayload({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' }, ...params, ..._x });
            }
        }
    }, [filters]);

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, companies, total));
        }
    }, [isFetching]);

    useEffect(() => {
        if (!fetching && parentCompanies) {
            if (!parentCompany && (parentCompanyId || (query || {}).company)) {
                const _parentCompanyId = parentCompanyId || (query || {}).company;
                const _parentCompany = parentCompanies.find(x => x.id === _parentCompanyId) || {};
                setParentCompany({ value: _parentCompany.id, label: _parentCompany.name });
                const { search } = filterRef.current || { search: '' };
                setFilters({ filters: [{ columnName: 'isParent', value: 'false' }, { columnName: 'parentCompanyId', value: _parentCompany.id }], search });
            } else if (!parentCompany) {
                const _parentCompany = (parentCompanies || [])[0];
                if (_parentCompany) {
                    setParentCompany({ value: _parentCompany.id, label: _parentCompany.name });
                    const { search } = filterRef.current || { search: '' };
                    setFilters({ filters: [{ columnName: 'isParent', value: 'false' }, { columnName: 'parentCompanyId', value: _parentCompany.id }], search });
                }
            }
        }
    }, [fetching]);

    useEffect(() => {
        if (parent) {
            const _parentId = (parent || {}).value;
            if (_parentId) {
                setParentCompanyId(_parentId);
                setParentCompany(parent);
                const _filterRef = {
                    ...filterRef.current, filters: [
                        { columnName: 'isParent', value: 'false' },
                        { columnName: 'parentCompanyId', value: _parentId }
                    ]
                };
                setFilters(_filterRef);
            }
        }
    }, [parent])

    return (
        <>
            <div className="d-flex flex-column mx-0">
                <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-end">
                            <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                placeholder={"Search for Company Code/Name/Contact No./Email"} />
                            <Button variant="primary" className="px-3 ms-auto text-nowrap" onClick={() => changeView(VIEWS.ADD, { parentCompany, _t: t })}>
                                <Icon name={'plus'} className="me-2"></Icon>Add New
                            </Button>
                        </div>
                    </div>
                </div>
                <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
            </div>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <AssociateCompanyDetails action={action} parentCompany={parentCompany} data={action !== ACTIONS.ADD ? associateCompany : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Associate Company'} onSubmit={deleteCompanyMaster} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Associate Company, <strong>{(associateCompany || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {deletingCompany && <PageLoader message={'Deleting Company...'} />}
        </>
    )
}

export default AssociateCompaniesList;