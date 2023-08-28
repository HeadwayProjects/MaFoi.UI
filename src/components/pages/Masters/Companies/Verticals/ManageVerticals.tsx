import React, { useEffect, useState, useRef } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import { ACTIONS, TOOLTIP_DELAY } from "../../../../common/Constants";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, reactFormatter } from "../../../../common/Table";
import { useDeleteVertical, useGetCompanies, useGetVerticals } from "../../../../../backend/masters";
import { ERROR_MESSAGES } from "../../../../../utils/constants";
import Icon from "../../../../common/Icon";
import MastersLayout from "../../MastersLayout";
import TableFilters from "../../../../common/TableFilter";
import ConfirmModal from "../../../../common/ConfirmModal";
import PageLoader from "../../../../shared/PageLoader";
import VerticalDetails from "./VerticalDetails";
import { useExportVerticals } from "../../../../../backend/exports";
import { downloadFileContent } from "../../../../../utils/common";
import { hasUserAccess } from "../../../../../backend/auth";
import { USER_PRIVILEGES } from "../../../UserManagement/Roles/RoleConfiguration";

function ManageVerticals() {
    const [t] = useState(new Date().getTime());
    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'companies', label: 'Companies', path: '/companies/list' },
        { id: 'verticals', label: 'Verticals' },
    ]);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [vertical, setVertical] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { companies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }], t });
    const { verticals, total, isFetching, refetch } = useGetVerticals(payload);
    const { deleteVertical, deleting } = useDeleteVertical(() => {
        toast.success(`${vertical.name} deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });
    const { exportVertical, exporting } = useExportVerticals((response: any) => {
        downloadFileContent({
            name: 'Verticals.xlsx',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    const filterConfig = [
        {
            label: 'Company',
            name: 'companyId',
            options: (companies || []).map((x: any) => {
                return { value: x.id, label: x.name };
            })
        }
    ]

    function CompanyTmpl({ cell }: any) {
        const row = cell.getData();
        const value = ((row || {}).company || {}).name;
        return (
            <>
                {
                    !!value &&
                    <div className="d-flex align-items-center h-100 w-auto">
                        <OverlayTrigger overlay={<Tooltip>{value}</Tooltip>} rootClose={true}
                            placement="bottom" delay={{ show: TOOLTIP_DELAY } as any}>
                            <div className="ellipse two-lines">{value}</div>
                        </OverlayTrigger>
                    </div>
                }
            </>
        )
    }

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100 gap-2">
                {
                    hasUserAccess(USER_PRIVILEGES.EDIT_VERTICAL) &&
                    <Icon type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                        setVertical(row);
                        setAction(ACTIONS.EDIT)
                    }} />
                }
                {
                    hasUserAccess(USER_PRIVILEGES.DELETE_VERTICAL) &&
                    <Icon type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                        setVertical(row);
                        setAction(ACTIONS.DELETE)
                    }} />
                }
                <Icon type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setVertical(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        { title: "Company", field: "companyId", formatter: reactFormatter(<CompanyTmpl />) },
        { title: "Code", field: "shortCode", formatter: reactFormatter(<CellTmpl />) },
        { title: "Name", field: "name", formatter: reactFormatter(<CellTmpl />) },
        { title: "Description", field: "description", widthGrow: 2, formatter: reactFormatter(<CellTmpl />) },
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
        initialSort: [{ column: 'companyId', dir: 'asc' }]
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
        return Promise.resolve(formatApiResponse(params, verticals, total));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setVertical(null);
        refetch();
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
        exportVertical({ ...payload, pagination: null });
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setTimeout(() => {
                setData(formatApiResponse(params, verticals, total));
            });
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Companies - Verticals" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                    placeholder="Search for Vertical" />
                                <div className="d-flex">
                                    <Button variant="primary" className="px-3 mx-3 text-nowrap" onClick={handleExport}
                                        disabled={!Boolean(total)}>
                                        <Icon name={'download'} className="me-2"></Icon>Export
                                    </Button>
                                    <Button variant="primary" className="px-3 text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>
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
                <VerticalDetails action={action} data={action !== ACTIONS.ADD ? vertical : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE && Boolean(vertical) &&
                <ConfirmModal title={'Delete Act Master'} onSubmit={() => deleteVertical(vertical.id)} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Vertical, <strong>{(vertical || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {
                deleting && <PageLoader>Deleting Vertical...</PageLoader>
            }
            {
                exporting && <PageLoader>Preparing Data...</PageLoader>
            }
        </>
    )
}

export default ManageVerticals;