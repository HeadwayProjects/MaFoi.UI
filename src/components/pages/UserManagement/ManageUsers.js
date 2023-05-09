import React, { useEffect, useState } from "react";
import { ACTIONS, STATUS } from "../../common/Constants";
import { useDeleteUser, useGetUsers } from "../../../backend/users";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";
import Icon from "../../common/Icon";
import Table, { CellTmpl, reactFormatter } from "../../common/Table";
import MastersLayout from "../Masters/MastersLayout";
import { Button, InputGroup } from "react-bootstrap";
import ConfirmModal from "../../common/ConfirmModal";
import PageLoader from "../../shared/PageLoader";
import UserDetails from "./UserDetails";

function MangeUsers() {
    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'users', label: 'Users' },
    ]);
    const [search, setSearch] = useState(null);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [user, setUser] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [payload, setPayload] = useState();
    const { users, isFetching, refetch } = useGetUsers();
    const { deleteUser, deleting } = useDeleteUser(() => {
        toast.success(`${user.name} deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

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
        { title: "Role", field: "userRoles", formatter: reactFormatter(<RoleTmpl />), headerSort: false },
        { title: "Email", field: "email", formatter: reactFormatter(<CellTmpl />) },
        { title: "Status", field: "status", formatter: reactFormatter(<StatusTmpl />) },
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
        selectable: false
    });

    function formatApiResponse(params, list, pagination = {}) {
        const total = list.length;
        const tdata = {
            data: list,
            total,
            last_page: Math.ceil(total / params.size) || 1,
            page: params.page || 1
        };
        setData(tdata);
        return tdata;
    }

    function ajaxRequestFunc(url, config, params) {
        setParams(params);
        setPayload(search ? { ...params, search } : { ...params });
        return Promise.resolve(formatApiResponse(params, users));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setUser(null);
        refetch();
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, users));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="User Management" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0 mt-4">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <div className="col-12 px-4">
                            <div className="d-flex">
                                {/* <InputGroup>
                                    <input type="text" className="form-control" placeholder="Search for User / Name" />
                                    <InputGroup.Text style={{ backgroundColor: 'var(--blue)' }}>
                                        <div className="d-flex flex-row align-items-center text-white">
                                            <Icon name={'search'} />
                                            <span className="ms-2">Search</span>
                                        </div>
                                    </InputGroup.Text>
                                </InputGroup> */}
                                <Button variant="primary" className="px-4 ms-auto text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>Add New User</Button>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} />
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