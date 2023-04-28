import React from "react";
import { useRoutes } from "raviger";
import * as auth from "../backend/auth"
import VendorDashboard from "../components/pages/Vendor/Dashboard/Dashboard";
import ActivitiesManagement from "../components/pages/Vendor/TaskManagement/ActivitiesManagement";
import LayoutWithSideNav from "../components/shared/LayoutWithSideNav";
import AuditorDashboard from "../components/pages/Auditor/AuditorDashboard";
import TaskManagement from "../components/pages/Auditor/TaskManagement";
import Act from "../components/pages/Masters/Act";
import Activity from "../components/pages/Masters/Activity";
import Rule from "../components/pages/Masters/Rule";
import Location from "../components/pages/Masters/Location";
import Companies from "../components/pages/Masters/Companies";
import City from "../components/pages/Masters/City";
import State from "../components/pages/Masters/State";
import ChangePassword from "../components/pages/Authenticate/ChangePassword";
import Login from "../components/pages/Authenticate/Login";
import Navbar from "../components/shared/Navbar";

function AuthenticatedContent() {
    const user = auth.getUserDetails() || {};
    const isVendor = ['VendorAdmin', 'VendorUser'].includes(user.role)

    function layout(children, layoutWithSidenav = true) {
        if (layoutWithSidenav) {
            return <LayoutWithSideNav>{children}</LayoutWithSideNav>
        }
        return <>{children}</>
    }

    const routes = {
        '/dashboard': () => (
            layout(isVendor ? <VendorDashboard /> : <AuditorDashboard />)
        ),
        '/dashboard/activities': () => (
            layout(<ActivitiesManagement />)
        ),
        '/activities': () => (
            layout(isVendor ? < ActivitiesManagement /> : <TaskManagement />)
        ),
        '/masters/act': () => (
            layout(<Act />)
        ),
        '/masters/activity': () => (
            layout(<Activity />)
        ),
        '/masters/rule': () => (
            layout(<Rule />)
        ),
        '/masters/state': () => (
            layout(<State />)
        ),
        '/masters/city': () => (
            layout(<City />)
        ),
        '/masters/location': () => (
            layout(<Location />)
        ),
        '/masters/companies': () => (
            layout(<Companies />)
        ),
        '/changePassword/:token': ({ token }) => (
            <>
                <Navbar showUser={false} />
                <div className="page-layout-container bg-white">
                    <div className="main-container overflow-hidden">
                        <ChangePassword token={token} />
                    </div>
                </div>
            </>
        ),
        '/': () => (
            layout(isVendor ? <VendorDashboard /> : <AuditorDashboard />)
        ),
        '/login': () => (
            <Login />
        ),
    }

    const route = useRoutes(routes, { basePath: '' })
    return (
        <>
            {route}
        </>
    );

}

export default AuthenticatedContent;