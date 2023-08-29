import React, { useEffect, useState, useRef } from "react";
import { ACTIONS, TOOLTIP_DELAY } from "../../../common/Constants";
import Table, { CellTmpl, DEFAULT_PAYLOAD, reactFormatter } from "../../../common/Table";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import { useDeleteDepartmentUserMapping, useGetDepartmentUserMappings } from "../../../../backend/masters";
import { hasUserAccess } from "../../../../backend/auth";
import { USER_PRIVILEGES } from "../Roles/RoleConfiguration";
import Icon from "../../../common/Icon";
import MastersLayout from "../../Masters/MastersLayout";
import TableFilters from "../../../common/TableFilter";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import PageLoader from "../../../shared/PageLoader";
import ConfirmModal from "../../../common/ConfirmModal";
import DepartmentUserDetails from "./DepartmentUserDetails";

function MangeDepartmentUsers() {
    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'users', label: 'User Management', path: '/userManagement/roles' },
        { id: 'users', label: 'Manage Users' },
    ]);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [user, setUser] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState<any>({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { departmentUsers, total, isFetching, refetch } = useGetDepartmentUserMappings(payload, Boolean(payload));
    const { deleteDepartmentUserMapping, deleting } = useDeleteDepartmentUserMapping((response: any) => {
        toast.success(`${user.name} deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    // const filterConfig = [
    //     {
    //         label: 'Department',
    //         name: 'departmentId',
    //         options: roles.map((x: any) => {
    //             return { value: x.id, label: x.name };
    //         })
    //     }
    // ]

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                {
                    hasUserAccess(USER_PRIVILEGES.UPDATE_DEPARTMENT_USER_MAPPING) &&
                    <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event: any) => {
                        setUser(row);
                        setAction(ACTIONS.EDIT)
                    }} />
                }
                {
                    hasUserAccess(USER_PRIVILEGES.DELETE_DEPARTMENT_USER_MAPPING) &&
                    <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event: any) => {
                        setUser(row);
                        setAction(ACTIONS.DELETE)
                    }} />
                }
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event: any) => {
                    setUser(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    function ValueTmpl({ cell }: any) {
        const row = cell.getData();
        const _def = cell.getColumn().getDefinition();
        const value = (row[_def.field] || {}).name;
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

    function CompanyTmpl({ cell }: any) {
        const row = cell.getData();
        // console.log(row);
        const value = (((row.department || {}).vertical || {}).company || {}).name;
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

    function VerticalTmpl({ cell }: any) {
        const row = cell.getData();
        const value = ((row.department || {}).vertical || {}).name;
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

    const columns = [
        { title: "User", field: "user", formatter: reactFormatter(<ValueTmpl />) },
        { title: "Company", field: "company", formatter: reactFormatter(<CompanyTmpl />) },
        { title: "Vertical", field: "vertical", formatter: reactFormatter(<VerticalTmpl />) },
        { title: "Department", field: "department", formatter: reactFormatter(<ValueTmpl />) },
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

    function formatApiResponse(params: any, list: any, totalRecords: any) {
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
        return Promise.resolve(formatApiResponse(params, departmentUsers, total));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setUser(null);
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
        if (!isFetching) {
            setData(formatApiResponse(params, departmentUsers, total));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Department User Mapping" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters search={true} onFilterChange={onFilterChange}
                                    placeholder={"Search for User/Department"} />
                                <div className="d-flex">
                                    {
                                        hasUserAccess(USER_PRIVILEGES.ADD_DEPARTMENT_USER_MAPPING) &&
                                        <Button variant="primary" className="px-3 ms-auto text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>
                                            <Icon name={'plus'} className="me-2"></Icon>Add New
                                        </Button>
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <DepartmentUserDetails action={action} data={action !== ACTIONS.ADD ? user : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Deprtment User'} onSubmit={() => deleteDepartmentUserMapping(user.id)} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Department User mapping?</div>
                </ConfirmModal>
            }
            {
                deleting && <PageLoader>Deleting Mapping...</PageLoader>
            }
        </>
    )
}

export default MangeDepartmentUsers;