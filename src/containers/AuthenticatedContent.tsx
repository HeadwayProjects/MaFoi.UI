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
import ComplianceSchedule from "../components/pages/ComplianceMasters/ComplianceSchedule";
import ComplianceScheduleDetails from "../components/pages/ComplianceMasters/ComplianceScheduleDetails";
import { USER_PRIVILEGES } from "../components/pages/UserManagement/Roles/RoleConfiguration";
import ComplianceOwnerDashboard from "../components/pages/ComplianceOwner/Dashboard/ComplianceOwnerDashboard";
import MangeDepartmentUsers from "../components/pages/UserManagement/DepartmentUsers.tsx/ManageDepartmentUsers";
import ComplianceOwnerActivities from "../components/pages/ComplianceOwner/TaskManagement/ComplianceOwnerActivities";
import NotificationsCenter from "../components/pages/Notifications/NotificationsCenter";
import ManageEscalationMatrix from "../components/pages/Masters/Companies/EscalationMatrix/ManageEscalationMatrix";
import NotificationTemplates from "../components/pages/Notifications/NotificationTemplates";
import ManageNotices from "../components/pages/Notices/ManageNotices";
import EmployeeMasterUpload from "../components/pages/InputModule/EmployeeMasterUpload";
import HolidayList from "../components/pages/InputModule/HolidayList";
import LeaveConfiguration from "../components/pages/InputModule/LeaveConfiguration";
import LeaveMapping from "../components/pages/InputModule/Dashboard";
import AttendanceConfig from "../components/pages/InputModule/AttendanceConfig";
import StateRegisterConfiguration from "../components/pages/InputModule/StateRegisterConfiguration";
import EmployeeLeaveCreditUpload from "../components/pages/InputModule/EmployeeLeaveCreditUpload";
import EmployeeLeaveAvailedUpload from "../components/pages/InputModule/EmployeeLeaveAvailedUpload";
import EmployeeAttendanceUpload from "../components/pages/InputModule/EmployeeAttendanceUpload";
import SalaryComponents from "../components/pages/InputModule/SalaryComponents";
import Dashboard from "../components/pages/InputModule/Dashboard";
import Configurations from "../components/pages/InputModule/Configurations";

export const ROLE_MAPPING: any = {
    AuditorAdmin: ['dashboard', 'activities'],
    AuditorUser: ['dashboard', 'activities'],
    VendorAdmin: ['dashboard', 'activities'],
    VendorUser: ['dashboard', 'activities'],
    SuperAdmin: ['masters', 'companies', 'auditSchedule', 'userManagement', 'email']
}

function AuthenticatedContent() {
    const [query] = useQueryParams();
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
            } else if (
                auth.hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD) ||
                auth.hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD) ||
                auth.hasUserAccess(USER_PRIVILEGES.ESCALATION_DASHBOARD)
            ) {
                return layout(<ComplianceOwnerDashboard />);
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
            return layout(<ComplianceOwnerActivities />);
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
        '/input/dashboard': () => (layout(<Dashboard />)),
        '/input/configurations': () => (layout(<Configurations />)),
        '/input/holidayList': () => (layout(<HolidayList />)),
        '/input/leaveConfiguration': () => (layout(<LeaveConfiguration />)),
        '/input/attendanceConfig': () => (layout(<AttendanceConfig />)),
        '/input/salaryComponents': () => (layout(<SalaryComponents />)),
        '/input/stateRegisterConfiguration': () => (layout(<StateRegisterConfiguration />)),
        '/input/employeeMasterUpload': () => (layout(<EmployeeMasterUpload />)),
        '/input/employeeLeaveCreditUpload': () => (layout(<EmployeeLeaveCreditUpload />)),
        '/input/employeeLeaveAvailedUpload': () => (layout(<EmployeeLeaveAvailedUpload />)),
        '/input/employeeAttendanceUpload': () => (layout(<EmployeeAttendanceUpload />)),

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
        '/companies/escalationMatrix': () => (
            layout(<ManageEscalationMatrix />)
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
        // '/complianceManagement/blockUnblock': () => (
        //     layout(<LockUnLockCompliance />)
        // ),
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
        '/templates/email': () => (
            layout(<EmailTemplates />)
        ),
        '/templates/notification': () => (
            layout(<NotificationTemplates />)
        ),
        '/notifications': () => (
            layout(<NotificationsCenter />)
        ),
        '/notices': () => (
            layout(<ManageNotices />)
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