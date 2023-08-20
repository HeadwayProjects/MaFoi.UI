export const PATTERNS = {
    EMAIL: /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    PASSWORD: /^(?=.*[\d])[\w!@#$%^&*]{9,16}$/,
    NOSPACE: /^\S.+\S$/,
    PAN: /[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/,
    TAN: /[A-Za-z]{4}[0-9]{5}[A-Za-z]{1}$/,
    GSTN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    MOBILE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
};

export const FILE_SIZE = {
    KB: 1024,
    MB: 1048576
}

export const ACTIONS = {
    NONE: '0',
    ADD: '1',
    EDIT: '2',
    DELETE: '3',
    VIEW: '4',
    BULK_DELETE: '5',
    BULK_EDIT: '6',
    IMPORT: '7',
    ASSIGN_SINGLE: '8',
    ASSIGN_BULK: '9',
    COPY_TO: '10'
}

export const ACTIVITY_STATUS = {
    PENDING: 'Pending',
    ACTIVITY_SAVED: 'ActivitySaved',
    OVERDUE: 'Overdue',
    REJECTED: 'Rejected',
    AUDITED: 'Approved',
    SUBMITTED: 'Submitted',
    APPROVE: 'Approved',
    REJECT: 'Rejected',
    PUBLISHED: 'Published'
}

export const AUDIT_STATUS = {
    COMPLIANT: 'Compliant',
    NON_COMPLIANCE: 'Non-Compliance',
    NOT_APPLICABLE: 'Not-Applicable'
}

export const ALLOWED_FILES_REGEX = /(\.xlsx|\.xls|\.csv|\.pdf|\.jpg|\.jpeg|\.png|\.doc|\.docx)$/i;
export const ALLOWED_LOGO_REGEX = /(\.jpg|\.jpeg|\.png)$/i;
export const EXCEL_FILE_REGEX = /(\.xlsx)$/i;

export const STATUS_MAPPING = {
    [ACTIVITY_STATUS.PENDING]: 'Pending',
    [ACTIVITY_STATUS.ACTIVITY_SAVED]: 'Activity Saved',
    [ACTIVITY_STATUS.OVERDUE]: 'Overdue',
    [ACTIVITY_STATUS.REJECTED]: 'Rejected',
    [ACTIVITY_STATUS.AUDITED]: 'Audited',
    [ACTIVITY_STATUS.SUBMITTED]: 'Submitted',
    [ACTIVITY_STATUS.PUBLISHED]: 'Published',
    [AUDIT_STATUS.COMPLIANT]: 'Compliant',
    [AUDIT_STATUS.NON_COMPLIANCE]: 'Non-Compliance',
    [AUDIT_STATUS.NOT_APPLICABLE]: 'Not Applicable'
}

export const TOOLTIP_DELAY = 500; // Milliseconds

export const MONTHS_ENUM = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
]

export const MONTHS = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' }
]

export const STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive'
}

export const USER_STATUS = [STATUS.ACTIVE, STATUS.INACTIVE];

export const YEARS = (() => {
    const year = new Date().getFullYear();
    let years = [year + 1];
    for (let i = 0; i < 5; i++) {
        years.push(year - i);
    }
    return years.map(year => {
        return { value: `${year}`, label: year }
    });
})();

export const FILTERS = {
    MONTH: 'month',
    DUE_DATE: 'dueDate',
    SUBMITTED_DATE: 'submittedDate',
    ACTIVITY_TYPE: 'activityType',
    AUDIT_TYPE: 'auditType'
}

export const SEARCH_FIELDS = [
    { value: FILTERS.MONTH, label: 'Month & Year' },
    { value: FILTERS.DUE_DATE, label: 'Due Date' },
    { value: FILTERS.SUBMITTED_DATE, label: 'Submitted Date' }
]

export const SMTP_PORTS = ['25', '465', '587'];