import React from "react";
import { useRoutes } from "raviger";
import * as auth from "../backend/auth"
import Dashboard from "../components/pages/Dashboard/Dashboard";
import VendorDashboard from "../components/pages/Vendor/Dashboard/Dashboard";
import ActivitiesManagement from "../components/pages/Vendor/TaskManagement/ActivitiesManagement";
import LayoutWithSideNav from "../components/shared/LayoutWithSideNav";

function AuthenticatedContent() {
    const user = auth.getUserDetails();
    const isVendor = ['VendorAdmin', 'VendorUser'].includes(user.role)

    function layout(children, layoutWithSidenav = true) {
        if (layoutWithSidenav) {
            return <LayoutWithSideNav>{children}</LayoutWithSideNav>
        }
        return <>{children}</>
    }

    const routes = {
        '/dashboard': () => (
            layout(isVendor ? <VendorDashboard /> : <Dashboard />)
        ),
        '/dashboard/activities': () => (
            layout(<ActivitiesManagement />)
        ),
        '/activities': () => (
            layout(isVendor ? <ActivitiesManagement /> : <></>)
        ),
        '/': () => (
            layout(isVendor ? <VendorDashboard /> : <Dashboard />)
        ),
    }

    const route = useRoutes(routes, { basePath: '' })
    return <>{route}</>

}

export default AuthenticatedContent;