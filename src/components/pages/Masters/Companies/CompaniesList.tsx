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
import { downloadFileContent, preventDefault } from "../../../../utils/common";
import { navigate } from "raviger";
import TableFilters from "../../../common/TableFilter";
import { useRef } from "react";
import { useExportCompanies } from "../../../../backend/exports";
import { hasUserAccess } from "../../../../backend/auth";
import { USER_PRIVILEGES } from "../../UserManagement/Roles/RoleConfiguration";

function CompaniesList({ changeView }: any) {
    const [t] = useState(new Date().getTime());
    const [action, setAction] = useState(ACTIONS.NONE);
    const [company, setCompany] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>({ filters: [{ columnName: 'isParent', value: 'true' }], search: '' });
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState<any>({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' }, ...filterRef.current, t });
    const { companies, total, isFetching, refetch, invalidate } = useGetCompanies(payload, Boolean(payload));
    const { deleteCompany, isLoading: deletingCompany } = useDeleteCompany(() => {
        refetch();
    }, () => toast.error(ERROR_MESSAGES.DEFAULT));

    const { exportCompanies, exporting } = useExportCompanies((response: any) => {
        downloadFileContent({
            name: 'Companies.xlsx',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();
        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                {
                    hasUserAccess(USER_PRIVILEGES.EDIT_COMPANY) &&
                    <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event: any) => {
                        changeView(VIEWS.EDIT, { company: row });
                    }} />
                }
                {
                    // hasUserAccess(USER_PRIVILEGES.DELETE_COMPANY) &&
                    // <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event: any) => {
                    //     setCompany(row);
                    //     setAction(ACTIONS.DELETE);
                    // }} />
                }
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event: any) => {
                    setCompany(row);
                    setAction(ACTIONS.VIEW);
                }} />
                <Icon className="mx-2" type="button" name={'external-link'} text={row.websiteUrl} data={row} action={(event: any) => {
                    if (row.websiteUrl) {
                        const url = row.websiteUrl.match(/^https?:/) ? row.websiteUrl : '//' + row.websiteUrl;
                        window.open(url)
                    }
                }} />
            </div>
        )
    }

    function NameTmpl({ cell }: any) {
        const value = cell.getValue();
        const row = cell.getData();
        return (
            <div className="d-flex align-items-center h-100">
                {
                    row.logo &&
                    <img src={row.logo} width={'30px'} height={'30px'} className="me-2 rounded-circle" alt="Company Logo" />
                }
                <OverlayTrigger overlay={<Tooltip>{value}</Tooltip>} placement="bottom" delay={{ show: TOOLTIP_DELAY } as any}>
                    <div className="d-flex align-items-center h-100">
                        <div className="ellipse two-lines">{value}</div>
                    </div>
                </OverlayTrigger>
            </div>
        )
    }

    function ACTmpl({ cell }: any) {
        const value = cell.getValue();
        const row = cell.getData();
        return (
            <div className="d-flex align-items-center h-100">
                {
                    hasUserAccess(USER_PRIVILEGES.VIEW_ASSOCIATE_COMPANIES) ?
                        <a href="/" onClick={(e: any) => {
                            preventDefault(e);
                            navigate('/companies/associateCompanies', { query: { company: row.id } });
                        }}>{value || 0}</a> :
                        <span>{value || 0}</span>
                }
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
        setPayload({ ...DEFAULT_PAYLOAD, ...filterRef.current, ..._params, t });
        return Promise.resolve(formatApiResponse(params, companies, total));
    }

    function deleteCompanyMaster() {
        deleteCompany(company.id);
    }

    function onFilterChange(e: any) {
        const _filters = { ...e };
        _filters.filters.push({ columnName: 'isParent', value: 'true' });
        setFilters(_filters);
        setPayload({ ...DEFAULT_PAYLOAD, ...params, ..._filters, t });
    }

    function handlePageNav(_pagination: any) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params, t })
    }

    function handleExport() {
        if (total > 0) {
            exportCompanies({ ...payload, pagination: null });
        }
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
                <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-end">
                            <TableFilters search={true} onFilterChange={onFilterChange}
                                placeholder={"Search for Company Code/Name/Contact No./Email"} />
                            <div className="d-flex">
                                {
                                    hasUserAccess(USER_PRIVILEGES.EXPORT_COMPANIES) &&
                                    <Button variant="primary" className="px-3 text-nowrap me-3" onClick={handleExport} disabled={!total}>
                                        <Icon name={'download'} className="me-2"></Icon>Export
                                    </Button>
                                }
                                {
                                    hasUserAccess(USER_PRIVILEGES.ADD_COMPANY) &&
                                    <Button variant="primary" className="px-3 ms-auto text-nowrap" onClick={() => changeView(VIEWS.ADD)}>
                                        <Icon name={'plus'} className="me-2"></Icon>Add New
                                    </Button>
                                }
                            </div>
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
            {exporting && <PageLoader message={'Preparing data...'} />}
        </>
    )
}

export default CompaniesList;