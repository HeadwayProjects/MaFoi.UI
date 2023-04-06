export const ACTIVITY_STATUS = {
    PENDING: 'Pending',
    ACTIVITY_SAVED: 'ActivitySaved',
    OVERDUE: 'Overdue',
    REJECTED: 'Rejected',
    AUDITED: 'Approved',
    SUBMITTED: 'Submitted',
    APPROVE: 'Approved',
    REJECT: 'Rejected'
}

export const AUDIT_STATUS = {
    COMPLIANT: 'Compliant',
    NON_COMPLIANCE: 'Non-Compliance',
    NOT_APPLICABLE: 'Not Applicable'
}

export const ALLOWED_FILES_REGEX = /(\.xlsx|\.xls|\.csv|\.pdf|\.jpg|\.jpeg|\.png|\.doc|\.docs)$/i;

export const STATUS_MAPPING = {
    [ACTIVITY_STATUS.PENDING]: 'Pending',
    [ACTIVITY_STATUS.ACTIVITY_SAVED]: 'Activity Saved',
    [ACTIVITY_STATUS.OVERDUE]: 'Overdue',
    [ACTIVITY_STATUS.REJECTED]: 'Rejected',
    [ACTIVITY_STATUS.AUDITED]: 'Audited',
    [ACTIVITY_STATUS.SUBMITTED]: 'Submitted',
    [AUDIT_STATUS.COMPLIANT]: 'Compliant',
    [AUDIT_STATUS.NON_COMPLIANCE]: 'Non-Compliance',
    [ACTIVITY_STATUS.NOT_APPLICABLE]: 'Not Applicable'
}