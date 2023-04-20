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
    SUBMITTED_DATE: 'submittedDate'
}

export const SEARCH_FIELDS = [
    { value: FILTERS.MONTH, label: 'Month & Year' },
    { value: FILTERS.DUE_DATE, label: 'Due Date' },
    { value: FILTERS.SUBMITTED_DATE, label: 'Submitted Date' }
]