import React from "react";
import { useRoutes } from "raviger";
import * as auth from "../backend/auth"
import VendorDashboard from "../components/pages/Vendor/Dashboard/Dashboard";
import ActivitiesManagement from "../components/pages/Vendor/TaskManagement/ActivitiesManagement";
import LayoutWithSideNav from "../components/shared/LayoutWithSideNav";
import AuditorDashboard from "../components/pages/Auditor/AuditorDashboard";

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
            layout(isVendor ? <VendorDashboard /> : <AuditorDashboard />)
        ),
        '/dashboard/activities': () => (
            layout(<ActivitiesManagement />)
        ),
        '/activities': () => (
            layout(isVendor ? <ActivitiesManagement /> : <></>)
        ),
        '/': () => (
            layout(isVendor ? <VendorDashboard /> : <AuditorDashboard />)
        ),
    }

    const route = useRoutes(routes, { basePath: '' })
    return <>{route}</>

}

export default AuthenticatedContent;