import React, { useState } from "react";
import MastersLayout from "../../Masters/MastersLayout";
import ManageRoles from "./ManageRoles";
import AddEditPrivileges from "./AddEditPrivileges";

export enum VIEWS {
    LIST = 'list',
    ADD = 'add'
}

export default function Roles() {
    const [view, setView] = useState(VIEWS.LIST);
    const [role, setRole] = useState(null);

    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'userManagement', label: 'User Management', path: '/userManagement/roles' },
        { id: 'roles', label: 'Manage Roles' },
    ]);

    function changeView(view: VIEWS, data: any) {
        setRole(data || null);
        setView(view);
    }
    return (
        <MastersLayout title="Manage Roles" breadcrumbs={breadcrumb}>
            {
                view === VIEWS.LIST &&
                <ManageRoles changeView={changeView} />
            }
            {
                view === VIEWS.ADD &&
                <AddEditPrivileges changeView={changeView} role={role}/>
            }
            {/* {
                [VIEWS.ADD, VIEWS.EDIT].includes(view) &&
                <AddEditCompany changeView={changeView} {...viewData} />
            } */}
        </MastersLayout>
    )
}