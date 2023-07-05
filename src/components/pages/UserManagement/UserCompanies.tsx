import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { useGetUsers } from "../../../backend/users";
import { ACTIONS } from "../../common/Constants";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, TitleTmpl, reactFormatter } from "../../common/Table";
import Icon from "../../common/Icon";
import { Button } from "react-bootstrap";
import UserLocationMapping from "./UserLocationMapping";
import { preventDefault } from "../../../utils/common";
import { useCreateUserLocationMapping, useGetUserCompanies } from "../../../backend/masters";
import ConfirmModal from "../../common/ConfirmModal";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import MastersLayout from "../Masters/MastersLayout";

function mapData(list: any[]) {
    if ((list || []).length === 0) {
        return [];
    }

    const result: any[] = [];
    list.forEach(parentCompany => {
        const { companyName, companyId, associateCompanies } = parentCompany;
        associateCompanies.forEach((associateCompany: any) => {
            const { associateCompanyId, associateCompanyName, locations }: any = associateCompany;
            const count = locations.length;
            result.push({
                companyId,
                companyName,
                associateCompanyId,
                associateCompanyName,
                count,
                locations
            });
        });
    })
    return result;
};

function UserCompanies() {
    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'users', label: 'User Management', path: '/userManagement/users' },
        { id: 'companyMapping', label: 'Company Mapping' },
    ]);
    const [user, setUser] = useState<any>(null);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [payload, setPayload] = useState<any>();
    const { users, isFetching: fetchingUsers } = useGetUsers({ ...DEFAULT_OPTIONS_PAYLOAD });
    const { userCompanies, isFetching, refetch } = useGetUserCompanies({ userId: (user || {}).value }, Boolean(user));
    const [userLocations, setUserLocations] = useState<any>(null);
    const { createUserLocationMapping: deleteLocations } = useCreateUserLocationMapping((response: any) => {
        if (response.key === API_RESULT.SUCCESS) {
            toast.success(`${userLocations.associateCompanyName} deleted successsfully.`);
            setUserLocations(null);
            refetch();
        } else {
            toast.error(response.value || ERROR_MESSAGES.ERROR);
        }
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    function onUserChange(e: any) {
        setUser(e);
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setUserLocations(null);
        refetch();
    }

    function handleCancel() {
        setUserLocations(null);
        setAction(ACTIONS.NONE);
    }

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();
        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event: any) => {
                    setUserLocations(row);
                    setAction(ACTIONS.EDIT);
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event: any) => {
                    setUserLocations(row);
                    setAction(ACTIONS.DELETE);
                }} />
            </div>
        )
    }

    function CountTmpl({ cell }: any) {
        const value = cell.getValue();
        const row = cell.getData();
        return (
            <div className="d-flex h-100 align-items-center">
                <a href="/" onClick={(e: any) => {
                    preventDefault(e);
                    setUserLocations(row);
                    setAction(ACTIONS.ADD);
                }}>{value || 0}</a>
            </div>
        )
    }

    const columns = [
        {
            title: "Company", field: "companyName",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Associate Company", field: "associateCompanyName",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Contact No.", field: "associateCompanyMobile",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Email Address", field: "associateCompanyEmail",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Locations", field: "count",
            formatter: reactFormatter(<CountTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Actions", hozAlign: "center", width: 160,
            headerSort: false, formatter: reactFormatter(<ActionColumnElements />)
        }
    ];

    const [tableConfig] = useState({
        paginationMode: 'local',
        ajaxRequestFunc,
        columns,
        rowHeight: 54,
        selectable: false,
        sortMode: 'local'
    });

    function formatApiResponse(params: any, list: any, pagination = {}) {
        const result: any = mapData(list);
        const total = result.length;
        const tdata = {
            data: result,
            total,
            last_page: Math.ceil(total / params.size) || 1,
            page: params.page || 1
        };
        setData(tdata);
        return tdata;
    }

    function ajaxRequestFunc(url: any, config: any, params: any) {
        setParams(params);
        setPayload({ ...params });
        return Promise.resolve(formatApiResponse(params, userCompanies));
    }

    function deleteUseCompany() {
        deleteLocations({
            userId: user.value,
            associateCompanyId: userLocations.associateCompanyId,
            companyLocationMappingIds: []
        } as any);
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, userCompanies));
        }
    }, [isFetching]);

    useEffect(() => {
        if (!fetchingUsers && users) {
            const _user = users[0];
            if (_user) {
                setUser({ value: _user.id, label: _user.name, user: _user });
            }
        }
    }, [fetchingUsers])

    return (
        <>
            <MastersLayout title="Company Mapping" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <div className="col-3 px-0">
                                    <Select placeholder='Select User' options={(users || []).map((x: any) => {
                                        return { value: x.id, label: x.name, user: x }
                                    })} onChange={onUserChange} value={user} formatOptionLabel={
                                        ({ label, user }) => {
                                            return (
                                                <div className="d-flex flex-column">
                                                    <span>{label}</span>
                                                    <span className="text-sm fst-italic fw-bold">Role: {(((user || {}).userRoles || [])[0] || {}).name || '-NA-'}</span>
                                                </div>
                                            )
                                        }
                                    } />
                                </div>
                                <Button variant="primary" className="px-4 ms-auto text-nowrap" disabled={!Boolean(user)}
                                    onClick={() => setAction(ACTIONS.ADD)}>Add User Location</Button>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} />
                </div>
            </MastersLayout>

            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <UserLocationMapping user={user} data={userLocations}
                    onClose={handleCancel} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete User Company Mapping'} onSubmit={deleteUseCompany} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the location mapping for, <strong>{(userLocations || {}).associateCompanyName}</strong> ?</div>
                </ConfirmModal>
            }
            {/* {deletingCompany && <PageLoader message={'Deleting Company...'} />} */}
        </>
    )
}

export default UserCompanies;