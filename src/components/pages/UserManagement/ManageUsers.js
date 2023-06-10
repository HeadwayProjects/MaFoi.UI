import React, { useEffect, useState } from "react";
import { ACTIONS, STATUS } from "../../common/Constants";
import { useDeleteUser, useGetUserRoles, useGetUsers } from "../../../backend/users";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";
import Icon from "../../common/Icon";
import Table, { CellTmpl, DEFAULT_PAYLOAD, reactFormatter } from "../../common/Table";
import MastersLayout from "../Masters/MastersLayout";
import { Button, InputGroup } from "react-bootstrap";
import ConfirmModal from "../../common/ConfirmModal";
import PageLoader from "../../shared/PageLoader";
import UserDetails from "./UserDetails";
import { useRef } from "react";
import TableFilters from "../../common/TableFilter";

const SortFields = {
    'userRoles': 'role'
};

function MangeUsers() {
    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'users', label: 'User Management', path: '/userManagement/users' },
        { id: 'users', label: 'Manage Users' },
    ]);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [user, setUser] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [filters, setFilters] = useState();
    const filterRef = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { users, total, isFetching, refetch } = useGetUsers(payload, Boolean(payload));
    const { roles } = useGetUserRoles();
    const { deleteUser, deleting } = useDeleteUser((response) => {
        toast.success(`${user.name} deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    const filterConfig = [
        {
            label: 'Role',
            name: 'roleId',
            options: roles.map(x => {
                return { value: x.id, label: x.name };
            })
        }
    ]

    function ActionColumnElements({ cell }) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    setUser(row);
                    setAction(ACTIONS.EDIT)
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setUser(row);
                    setAction(ACTIONS.DELETE)
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
                    setUser(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    function RoleTmpl({ cell }) {
        const roles = (cell.getValue() || []).map(x => x.description).join(', ');
        return (
            <div className="d-flex flex-row align-items-center h-100">
                {roles}
            </div>
        )
    }

    function StatusTmpl({ cell }) {
        const value = cell.getValue();
        return (
            <div className="d-flex flex-row align-items-center h-100">
                {value ? STATUS.ACTIVE : STATUS.INACTIVE}
            </div>
        )
    }

    const columns = [
        { title: "Name", field: "name", formatter: reactFormatter(<CellTmpl />) },
        { title: "Username", field: "userName", formatter: reactFormatter(<CellTmpl />) },
        { title: "Role", field: "userRoles", formatter: reactFormatter(<RoleTmpl />) },
        { title: "Email", field: "email", formatter: reactFormatter(<CellTmpl />) },
        // { title: "Status", field: "status", formatter: reactFormatter(<StatusTmpl />) },
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
                columnName: SortFields[field] || field || 'name',
                order: dir || 'asc'
            }
        };
        setParams(_params);
        setPayload({ ...DEFAULT_PAYLOAD, ...filterRef.current, ..._params });
        return Promise.resolve(formatApiResponse(params, users, total));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setUser(null);
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
            setData(formatApiResponse(params, users, total));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Manage Users" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                    placeholder={"Search for Name/Username/Email"} />
                                <Button variant="primary" className="px-3 ms-auto text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>
                                    <Icon name={'plus'} className="me-2"></Icon>Add New
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <UserDetails action={action} data={action !== ACTIONS.ADD ? user : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Act Master'} onSubmit={() => deleteUser(user.id)} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the User, <strong>{(user || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {
                deleting && <PageLoader>Deleting User...</PageLoader>
            }
        </>
    )
}

export default MangeUsers;