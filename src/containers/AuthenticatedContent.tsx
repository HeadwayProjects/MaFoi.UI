import React, { useEffect } from "react";
import { navigate, useQueryParams, useRoutes } from "raviger";
import * as auth from "../backend/auth"
import VendorDashboard from "../components/pages/Vendor/Dashboard/Dashboard";
import ActivitiesManagement from "../components/pages/Vendor/TaskManagement/ActivitiesManagement";
import LayoutWithSideNav from "../components/shared/LayoutWithSideNav";
import AuditorDashboard from "../components/pages/Auditor/AuditorDashboard";
import TaskManagement from "../components/pages/Auditor/TaskManagement";
import Law from "../components/pages/Masters/Law";
import Act from "../components/pages/Masters/Act";
import Activity from "../components/pages/Masters/Activity";
import Rule from "../components/pages/Masters/Rule";
import Location from "../components/pages/Masters/Location";
import City from "../components/pages/Masters/City";
import State from "../components/pages/Masters/State";
import ChangePassword from "../components/pages/Authenticate/ChangePassword";
import Login from "../components/pages/Authenticate/Login";
import Navbar from "../components/shared/Navbar";
import RuleCompliance from "../components/pages/Masters/RuleCompliance/RuleCompliance";
import RuleStateCompanyMapping from "../components/pages/Masters/Mappings/RuleStateCompanyMapping";
import MangeUsers from "../components/pages/UserManagement/ManageUsers";
import AssociateCompanies from "../components/pages/Masters/Companies/AssociateCompanies";
import Companies from "../components/pages/Masters/Companies/Companies";
import CompanyLocationMappings from "../components/pages/Masters/Companies/CompanyLocationMappings";
import UserCompanies from "../components/pages/UserManagement/UserCompanies";
import AuditSchedule from "../components/pages/Masters/Companies/AuditSchedule";
import AuditScheduleDetails from "../components/pages/Masters/Companies/AuditScheduleDetails";
import LockUnLock from "../components/pages/Masters/Companies/LockUnLock";
import EmailTemplates from "../components/pages/Email/EmailTemplates";
import Home from "../components/pages/home";
import Roles from "../components/pages/UserManagement/Roles/Roles";
import ManageVerticals from "../components/pages/Masters/Companies/Verticals/ManageVerticals";
import ManageDepartments from "../components/pages/Masters/Companies/Departments/ManageDepartments";
import ComplianceSchedule from "../components/pages/Compliance/ComplianceSchedule";
import ComplianceScheduleDetails from "../components/pages/Compliance/ComplianceScheduleDetails";
import LockUnLockCompliance from "../components/pages/Compliance/LockUnLockCompliance";
import { USER_PRIVILEGES } from "../components/pages/UserManagement/Roles/RoleConfiguration";
import ComplianceOwnerDashboard from "../components/pages/ComplianceOwner/Dashboard/ComplianceOwnerDashboard";
import MangeDepartmentUsers from "../components/pages/UserManagement/DepartmentUsers.tsx/ManageDepartmentUsers";

export const ROLE_MAPPING: any = {
    AuditorAdmin: ['dashboard', 'activities'],
    AuditorUser: ['dashboard', 'activities'],
    VendorAdmin: ['dashboard', 'activities'],
    VendorUser: ['dashboard', 'activities'],
    SuperAdmin: ['masters', 'companies', 'auditSchedule', 'userManagement', 'email']
}

function AuthenticatedContent() {
    const [query] = useQueryParams();
    const user = auth.getUserDetails() || {};
    const hasToken = !!auth.getAuthToken();

    function layout(children: any, layoutWithSidenav = true) {
        if (layoutWithSidenav) {
            return <LayoutWithSideNav>{children}</LayoutWithSideNav>
        }
        return <>{children}</>
    }

    function getHomePage() {
        if (!hasToken) {
            return <Login />
        } else {
            if (auth.hasUserAccess(USER_PRIVILEGES.SUBMITTER_DASHBOARD)) {
                return layout(<VendorDashboard />);
            } else if (auth.hasUserAccess(USER_PRIVILEGES.REVIEWER_DASHBOARD)) {
                return layout(<AuditorDashboard />);
            } else if (auth.hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD)) {
                return layout(<ComplianceOwnerDashboard />);
            } else if (auth.hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD)) {
                return layout(<VendorDashboard />);
            } else {
                return layout(<Home />)
            }
        }
    }

    function getActivitiesByRole() {
        if (auth.hasUserAccess(USER_PRIVILEGES.SUBMITTER_ACTIVITIES)) {
            return layout(<ActivitiesManagement />);
        } else if (auth.hasUserAccess(USER_PRIVILEGES.REVIEWER_ACTIVITIES)) {
            return layout(<TaskManagement />);
        } else if (auth.hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD)) {
            return layout(<VendorDashboard />);
        } else if (auth.hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD)) {
            return layout(<VendorDashboard />);
        } else {
            return layout(<></>)
        }
    }

    const routes = {
        '/dashboard': () => getHomePage(),
        '/dashboard/activities': () => (
            layout(<ActivitiesManagement />)
        ),
        '/activities': () => getActivitiesByRole(),
        '/masters/law': () => (
            layout(<Law />)
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
        '/masters/compliance': () => (
            layout(<RuleCompliance />)
        ),
        '/masters/mapping': () => (
            layout(<RuleStateCompanyMapping />)
        ),
        '/companies/list': () => (
            layout(<Companies />)
        ),
        '/companies/associateCompanies': () => (
            layout(<AssociateCompanies />)
        ),
        '/companies/verticals': () => (
            layout(<ManageVerticals />)
        ),
        '/companies/departments': () => (
            layout(<ManageDepartments />)
        ),
        '/companies/locationMapping': () => (
            layout(<CompanyLocationMappings />)
        ),
        '/companies/auditSchedule': () => (
            layout(<AuditSchedule />)
        ),
        '/auditSchedule/importExport': () => (
            layout(<AuditSchedule />)
        ),
        '/auditSchedule/details': () => (
            layout(<AuditScheduleDetails />)
        ),
        '/auditSchedule/blockUnblock': () => (
            layout(<LockUnLock />)
        ),
        '/userManagement/roles': () => (
            layout(<Roles />)
        ),
        '/complianceManagement/complianceSchedule': () => (
            layout(<ComplianceSchedule />)
        ),
        '/complianceManagement/compliance-schedule-details': () => (
            layout(<ComplianceScheduleDetails />)
        ),
        '/complianceManagement/blockUnblock': () => (
            layout(<LockUnLockCompliance />)
        ),
        '/complianceManagement/dashboard': () => (
            layout(<ComplianceOwnerDashboard />)
        ),
        '/userManagement/users': () => (
            layout(<MangeUsers />)
        ),
        '/userManagement/mapping': () => (
            layout(<UserCompanies />)
        ),
        '/userManagement/userDepartment': () => (
            layout(<MangeDepartmentUsers />)
        ),
        '/email/templates': () => (
            layout(<EmailTemplates />)
        ),
        '/changePassword/:token': ({ token }: any) => (
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
            <>
                {getHomePage()}
            </>
        ),
        '/login': () => (
            <Login />
        )
    }

    useEffect(() => {
        if (query && query.redirectUri) {
            navigate(query.redirectUri);
        }
    }, [query]);

    const route = useRoutes(routes, { basePath: '' })
    return (
        <>
            {route}
        </>
    );

}

export default AuthenticatedContent;