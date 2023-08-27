import React, { useEffect, useRef, useState } from "react";
import { ACTIONS } from "../../../../common/Constants";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, reactFormatter } from "../../../../common/Table";
import { useDeleteEscalationMatrix, useGetCompanies, useGetEscalationMatrix } from "../../../../../backend/masters";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../../utils/constants";
import Icon from "../../../../common/Icon";
import MastersLayout from "../../MastersLayout";
import TableFilters from "../../../../common/TableFilter";
import { Button } from "react-bootstrap";
import { hasUserAccess } from "../../../../../backend/auth";
import { USER_PRIVILEGES } from "../../../UserManagement/Roles/RoleConfiguration";
import EscalationMatrixDetails from "./EscalationMatrixDetails";
import ConfirmModal from "../../../../common/ConfirmModal";
import PageLoader from "../../../../shared/PageLoader";

export default function ManageEscalationMatrix() {
    const [t] = useState(new Date().getTime());
    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'companies', label: 'Companies', path: '/companies/list' },
        { id: 'departments', label: 'Departments' },
    ]);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [matrix, setMatrix] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'days', order: 'desc' } });
    const { companies, isFetching: fetchingCompanies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }], t });
    const { matrixList, total, isFetching, refetch } = useGetEscalationMatrix(payload, Boolean(payload));
    const { deleteMatrix, deleting } = useDeleteEscalationMatrix(() => {
        toast.success(`Escaltion matrix deleted successfully.`);
        submitCallback();
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

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100 gap-2">
                {
                    hasUserAccess(USER_PRIVILEGES.EDIT_COMPANY_ESCALTION_MATIX) &&
                    <Icon type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                        setMatrix(row);
                        setAction(ACTIONS.EDIT)
                    }} />
                }
                {
                    hasUserAccess(USER_PRIVILEGES.DELETE_COMPANY_ESCALTION_MATIX) &&
                    <Icon type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                        setMatrix(row);
                        setAction(ACTIONS.DELETE)
                    }} />
                }
                <Icon type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setMatrix(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        { title: "Company", field: "company.name", formatter: reactFormatter(<CellTmpl />) },
        { title: "User Name", field: "user.name", formatter: reactFormatter(<CellTmpl />) },
        { title: "Days", field: "days", formatter: reactFormatter(<CellTmpl />) },
        { title: "User Email", field: "user.email", formatter: reactFormatter(<CellTmpl />) },
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
        initialSort: [{ column: 'verticalId', dir: 'asc' }]
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
                columnName: field || 'days',
                order: dir || 'desc'
            }
        };
        setParams(_params);
        setPayload({ ...DEFAULT_PAYLOAD, ...filterRef.current, ..._params });
        return Promise.resolve(formatApiResponse(params, matrixList, total));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setMatrix(null);
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

    useEffect(() => {
        if (!isFetching && payload) {
            setTimeout(() => {
                setData(formatApiResponse(params, matrixList, total));
            });
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Companies - Departments" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} onFilterChange={onFilterChange}
                                    placeholder="Search for Department" />
                                <div className="d-flex">
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
                <EscalationMatrixDetails action={action} data={action !== ACTIONS.ADD ? matrix : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE && Boolean(matrix) &&
                <ConfirmModal title={'Delete Act Master'} onSubmit={() => deleteMatrix(matrix.id)} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the defined escalation matrix ?</div>
                </ConfirmModal>
            }
            {
                deleting && <PageLoader>Deleting Vertical...</PageLoader>
            }
        </>
    )
}