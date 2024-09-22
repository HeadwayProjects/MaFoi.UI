import React, { useEffect, useState } from 'react';
import { ActiveLink, navigate } from 'raviger';
import '../shared/Sidenav.css';
import * as auth from "../../backend/auth";
import { preventDefault } from '../../utils/common';
import Icon from '../common/Icon';
import { getBasePath } from '../../App';
import { ROLE_MAPPING } from '../../containers/AuthenticatedContent';
import { USER_PRIVILEGES } from '../pages/UserManagement/Roles/RoleConfiguration';

const SideNavMenu = [
    { id: 'dashboard', url: '/dashboard', icon: 'th', label: 'Dashboard', privilege: USER_PRIVILEGES.SUBMITTER_DASHBOARD },
    { id: 'dashboard', url: '/dashboard', icon: 'th', label: 'Dashboard', privilege: USER_PRIVILEGES.REVIEWER_DASHBOARD },
    { id: 'dashboard', url: '/dashboard', icon: 'th', label: 'Dashboard', privilege: USER_PRIVILEGES.OWNER_DASHBOARD },
    { id: 'dashboard', url: '/dashboard', icon: 'th', label: 'Dashboard', privilege: USER_PRIVILEGES.MANAGER_DASHBOARD },
    { id: 'dashboard', url: '/dashboard', icon: 'th', label: 'Dashboard', privilege: USER_PRIVILEGES.ESCALATION_DASHBOARD },
    
       {
        id: 'masters', url: '/masters/act', icon: 'crown', label: 'Masters',
        children: [
            { id: 'masters/law', url: '/masters/law', label: 'Law Category', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY },
            { id: 'masters/Act', url: '/masters/Act', label: 'Act', privilege: USER_PRIVILEGES.VIEW_ACTS },
            { id: 'masters/activity', url: '/masters/activity', label: 'Activity', privilege: USER_PRIVILEGES.VIEW_ACTIVITIES },
            { id: 'masters/rule', url: '/masters/rule', label: 'Rule', privilege: USER_PRIVILEGES.VIEW_RULES },
            { id: 'masters/state', url: '/masters/state', label: 'State', privilege: USER_PRIVILEGES.VIEW_STATES },
            { id: 'masters/city', url: '/masters/city', label: 'City', privilege: USER_PRIVILEGES.VIEW_CITIES },
            // { id: 'masters/compliance', url: '/masters/compliance', label: 'Rule Compliance', privilege: USER_PRIVILEGES.VIEW_RULE_COMPLIANCE },
            { id: 'masters/mapping', url: '/masters/mapping', label: 'Mappings', privilege: USER_PRIVILEGES.VIEW_MAPPINGS },
            { id: 'setupInput/stateRegisterConfiguration', url: '/setupInput/stateRegisterConfiguration', label: 'State Register Configuration', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY }
        ]
    },
    {
        id: 'companies', url: '/companies/list', icon: 'building', label: 'Companies',
        children: [
            {
                id: 'companies/list', url: '/companies/list',
                label: 'Manage Companies', privilege: USER_PRIVILEGES.VIEW_COMPANIES
            },
            {
                id: 'companies/associateCompanies', url: '/companies/associateCompanies',
                label: 'Associate Companies', privilege: USER_PRIVILEGES.VIEW_ASSOCIATE_COMPANIES
            },
            {
                id: 'companies/locationMapping', url: '/companies/locationMapping',
                label: 'Location Mapping', privilege: USER_PRIVILEGES.VIEW_LOCATION_MAPPINGS
            },
            {
                id: 'companies/verticals', url: '/companies/verticals',
                label: 'Verticals', privilege: USER_PRIVILEGES.VIEW_VERTICALS
            },
            {
                id: 'companies/departments', url: '/companies/departments',
                label: 'Departments', privilege: USER_PRIVILEGES.VIEW_DEPARTMENTS
            },
            {
                id: 'companies/escalationMatrix', url: '/companies/escalationMatrix',
                label: 'Escalation Matrix', privilege: USER_PRIVILEGES.VIEW_COMPANY_ESCALTION_MATIX
            }
        ]
    },
    {
        id: 'auditSchedule', url: '/auditSchedule/importExport', icon: 'notes', label: 'Audit Management',
        children: [
            {
                id: 'auditSchedule/importExport', url: '/auditSchedule/importExport',
                label: 'Audit Schedule', privilege: USER_PRIVILEGES.AUDIT_SCHEDULE
            },
            {
                id: 'auditSchedule/details', url: '/auditSchedule/details',
                label: 'Audit Schedule Details', privilege: USER_PRIVILEGES.VIEW_AUDIT_SCHEDULE_DETAILS
            },
            {
                id: 'auditSchedule/blockUnblock', url: '/auditSchedule/blockUnblock',
                label: 'Un-Block Activities', privilege: USER_PRIVILEGES.VIEW_AUDIT_SCHEDULE_BLOCK_UNBLOCK
            }
        ]
    },
    {
        id: 'complianceManagement', url: '/complianceManagement/list', icon: 'notepad', label: 'Compliance Management', children: [
            {
                id: 'complianceManagement/complianceSchedule', url: '/complianceManagement/complianceSchedule',
                label: 'Compliance Schedule', privilege: USER_PRIVILEGES.COMPLIANCE_SCHEDULE
            },
            {
                id: 'complianceManagement/compliance-schedule-details', url: '/complianceManagement/compliance-schedule-details',
                label: 'Comp Schedule Details', privilege: USER_PRIVILEGES.VIEW_COMPLIANCE_SCHEDULE_DETAILS
            }
            // {
            //     id: 'complianceManagement/blockUnblock', url: '/complianceManagement/blockUnblock',
            //     label: 'Block Un-Block', privilege: USER_PRIVILEGES.VIEW_AUDIT_SCHEDULE_BLOCK_UNBLOCK
            // }
        ]
    },
    {
        id: 'setupInput', url: '/setupInput', icon: 'upload', label: 'Setup Input',
        children: [
            { id: 'setupInput/holidayList', url: '/setupInput/holidayList', label: 'Holiday List', privilege: USER_PRIVILEGES.VIEW_HOLIDAY_LIST },
            { id: 'setupInput/leaveConfiguration', url: '/setupInput/leaveConfiguration', label: 'Leave Configuration', privilege: USER_PRIVILEGES.VIEW_LEAVE_CONFIGURATION },
            { id: 'setupInput/attendanceConfig', url: '/setupInput/attendanceConfig', label: 'Attendance Config', privilege: USER_PRIVILEGES.VIEW_ATTENDANCE_CONFIGURATION },
            { id: 'setupInput/salaryComponents', url: '/setupInput/salaryComponents', label: 'Salary Components', privilege: USER_PRIVILEGES.VIEW_SALARY_COMPONENTS },
            { id: 'setupInput/inputModuleUploads', url: '/setupInput/inputModuleUploads', label: 'Input Module Uploads', privilege: USER_PRIVILEGES.VIEW_INPUT_MODULE_UPLOAD },
            // { id: 'setupInput/holidayList', url: '/setupInput/holidayList', label: 'Holiday List', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY },
            // { id: 'setupInput/leaveConfiguration', url: '/setupInput/leaveConfiguration', label: 'Leave Configuration', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY },
            // { id: 'setupInput/attendanceConfig', url: '/setupInput/attendanceConfig', label: 'Attendance Config', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY },
            // { id: 'setupInput/salaryComponents', url: '/setupInput/salaryComponents', label: 'Salary Components', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY },
            // { id: 'setupInput/inputModuleUploads', url: '/setupInput/inputModuleUploads', label: 'Input Module Uploads', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY },
        ]
    },
    {
        id: 'inputUploads', url: '/inputUploads', icon: 'eye', label: 'Input Uploads',
        children: [

            { id: 'inputUploads/dashboard', url: '/inputUploads/dashboard', label: 'Dashboard', privilege: USER_PRIVILEGES.VIEW_EMPLOYEE_DASHBOARD },
            { id: 'inputUploads/registerDownload', url: '/inputUploads/registerDownload', label: 'Register Download', privilege: USER_PRIVILEGES.VIEW_REGISTER_DOWNLOAD },
            { id: 'inputUploads/employeeMasterUpload', url: '/inputUploads/employeeMasterUpload', label: 'Employee Master', privilege: USER_PRIVILEGES.VIEW_EMPLOYEE_MASTER },
            { id: 'inputUploads/employeeLeaveCreditUpload', url: '/inputUploads/employeeLeaveCreditUpload', label: 'Employee Leave Credit', privilege: USER_PRIVILEGES.VIEW_EMPLOYEE_LEAVE_CREDIT },
            { id: 'inputUploads/employeeLeaveAvailedUpload', url: '/inputUploads/employeeLeaveAvailedUpload', label: 'Employee Leave Availed', privilege: USER_PRIVILEGES.VIEW_EMPLOYEE_LEAVE_AVAILED },
            { id: 'inputUploads/employeeAttendanceUpload', url: '/inputUploads/employeeAttendanceUpload', label: 'Employee Attendance', privilege: USER_PRIVILEGES.VIEW_EMPLOYEE_ATTENDANCE },
            { id: 'inputUploads/employeeWageUpload', url: '/inputUploads/employeeWageUpload', label: 'Employee Wage', privilege: USER_PRIVILEGES.VIEW_EMPLOYEE_WAGE }

            // { id: 'inputUploads/dashboard', url: '/inputUploads/dashboard', label: 'Dashboard', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY },
            // { id: 'inputUploads/registerDownload', url: '/inputUploads/registerDownload', label: 'Register Download', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY },
            // { id: 'inputUploads/employeeMasterUpload', url: '/inputUploads/employeeMasterUpload', label: 'Employee Master', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY },
            // { id: 'inputUploads/employeeLeaveCreditUpload', url: '/inputUploads/employeeLeaveCreditUpload', label: 'Employee Leave Credit', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY },
            // { id: 'inputUploads/employeeLeaveAvailedUpload', url: '/inputUploads/employeeLeaveAvailedUpload', label: 'Employee Leave Availed', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY },
            // { id: 'inputUploads/employeeAttendanceUpload', url: '/inputUploads/employeeAttendanceUpload', label: 'Employee Attendance', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY },
            // { id: 'inputUploads/employeeWageUpload', url: '/inputUploads/employeeWageUpload', label: 'Employee Wage', privilege: USER_PRIVILEGES.VIEW_LAW_CATEGORY }

        ]
    },

    {
        id: 'userManagement', url: '/userManagement/roles', icon: 'users', label: 'User Management',
        children: [
            { id: 'userManagement/roles', url: '/userManagement/roles', label: 'Manage Roles', privilege: USER_PRIVILEGES.VIEW_ROLES },
            { id: 'userManagement/users', url: '/userManagement/users', label: 'Manage Users', privilege: USER_PRIVILEGES.VIEW_USERS },
            { id: 'userManagement/mapping', url: '/userManagement/mapping', label: 'Company Mapping', privilege: USER_PRIVILEGES.VIEW_COMPANY_MAPPINGS },
            {
                id: 'userManagement/userDepartment', url: '/userManagement/userDepartment',
                label: 'User Department Mapping', privilege: USER_PRIVILEGES.VIEW_DEPARTMENT_USER_MAPPING
            }
        ]
    },
    {
        id: 'email', url: '/templates/email', icon: 'email', label: 'Email & Notifications',
        children: [
            { id: 'templates/email', url: '/templates/email', label: 'Email Templates', privilege: USER_PRIVILEGES.VIEW_EMAIL_TEMPLATES },
            { id: 'templates/notification', url: '/templates/notification', label: 'Notification Templates', privilege: USER_PRIVILEGES.VIEW_NOTIFICATION_TEMPLATES }
        ]
    },
    // { id: 'activities', url: '/activities', icon: 'task', label: 'Activities', privilege: USER_PRIVILEGES.READ_ONLY_ACTIVITIES },
    { id: 'activities', url: '/activities', icon: 'task', label: 'Activities', privilege: USER_PRIVILEGES.REVIEWER_ACTIVITIES },
    // { id: 'activities', url: '/activities', icon: 'task', label: 'Activities', privilege: USER_PRIVILEGES.OWNER_ACTIVITIES },
    // { id: 'activities', url: '/activities', icon: 'task', label: 'Activities', privilege: USER_PRIVILEGES.MANAGER_ACTIVITIES },
    { id: 'activities', url: '/activities', icon: 'task', label: 'Activities', privilege: USER_PRIVILEGES.SUBMITTER_ACTIVITIES },
    { id: 'notices', url: '/notices', icon: 'task', label: 'Noticies', privilege: USER_PRIVILEGES.VIEW_NOTICES },
    { id: 'reports', url: '/reports', icon: 'report', label: 'Reports', disable: true },
    { id: 'notifications', url: '/notifications', icon: 'notification', label: 'Notifications', privilege: USER_PRIVILEGES.VIEW_USER_NOTIFICATIONS }
];

function Sidenav({ open, toggleSidenav }: any) {
    const [user] = useState(auth.getUserDetails());
    const [sideMenu, setSideMenu] = useState<any[] | null>([]);
    const [toggelStatus, setToggleStatus] = useState<any>({});

    useEffect(() => {
        if (user) {
            const privileges: any = auth.getUserPrivileges();
            const _menu: any[] = [];
            SideNavMenu.forEach((menu: any) => {
                if (menu.children) {
                    const children = menu.children.filter((child: any) => {
                        return privileges.includes(child.privilege);
                    });
                    if (children.length) {
                        _menu.push({
                            ...menu,
                            children
                        });
                    }
                } else {
                    if (privileges.includes(menu.privilege)) {
                        _menu.push(menu);
                    }
                }
            });
            const _toggleStatus = {};
            _menu.forEach(x => {
                toggelStatus[x.id] = false
            });
            setToggleStatus(_toggleStatus)
            setSideMenu(_menu);
        }
    }, [user]);

    function NavItem({ children, url, name, hasChild, index, parentIndex }: any) {
        const [isActive, setActive] = useState(false);
        const urlPath = window.location.pathname;
        function onClick(e: any) {
            preventDefault(e);
            if (!hasChild) {
                navigate(`${getBasePath()}${url}`, { replace: true, state: null });
            }
        }

        useEffect(() => {
            if (urlPath) {
                setActive(urlPath.includes(name));
                const hasDashboardAccess = auth.hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD)
                    || auth.hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD)
                    || auth.hasUserAccess(USER_PRIVILEGES.SUBMITTER_DASHBOARD)
                    || auth.hasUserAccess(USER_PRIVILEGES.REVIEWER_DASHBOARD)
                if (hasDashboardAccess && urlPath === '/' && parentIndex === 0 && (index === undefined || index === 0)) {
                    setActive(true);
                }
            }
        }, [urlPath]);

        return (
            <ActiveLink href={url} onClick={onClick} className={isActive ? 'active' : ''}>
                {children}
            </ActiveLink>
        )
    }

    function toggleMenu(event: any, data?: any, hasChild = false) {
        if (hasChild) {
            preventDefault(event);
            const { id } = data;
            const _toogleStatus = { ...toggelStatus };
            _toogleStatus[id] = !_toogleStatus[id];
            setToggleStatus(_toogleStatus);
        }
    }

    function resetToggle() {
        const _toogleStatus = { ...toggelStatus };
        Object.keys(_toogleStatus).forEach(key => {
            _toogleStatus[key] = false;
        });
        setToggleStatus(_toogleStatus);
    }

    return (
        <>
            {
                (user !== null && sideMenu !== null) ?
                    <ul className='sideNav m-0 p-0'>
                        <li>
                            <div className="d-flex flex-row w-100 align-items-center justify-content-end border-bottom" style={{ height: '48px' }}>
                                <span className="sidenav-item-icon" style={{ cursor: 'pointer' }}>
                                    <Icon name={open ? 'double-left' : 'double-right'} action={() => {
                                        toggleSidenav(!open);
                                        resetToggle();
                                    }} className={"px-3 px-2"} />
                                </span>
                            </div>
                        </li>
                        {
                            sideMenu.map((item, index) => {
                                const hasChild = (item.children || []).length > 0;
                                return (
                                    <li key={item.id} >
                                        <button type="button" disabled={item.disable}>
                                            <NavItem url={item.url} name={item.id} hasChild={hasChild} parentIndex={index}>
                                                <div className='d-flex flex-row align-items-center w-100' onClick={(e) => toggleMenu(e, item, hasChild)}>
                                                    {
                                                        item.icon &&
                                                        <span className="sidenav-item-icon">
                                                            <Icon name={item.icon} />
                                                        </span>
                                                    }
                                                    <span className="sidenav-item-label">{item.label}</span>
                                                    {
                                                        hasChild &&
                                                        <Icon name={toggelStatus[item.id] ? 'angle-up' : 'angle-down'}
                                                            className={'ms-auto d-none'} action={(e: any) => toggleMenu(e, item, hasChild)} />
                                                    }
                                                </div>
                                            </NavItem>
                                            {
                                                item.children &&
                                                <div className={`d-flex flex-column w-100 justify-content-start children ${!toggelStatus[item.id] ? 'd-none' : 'd-flex'}`}>
                                                    {
                                                        item.children.map((child: any, childIndex: number) => (
                                                            <NavItem url={child.url} key={child.id} name={child.id} index={childIndex} parentIndex={index}>
                                                                <span className="sidenav-item-label">{child.label}</span>
                                                            </NavItem>
                                                        ))
                                                    }
                                                </div>
                                            }
                                        </button>
                                    </li>
                                )
                            })
                        }
                    </ul> : null

            }
        </>
    );

}

export default Sidenav;