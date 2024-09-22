export enum USER_PRIVILEGES {
    VIEW_LAW_CATEGORY = 'VIEW_LAW_CATEGORY',
    ADD_LAW_CATEGORY = 'ADD_LAW_CATEGORY',
    EDIT_LAW_CATEGORY = 'EDIT_LAW_CATEGORY',
    DELETE_LAW_CATEGORY = 'DELETE_LAW_CATEGORY',
    EXPORT_LAW_CATEGORIES = 'EXPORT_LAW_CATEGORIES',
    VIEW_ACTS = 'VIEW_ACTS',
    ADD_ACT = 'ADD_ACT',
    EDIT_ACT = 'EDIT_ACT',
    DELETE_ACT = 'DELETE_ACT',
    EXPORT_ACTS = 'EXPORT_ACTS',
    VIEW_ACTIVITIES = 'VIEW_ACTIVITIES',
    ADD_ACTIVITY = 'ADD_ACTIVITY',
    EDIT_ACTIVITY = 'EDIT_ACTIVITY',
    DELETE_ACTIVITY = 'DELETE_ACTIVITY',
    EXPORT_ACTIVITIES = 'EXPORT_ACTIVITIES',
    VIEW_RULES = 'VIEW_RULES',
    ADD_RULE = 'ADD_RULE',
    EDIT_RULE = 'EDIT_RULE',
    DELETE_RULE = 'DELETE_RULE',
    EXPORT_RULES = 'EXPORT_RULES',
    VIEW_STATES = 'VIEW_STATES',
    ADD_STATE = 'ADD_STATE',
    EDIT_STATE = 'EDIT_STATE',
    DELETE_STATE = 'DELETE_STATE',
    EXPORT_STATES = 'EXPORT_STATES',
    VIEW_CITIES = 'VIEW_CITIES',
    ADD_CITY = 'ADD_CITY',
    EDIT_CITY = 'EDIT_CITY',
    DELETE_CITY = 'DELETE_CITY',
    EXPORT_CITIES = 'EXPORT_CITIES',
    VIEW_MAPPINGS = 'VIEW_MAPPINGS',
    ADD_MAPPING = 'ADD_MAPPING',
    EDIT_MAPPING = 'EDIT_MAPPING',
    DELETE_MAPPING = 'DELETE_MAPPING',
    EXPORT_MAPPING = 'EXPORT_MAPPING',
    VIEW_COMPANIES = 'VIEW_COMPANIES',
    ADD_COMPANY = 'ADD_COMPANY',
    EDIT_COMPANY = 'EDIT_COMPANY',
    DELETE_COMPANY = 'DELETE_COMPANY',
    EXPORT_COMPANIES = 'EXPORT_COMPANIES',
    VIEW_ASSOCIATE_COMPANIES = 'VIEW_ASSOCIATE_COMPANIES',
    ADD_ASSOCIATE_COMPANY = 'ADD_ASSOCIATE_COMPANY',
    EDIT_ASSOCIATE_COMPANY = 'EDIT_ASSOCIATE_COMPANY',
    DELETE_ASSOCIATE_COMPANY = 'DELETE_ASSOCIATE_COMPANY',
    EXPORT_ASSOCIATE_COMPANIES = 'EXPORT_ASSOCIATE_COMPANIES',
    VIEW_LOCATION_MAPPINGS = 'VIEW_LOCATION_MAPPINGS',
    ADD_LOCATION_MAPPING = 'ADD_LOCATION_MAPPING',
    EDIT_LOCATION_MAPPING = 'EDIT_LOCATION_MAPPING',
    DELETE_LOCATION_MAPPING = 'DELETE_LOCATION_MAPPING',
    EXPORT_LOCATION_MAPPINGS = 'EXPORT_LOCATION_MAPPINGS',
    VIEW_VERTICALS = 'VIEW_VERTICALS',
    ADD_VERTICAL = 'ADD_VERTICAL',
    EDIT_VERTICAL = 'EDIT_VERTICAL',
    DELETE_VERTICAL = 'DELETE_VERTICAL',
    EXPORT_VERTICALS = 'EXPORT_VERTICALS',
    VIEW_DEPARTMENTS = 'VIEW_DEPARTMENTS',
    ADD_DEPARTMENT = 'ADD_DEPARTMENT',
    EDIT_DEPARTMENT = 'EDIT_DEPARTMENT',
    DELETE_DEPARTMENT = 'DELETE_DEPARTMENT',
    EXPORT_DEPARTMENTS = 'EXPORT_DEPARTMENTS',
    VIEW_ROLES = 'VIEW_ROLES',
    ADD_ROLE = 'ADD_ROLE',
    EDIT_ROLE = 'EDIT_ROLE',
    DELETE_ROLE = 'DELETE_ROLE',
    VIEW_USERS = 'VIEW_USERS',
    ADD_USER = 'ADD_USER',
    EDIT_USER = 'EDIT_USER',
    DELETE_USER = 'DELETE_USER',
    EXPORT_USERS = 'EXPORT_USERS',
    VIEW_COMPANY_MAPPINGS = 'VIEW_COMPANY_MAPPINGS',
    UPDATE_COMPANY_MAPPINGS = 'UPDATE_COMPANY_MAPPINGS',
    VIEW_DEPARTMENT_USER_MAPPING = 'VIEW_DEPARTMENT_USER_MAPPING',
    ADD_DEPARTMENT_USER_MAPPING = 'ADD_DEPARTMENT_USER_MAPPING',
    UPDATE_DEPARTMENT_USER_MAPPING = 'UPDATE_DEPARTMENT_USER_MAPPING',
    DELETE_DEPARTMENT_USER_MAPPING = 'DELETE_DEPARTMENT_USER_MAPPING',
    VIEW_COMPANY_ESCALTION_MATIX = 'VIEW_COMPANY_ESCALTION_MATIX',
    ADD_COMPANY_ESCALTION_MATIX = 'ADD_COMPANY_ESCALTION_MATIX',
    EDIT_COMPANY_ESCALTION_MATIX = 'EDIT_COMPANY_ESCALTION_MATIX',
    DELETE_COMPANY_ESCALTION_MATIX = 'DELETE_COMPANY_ESCALTION_MATIX',
    AUDIT_SCHEDULE = 'AUDIT_SCHEDULE',
    VIEW_AUDIT_SCHEDULE_DETAILS = 'VIEW_AUDIT_SCHEDULE_DETAILS',
    DELETE_AUDIT_SCHEDULE_DETAILS = 'DELETE_AUDIT_SCHEDULE_DETAILS',
    VIEW_AUDIT_SCHEDULE_BLOCK_UNBLOCK = 'VIEW_AUDIT_SCHEDULE_BLOCK_UNBLOCK',
    AUDIT_SCHEDULE_UNBLOCK_BLOCKED = 'AUDIT_SCHEDULE_UNBLOCK_BLOCKED',
    COMPLIANCE_SCHEDULE = 'COMPLIANCE_SCHEDULE',
    VIEW_COMPLIANCE_SCHEDULE_DETAILS = 'VIEW_COMPLIANCE_SCHEDULE_DETAILS',
    ASSIGN_COMPLIANCE_SCHEDULE_DETAILS = 'ASSIGN_COMPLIANCE_SCHEDULE_DETAILS',
    DELETE_COMPLIANCE_SCHEDULE_DETAILS = 'DELETE_COMPLIANCE_SCHEDULE_DETAILS',
    VIEW_EMAIL_TEMPLATES = 'VIEW_EMAIL_TEMPLATES',
    ADD_EMAIL_TEMPLATE = 'ADD_EMAIL_TEMPLATE',
    EDIT_EMAIL_TEMPLATE = 'EDIT_EMAIL_TEMPLATE',
    DELETE_EMAIL_TEMPLATE = 'DELETE_EMAIL_TEMPLATE',
    VIEW_NOTIFICATION_TEMPLATES = 'VIEW_NOTIFICATION_TEMPLATES',
    ADD_NOTIFICATION_TEMPLATE = 'ADD_NOTIFICATION_TEMPLATE',
    EDIT_NOTIFICATION_TEMPLATE = 'EDIT_NOTIFICATION_TEMPLATE',
    DELETE_NOTIFICATION_TEMPLATE = 'DELETE_NOTIFICATION_TEMPLATE',
    VIEW_NOTIFICATIONS = 'VIEW_NOTIFICATIONS',
    RESEND_NOTIFICATION = 'RESEND_NOTIFICATION',
    SUBMITTER_DASHBOARD = 'SUBMITTER_DASHBOARD',
    REVIEWER_DASHBOARD = 'REVIEWER_DASHBOARD',
    OWNER_DASHBOARD = 'OWNER_DASHBOARD',
    MANAGER_DASHBOARD = 'MANAGER_DASHBOARD',
    ESCALATION_DASHBOARD = 'ESCALATION_DASHBOARD',
    REVIEWER_ACTIVITIES = 'REVIEWER_ACTIVITIES',
    REVIEWER_ACTIVITIES_AUDIT = 'REVIEWER_ACTIVITIES_AUDIT',
    REVIEWER_ACTIVITIES_PUBLISH = 'REVIEWER_ACTIVITIES_PUBLISH',
    REVIEWER_ACTIVITIES_DOWNLOAD_REPORT = 'REVIEWER_ACTIVITIES_DOWNLOAD_REPORT',
    // OWNER_ACTIVITIES = 'OWNER_ACTIVITIES',
    OWNER_ACTIVITIES_SUBMIT = 'OWNER_ACTIVITIES_SUBMIT',
    OWNER_ACTIVITIES_DOCUMENT_UPLOAD = 'OWNER_ACTIVITIES_DOCUMENT_UPLOAD',
    // MANAGER_ACTIVITIES = 'MANAGER_ACTIVITIES',
    MANAGER_ACTIVITIES_REVIEW = 'MANAGER_ACTIVITIES_REVIEW',
    SUBMITTER_ACTIVITIES = 'SUBMITTER_ACTIVITIES',
    SUBMITTER_ACTIVITIES_SUBMIT = 'SUBMITTER_ACTIVITIES_SUBMIT',
    SUBMITTER_ACTIVITIES_UPLOAD = 'SUBMITTER_ACTIVITIES_UPLOAD',
    SUBMITTER_ACTIVITIES_DOWNLOAD_REPORT = 'SUBMITTER_ACTIVITIES_DOWNLOAD_REPORT',
    VIEW_USER_NOTIFICATIONS = 'VIEW_USER_NOTIFICATIONS',
    VIEW_NOTICES = 'VIEW_NOTICES',
    ADD_NOTICE = 'ADD_NOTICE',
    ASSIGN_NOTICE = 'ASSIGN_NOTICE',
    EDIT_NOTICE = 'EDIT_NOTICE',
    DELETE_NOTICE = 'DELETE_NOTICE',
    INPUT_DASHBOARD = 'INPUT_DASHBOARD',
    VIEW_HOLIDAY_LIST = 'VIEW_HOLIDAY_LIST',
    ADD_HOLIDAY_LIST = 'ADD_HOLIDAY_LIST',
    EDIT_HOLIDAY_LIST = 'EDIT_HOLIDAY_LIST',
    DELETE_HOLIDAY_LIST = 'DELETE_HOLIDAY_LIST',
    VIEW_LEAVE_CONFIGURATION = 'VIEW_LEAVE_CONFIGURATION',
    ADD_LEAVE_CONFIGURATION = 'ADD_LEAVE_CONFIGURATION',
    EDIT_LEAVE_CONFIGURATION = 'EDIT_LEAVE_CONFIGURATION',
    DELETE_LEAVE_CONFIGURATION = 'DELETE_LEAVE_CONFIGURATION',
    VIEW_ATTENDANCE_CONFIGURATION = 'VIEW_ATTENDANCE_CONFIGURATION',
    ADD_ATTENDANCE_CONFIGURATION = 'ADD_ATTENDANCE_CONFIGURATION',
    EDIT_ATTENDANCE_CONFIGURATION = 'EDIT_ATTENDANCE_CONFIGURATION',
    DELETE_ATTENDANCE_CONFIGURATION = 'DELETE_ATTENDANCE_CONFIGURATION',
    VIEW_SALARY_COMPONENTS = 'VIEW_SALARY_COMPONENTS',
    ADD_SALARY_COMPONENTS = 'ADD_SALARY_COMPONENTS',
    VIEW_INPUT_MODULE_UPLOAD = 'VIEW_INPUT_MODULE_UPLOAD',
    ADD_INPUT_MODULE_UPLOAD = 'ADD_INPUT_MODULE_UPLOAD',
    VIEW_EMPLOYEE_DASHBOARD = 'VIEW_EMPLOYEE_DASHBOARD',
    REGISTER_EMPLOYEE_DASHBOARD = 'REGISTER_EMPLOYEE_DASHBOARD',
    VIEW_EMPLOYEE_MASTER = 'VIEW_EMPLOYEE_MASTER',
    DELETE_EMPLOYEE_MASTER = 'DELETE_EMPLOYEE_MASTER',
    VIEW_EMPLOYEE_LEAVE_CREDIT = 'VIEW_EMPLOYEE_LEAVE_CREDIT',
    DELETE_EMPLOYEE_LEAVE_CREDIT = 'DELETE_EMPLOYEE_LEAVE_CREDIT',
    VIEW_EMPLOYEE_LEAVE_AVAILED = 'VIEW_EMPLOYEE_LEAVE_AVAILED',
    DELETE_EMPLOYEE_LEAVE_AVAILED = 'DELETE_EMPLOYEE_LEAVE_AVAILED',
    VIEW_EMPLOYEE_ATTENDANCE = 'VIEW_EMPLOYEE_ATTENDANCE',
    DELETE_EMPLOYEE_ATTENDANCE = 'DELETE_EMPLOYEE_ATTENDANCE',
    VIEW_EMPLOYEE_WAGE = 'VIEW_EMPLOYEE_WAGE',
    DELETE_EMPLOYEE_WAGE = 'DELETE_EMPLOYEE_WAGE',
    VIEW_REGISTER_DOWNLOAD = 'VIEW_REGISTER_DOWNLOAD'
}

export const PAGES_CONFIGURATION = [
    {
        id: "SETUP_INPUT",
        name: "Setup input",
        isMulti: true,
        privileges: [
            {
                id: USER_PRIVILEGES.VIEW_HOLIDAY_LIST,
                name: 'View Holiday List'
            },
            {
                id: USER_PRIVILEGES.ADD_HOLIDAY_LIST,
                name: 'Add Holiday List'
            },
            {
                id: USER_PRIVILEGES.EDIT_HOLIDAY_LIST,
                name: 'Edit Holiday List'
            },
            {
                id: USER_PRIVILEGES.DELETE_HOLIDAY_LIST,
                name: 'Delete Holiday List'
            },
                {
                    id: USER_PRIVILEGES.VIEW_LEAVE_CONFIGURATION,
                    name: 'View Leave Configuration'
                },
                {
                    id: USER_PRIVILEGES.ADD_LEAVE_CONFIGURATION,
                    name: 'Add Leave Configuration'
                },
                {
                    id: USER_PRIVILEGES.EDIT_LEAVE_CONFIGURATION,
                    name: 'Edit Leave Configuration'
                },
                {
                    id: USER_PRIVILEGES.DELETE_LEAVE_CONFIGURATION,
                    name: 'Delete Leave Configuration'
                },
                {
                    id: USER_PRIVILEGES.VIEW_ATTENDANCE_CONFIGURATION,
                    name: 'View Attendance Configuration'
                },
                {
                    id: USER_PRIVILEGES.ADD_ATTENDANCE_CONFIGURATION,
                    name: 'Add Attendance Configuration'
                },
                {
                    id: USER_PRIVILEGES.EDIT_ATTENDANCE_CONFIGURATION,
                    name: 'Edit Attendance Configuration'
                },
                {
                    id: USER_PRIVILEGES.DELETE_ATTENDANCE_CONFIGURATION,
                    name: 'Delete Attendance Configuration'
                },
                {
                    id: USER_PRIVILEGES.VIEW_SALARY_COMPONENTS,
                    name: 'View Salary Components'
                },
                {
                    id: USER_PRIVILEGES.ADD_SALARY_COMPONENTS,
                    name: 'Add Salary Components'
                },
                {
                    id: USER_PRIVILEGES.VIEW_INPUT_MODULE_UPLOAD,
                    name: 'View Input Module Upload'
                },
                {
                    id: USER_PRIVILEGES.ADD_INPUT_MODULE_UPLOAD,
                    name: 'Add Input Module Upload'
                }
        ]
    },
    {
        id: "INPUT_UPLOAD",
        name: "Input upload",
        isMulti: true,
        privileges: [
        
            {
                id: USER_PRIVILEGES.VIEW_EMPLOYEE_DASHBOARD,
                name: 'View Employee Dashboard'
            },
            {
                id: USER_PRIVILEGES.REGISTER_EMPLOYEE_DASHBOARD,
                name: 'Register Employee Master'
            },
            {
                id: USER_PRIVILEGES.VIEW_EMPLOYEE_MASTER,
                name: 'View Employee Master'
            },
            {
                id: USER_PRIVILEGES.DELETE_EMPLOYEE_MASTER,
                name: 'Delete Employee Master'
            },
            {
                id: USER_PRIVILEGES.VIEW_EMPLOYEE_LEAVE_CREDIT,
                name: 'View Employee Leave Credit'
            },
            {
                id: USER_PRIVILEGES.DELETE_EMPLOYEE_LEAVE_CREDIT,
                name: 'Delete Employee Leave Credit'
            },
            {
                id: USER_PRIVILEGES.VIEW_EMPLOYEE_LEAVE_AVAILED,
                name: 'View Employee Leave Availed'
            },
            {
                id: USER_PRIVILEGES.DELETE_EMPLOYEE_LEAVE_AVAILED,
                name: 'Delete Employee Leave Availed'
            },
            {
                id: USER_PRIVILEGES.VIEW_EMPLOYEE_ATTENDANCE,
                name: 'View Employee Attendance'
            },
            {
                id: USER_PRIVILEGES.DELETE_EMPLOYEE_ATTENDANCE,
                name: 'Delete Employee Attendance'
            },
            {
                id: USER_PRIVILEGES.VIEW_EMPLOYEE_WAGE,
                name: 'View Employee WAGE'
            },
            {
                id: USER_PRIVILEGES.DELETE_EMPLOYEE_WAGE,
                name: 'Delete Employee WAGE'
            },
            {
                id: USER_PRIVILEGES.VIEW_REGISTER_DOWNLOAD,
                name: 'View Register Download'
            },
    ]
    },
    {
        id: 'MASTER',
        name: 'Masters',
        isMulti: true,
        privileges: [
            {
                id: USER_PRIVILEGES.VIEW_LAW_CATEGORY,
                name: 'View Law Categories'
            },
            {
                id: USER_PRIVILEGES.ADD_LAW_CATEGORY,   
                name: 'Add Law Category'
            },
            {
                id: 'EDIT_LAW_CATEGORY',
                name: 'Edit Law Category'
            },
            {
                id: USER_PRIVILEGES.DELETE_LAW_CATEGORY,
                name: 'Delete Law Category'
            },
            {
                id: USER_PRIVILEGES.EXPORT_LAW_CATEGORIES,
                name: 'Export Law Category'
            },
            {
                id: USER_PRIVILEGES.VIEW_ACTS,
                name: 'View Acts'
            },
            {
                id: USER_PRIVILEGES.ADD_ACT,
                name: 'Add Act'
            },
            {
                id: USER_PRIVILEGES.EDIT_ACT,
                name: 'Edit Act'
            },
            {
                id: USER_PRIVILEGES.DELETE_ACT,
                name: 'Delete Act'
            },
            {
                id: USER_PRIVILEGES.EXPORT_ACTS,
                name: 'Export Acts'
            },
            {
                id: USER_PRIVILEGES.VIEW_ACTIVITIES,
                name: 'View Activities'
            },
            {
                id: USER_PRIVILEGES.ADD_ACTIVITY,
                name: 'Add Activity'
            },
            {
                id: USER_PRIVILEGES.EDIT_ACTIVITY,
                name: 'Edit Activity'
            },
            {
                id: USER_PRIVILEGES.DELETE_ACTIVITY,
                name: 'Delete Activity'
            },
            {
                id: USER_PRIVILEGES.EXPORT_ACTIVITIES,
                name: 'Export Activities'
            },
            {
                id: USER_PRIVILEGES.VIEW_RULES,
                name: 'View Rules'
            },
            {
                id: USER_PRIVILEGES.ADD_RULE,
                name: 'Add Rule'
            },
            {
                id: USER_PRIVILEGES.EDIT_RULE,
                name: 'Edit Rule'
            },
            {
                id: USER_PRIVILEGES.DELETE_RULE,
                name: 'Delete Rule'
            },
            {
                id: USER_PRIVILEGES.EXPORT_RULES,
                name: 'Export Rules'
            },
            {
                id: USER_PRIVILEGES.VIEW_STATES,
                name: 'View States'
            },
            {
                id: USER_PRIVILEGES.ADD_STATE,
                name: 'Add State'
            },
            {
                id: USER_PRIVILEGES.EDIT_STATE,
                name: 'Edit State'
            },
            {
                id: USER_PRIVILEGES.DELETE_STATE,
                name: 'Delete State'
            },
            {
                id: USER_PRIVILEGES.EXPORT_STATES,
                name: 'Export States'
            },
            {
                id: USER_PRIVILEGES.VIEW_CITIES,
                name: 'View Cities'
            },
            {
                id: USER_PRIVILEGES.ADD_CITY,
                name: 'Add City'
            },
            {
                id: USER_PRIVILEGES.EDIT_CITY,
                name: 'Edit City'
            },
            {
                id: USER_PRIVILEGES.DELETE_CITY,
                name: 'Delete City'
            },
            {
                id: USER_PRIVILEGES.EXPORT_CITIES,
                name: 'Export Cities'
            },
            {
                id: USER_PRIVILEGES.VIEW_MAPPINGS,
                name: 'View Mappings'
            },
            {
                id: USER_PRIVILEGES.ADD_MAPPING,
                name: 'Add Mapping'
            },
            {
                id: USER_PRIVILEGES.EDIT_MAPPING,
                name: 'Edit Mapping'
            },
            {
                id: USER_PRIVILEGES.DELETE_MAPPING,
                name: 'Delete Mapping'
            },
            {
                id: USER_PRIVILEGES.EXPORT_MAPPING,
                name: 'Export Mappings'
            }
        ]
    },
    {
        id: 'COMPANIES',
        name: 'Companies',
        isMulti: true,
        privileges: [
            {
                id: USER_PRIVILEGES.VIEW_COMPANIES,
                name: 'View Companies'
            },
            {
                id: USER_PRIVILEGES.ADD_COMPANY,
                name: 'Add Company'
            },
            {
                id: USER_PRIVILEGES.EDIT_COMPANY,
                name: 'Edit Company'
            },
            {
                id: USER_PRIVILEGES.DELETE_COMPANY,
                name: 'Delete Company'
            },
            {
                id: USER_PRIVILEGES.EXPORT_COMPANIES,
                name: 'Export Companies'
            },
            {
                id: USER_PRIVILEGES.VIEW_ASSOCIATE_COMPANIES,
                name: 'View Associate Companies'
            },
            {
                id: USER_PRIVILEGES.ADD_ASSOCIATE_COMPANY,
                name: 'Add Associate Company'
            },
            {
                id: USER_PRIVILEGES.EDIT_ASSOCIATE_COMPANY,
                name: 'Edit Associate Company'
            },
            {
                id: USER_PRIVILEGES.DELETE_ASSOCIATE_COMPANY,
                name: 'Delete Associate Company'
            },
            {
                id: USER_PRIVILEGES.EXPORT_ASSOCIATE_COMPANIES,
                name: 'Export Associate Companies'
            },
            {
                id: USER_PRIVILEGES.VIEW_LOCATION_MAPPINGS,
                name: 'View Location Mappings'
            },
            {
                id: USER_PRIVILEGES.ADD_LOCATION_MAPPING,
                name: 'Add Location Mapping'
            },
            {
                id: USER_PRIVILEGES.EDIT_LOCATION_MAPPING,
                name: 'Edit Location Mapping'
            },
            {
                id: USER_PRIVILEGES.DELETE_LOCATION_MAPPING,
                name: 'Delete Location Mapping'
            },
            {
                id: USER_PRIVILEGES.EXPORT_LOCATION_MAPPINGS,
                name: 'Export Location Mappings'
            },
            {
                id: USER_PRIVILEGES.VIEW_VERTICALS,
                name: 'View Verticals'
            },
            {
                id: USER_PRIVILEGES.ADD_VERTICAL,
                name: 'Add Vertical'
            },
            {
                id: USER_PRIVILEGES.EDIT_VERTICAL,
                name: 'Edit Vertical'
            },
            {
                id: USER_PRIVILEGES.DELETE_VERTICAL,
                name: 'Delete Vertical'
            },
            {
                id: USER_PRIVILEGES.EXPORT_VERTICALS,
                name: 'Export Verticals'
            },
            {
                id: USER_PRIVILEGES.VIEW_DEPARTMENTS,
                name: 'View Departments'
            },
            {
                id: USER_PRIVILEGES.ADD_DEPARTMENT,
                name: 'Add Department'
            },
            {
                id: USER_PRIVILEGES.EDIT_DEPARTMENT,
                name: 'Edit Department'
            },
            {
                id: USER_PRIVILEGES.DELETE_DEPARTMENT,
                name: 'Delete Department'
            },
            {
                id: USER_PRIVILEGES.EXPORT_DEPARTMENTS,
                name: 'Export Departments'
            },
            {
                id: USER_PRIVILEGES.VIEW_COMPANY_ESCALTION_MATIX,
                name: 'View Escalation Matrix'
            },
            {
                id: USER_PRIVILEGES.ADD_COMPANY_ESCALTION_MATIX,
                name: 'Add Escalation Matrix'
            },
            {
                id: USER_PRIVILEGES.EDIT_COMPANY_ESCALTION_MATIX,
                name: 'Edit Escalation Matrix'
            },
            {
                id: USER_PRIVILEGES.DELETE_COMPANY_ESCALTION_MATIX,
                name: 'Delete Escalation Matrix'
            }
        ]
    },
    {
        id: 'AUDIT_MANAGEMENT',
        name: 'Audit Management',
        isMulti: true,
        privileges: [
            {
                id: USER_PRIVILEGES.AUDIT_SCHEDULE,
                name: 'Audit Schedule'
            },
            {
                id: USER_PRIVILEGES.VIEW_AUDIT_SCHEDULE_DETAILS,
                name: 'View Audit Schedule Details'
            },
            {
                id: USER_PRIVILEGES.DELETE_AUDIT_SCHEDULE_DETAILS,
                name: 'Delete Audit Schedule Details'
            },
            {
                id: USER_PRIVILEGES.VIEW_AUDIT_SCHEDULE_BLOCK_UNBLOCK,
                name: 'View Un-Block Activities'
            },
            {
                id: USER_PRIVILEGES.AUDIT_SCHEDULE_UNBLOCK_BLOCKED,
                name: 'Un-Block Blocked'
            }
        ]
    },
    {
        id: 'COMPLIANCE_MANAGEMENT',
        name: 'Compliance Management',
        isMulti: true,
        privileges: [
            {
                id: USER_PRIVILEGES.COMPLIANCE_SCHEDULE,
                name: 'Compliance Schedule'
            },
            {
                id: USER_PRIVILEGES.VIEW_COMPLIANCE_SCHEDULE_DETAILS,
                name: 'View Compliance Schedule Details'
            },
            {
                id: USER_PRIVILEGES.ASSIGN_COMPLIANCE_SCHEDULE_DETAILS,
                name: 'Assign Compliance Schedule Details'
            },
            {
                id: USER_PRIVILEGES.DELETE_COMPLIANCE_SCHEDULE_DETAILS,
                name: 'Delete Compliance Schedule Details'
            }
        ]
    },
    {
        id: 'USER_MANAGEMENT',
        name: 'User Management',
        isMulti: true,
        privileges: [
            {
                id: USER_PRIVILEGES.VIEW_ROLES,
                name: 'View Roles'
            },
            {
                id: USER_PRIVILEGES.ADD_ROLE,
                name: 'Add Role'
            },
            {
                id: USER_PRIVILEGES.EDIT_ROLE,
                name: 'Edit Role'
            },
            {
                id: USER_PRIVILEGES.DELETE_ROLE,
                name: 'Delete Role'
            },
            {
                id: USER_PRIVILEGES.VIEW_USERS,
                name: 'View Users'
            },
            {
                id: USER_PRIVILEGES.ADD_USER,
                name: 'Add User'
            },
            {
                id: USER_PRIVILEGES.EDIT_USER,
                name: 'Edit User'
            },
            {
                id: USER_PRIVILEGES.DELETE_USER,
                name: 'Delete User'
            },
            {
                id: USER_PRIVILEGES.EXPORT_USERS,
                name: 'Export Users'
            },
            {
                id: USER_PRIVILEGES.VIEW_COMPANY_MAPPINGS,
                name: 'View Company Mapping'
            },
            {
                id: USER_PRIVILEGES.UPDATE_COMPANY_MAPPINGS,
                name: 'Update Company Mapping'
            },
            {
                id: USER_PRIVILEGES.VIEW_DEPARTMENT_USER_MAPPING,
                name: 'View Department User Mapping'
            },
            {
                id: USER_PRIVILEGES.ADD_DEPARTMENT_USER_MAPPING,
                name: 'Add Department User Mapping'
            },
            {
                id: USER_PRIVILEGES.UPDATE_DEPARTMENT_USER_MAPPING,
                name: 'Update Department User Mapping'
            },
            {
                id: USER_PRIVILEGES.DELETE_DEPARTMENT_USER_MAPPING,
                name: 'Delete Department User Mapping'
            }
        ]
    },
    {
        id: 'EMAIL_NOTIFICATION',
        name: 'Emails & Notifications',
        isMulti: true,
        privileges: [
            {
                id: USER_PRIVILEGES.VIEW_EMAIL_TEMPLATES,
                name: 'View Email Templates'
            },
            {
                id: USER_PRIVILEGES.ADD_EMAIL_TEMPLATE,
                name: 'Add Email Template'
            },
            {
                id: USER_PRIVILEGES.EDIT_EMAIL_TEMPLATE,
                name: 'Edit Email Template'
            },
            {
                id: USER_PRIVILEGES.DELETE_EMAIL_TEMPLATE,
                name: 'Delete Email Template'
            },
            {
                id: USER_PRIVILEGES.VIEW_NOTIFICATIONS,
                name: 'View Notifications'
            },
            {
                id: USER_PRIVILEGES.RESEND_NOTIFICATION,
                name: 'Resend Notification'
            },
            {
                id: USER_PRIVILEGES.VIEW_NOTIFICATION_TEMPLATES,
                name: 'View Notification Templates'
            },
            {
                id: USER_PRIVILEGES.ADD_NOTIFICATION_TEMPLATE,
                name: 'Add Notification Template'
            },
            {
                id: USER_PRIVILEGES.EDIT_NOTIFICATION_TEMPLATE,
                name: 'Edit Notification Template'
            },
            {
                id: USER_PRIVILEGES.DELETE_NOTIFICATION_TEMPLATE,
                name: 'Delete Notification Template'
            }
        ]
    },
    {
        id: 'DASHBOARD',
        name: 'Dashboard',
        isMulti: false,
        privileges: [
            {
                id: USER_PRIVILEGES.OWNER_DASHBOARD,
                name: 'Owner',
                actions: [
                    {
                        id: USER_PRIVILEGES.OWNER_ACTIVITIES_SUBMIT,
                        name: 'Submit for Approval'
                    },
                    {
                        id: USER_PRIVILEGES.OWNER_ACTIVITIES_DOCUMENT_UPLOAD,
                        name: 'Upload Documents'
                    }
                ]
            },
            {
                id: USER_PRIVILEGES.MANAGER_DASHBOARD,
                name: 'Manager',
                actions: [
                    {
                        id: USER_PRIVILEGES.MANAGER_ACTIVITIES_REVIEW,
                        name: 'Submit for Approval'
                    }
                ]
            },
            {
                id: USER_PRIVILEGES.ESCALATION_DASHBOARD,
                name: 'Escalation'
            },
            {
                id: USER_PRIVILEGES.SUBMITTER_DASHBOARD,
                name: 'Submitter',
            },
            {
                id: USER_PRIVILEGES.REVIEWER_DASHBOARD,
                name: 'Reviewer',
            }
        ]
    },
    {
        id: 'ACTIVITIES',
        name: 'Activities',
        isMulti: false,
        privileges: [
            {
                id: USER_PRIVILEGES.SUBMITTER_ACTIVITIES,
                name: 'Submitter',
                actions: [
                    {
                        id: USER_PRIVILEGES.SUBMITTER_ACTIVITIES_SUBMIT,
                        name: 'Submit for Approval'
                    },
                    {
                        id: USER_PRIVILEGES.SUBMITTER_ACTIVITIES_UPLOAD,
                        name: 'Upload Documents'
                    },
                    {
                        id: USER_PRIVILEGES.SUBMITTER_ACTIVITIES_DOWNLOAD_REPORT,
                        name: 'Download Report'
                    }
                ]
            },
            {
                id: USER_PRIVILEGES.REVIEWER_ACTIVITIES,
                name: 'Reviewer',
                actions: [
                    {
                        id: USER_PRIVILEGES.REVIEWER_ACTIVITIES_AUDIT,
                        name: 'Approve/Reject'
                    },
                    {
                        id: USER_PRIVILEGES.REVIEWER_ACTIVITIES_PUBLISH,
                        name: 'Publish Activities'
                    },
                    {
                        id: USER_PRIVILEGES.REVIEWER_ACTIVITIES_DOWNLOAD_REPORT,
                        name: 'Download Report'
                    }
                ]
            }
        ]
    },
    {
        id: 'USER_NOTIFICATION',
        name: 'Notifications',
        privileges: [
            {
                id: USER_PRIVILEGES.VIEW_USER_NOTIFICATIONS,
                name: 'View Notices',
            }
        ]
    },
    {
        id: 'NOTICES',
        name: 'Notices',
        isMulti: true,
        privileges: [
            {
                id: USER_PRIVILEGES.VIEW_NOTICES,
                name: 'View Notices',
            },
            {
                id: USER_PRIVILEGES.ADD_NOTICE,
                name: 'Add Notices',
            },
            {
                id: USER_PRIVILEGES.EDIT_NOTICE,
                name: 'Edit Notices',
            },
            {
                id: USER_PRIVILEGES.DELETE_NOTICE,
                name: 'Delete Notices',
            },
            {
                id: USER_PRIVILEGES.ASSIGN_NOTICE,
                name: 'Assign Notices',
            }
        ]
    }
];
