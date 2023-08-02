import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../../common/Constants";
import Table, { CellTmpl, DEFAULT_PAYLOAD, reactFormatter } from "../../../common/Table";
import { useGetUserRoles } from "../../../../backend/users";
import Icon from "../../../common/Icon";
import MastersLayout from "../../Masters/MastersLayout";
import TableFilters from "../../../common/TableFilter";
import RoleDetails from "./RoleDetails";
import AddEditRole from "./AddEditRole";
import { VIEWS } from "./Roles";
import { hasUserAccess } from "../../../../backend/auth";
import { USER_PRIVILEGES } from "./RoleConfiguration";

const SortFields: any = {
    'userRoles': 'role'
};

function ManageRoles({ changeView }: any) {
    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'userManagement', label: 'User Management', path: '/userManagement/roles' },
        { id: 'roles', label: 'Manage Roles' },
    ]);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [role, setRole] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState<any>({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { roles, isFetching, refetch } = useGetUserRoles(payload, Boolean(payload));
    // const { deleteUser, deleting } = useDeleteUser((response: any) => {
    //     toast.success(`${user.name} deleted successfully.`);
    //     submitCallback();
    // }, () => {
    //     toast.error(ERROR_MESSAGES.DEFAULT);
    // });
    // const { exportUsers, exporting } = useExportUsers((response: any) => {
    //     downloadFileContent({
    //         name: 'Users.xlsx',
    //         type: response.headers['content-type'],
    //         content: response.data
    //     });
    // }, () => {
    //     toast.error(ERROR_MESSAGES.DEFAULT);
    // });

    // const filterConfig = [
    //     {
    //         label: 'Role',
    //         name: 'roleId',
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
                    hasUserAccess(USER_PRIVILEGES.EDIT_ROLE) &&
                    <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event: any) => {
                        setRole(row);
                        setAction(ACTIONS.EDIT)
                    }} />
                }
                {
                    hasUserAccess(USER_PRIVILEGES.DELETE_ROLE) &&
                    <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event: any) => {
                        setRole(row);
                        setAction(ACTIONS.DELETE)
                    }} />
                }
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event: any) => {
                    setRole(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    function RoleTmpl({ cell }: any) {
        const roles = (cell.getValue() || []).map((x: any) => x.description).join(', ');
        return (
            <div className="d-flex flex-row align-items-center h-100">
                {roles}
            </div>
        )
    }

    const columns = [
        { title: "Role", field: "name", formatter: reactFormatter(<CellTmpl />), widthGrow: 1 },
        { title: "Description", field: "description", formatter: reactFormatter(<CellTmpl />), widthGrow: 2 },
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
            total: totalRecords || list.length,
            last_page: Math.ceil((totalRecords || list.length) / (pageSize || 1)) || 1,
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
                columnName: SortFields[field] || field || 'name',
                order: dir || 'asc'
            }
        };
        setParams(_params);
        setPayload({ ...DEFAULT_PAYLOAD, ...filterRef.current, ..._params });
        return Promise.resolve(formatApiResponse(params, roles, undefined));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setRole(null);
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

    // function handleExport() {
    //     if (total > 0) {
    //         exportUsers({ ...payload, pagination: null });
    //     }
    // }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, roles, undefined));
        }
    }, [isFetching]);

    return (
        <>
            <div className="d-flex flex-column mx-0">
                <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-end">
                            <TableFilters search={true} onFilterChange={onFilterChange}
                                placeholder={"Search for Role"} />
                            <div className="d-flex">
                                {
                                    hasUserAccess(USER_PRIVILEGES.ADD_ROLE) &&
                                    <Button variant="primary" className="px-3 ms-auto text-nowrap" onClick={() => {
                                        setRole(null);
                                        setAction(ACTIONS.ADD);
                                    }}>
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
                action === ACTIONS.VIEW && role &&
                <RoleDetails role={role}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                (action === ACTIONS.ADD || action === ACTIONS.EDIT) &&
                <AddEditRole role={role} onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback}
                    action={action} updatePrivileges={(_role: any) => {
                        changeView(VIEWS.ADD, _role);
                    }} />
            }
            {/* {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Act Master'} onSubmit={() => deleteUser(user.id)} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the User, <strong>{(user || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {
                deleting && <PageLoader>Deleting User...</PageLoader>
            }
            {exporting && <PageLoader message={'Preparing data...'} />} */}

        </>
    )
}

export default ManageRoles;