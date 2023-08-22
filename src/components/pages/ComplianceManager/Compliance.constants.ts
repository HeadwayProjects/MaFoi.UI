export enum ComplianceActivityStatus {
    PENDING = 'Pending',
    ACTIVITY_SAVED = 'ActivitySaved',
    OVERDUE = 'Overdue',
    REJECTED = 'Rejected',
    AUDITED = 'Approved',
    SUBMITTED = 'Submitted',
    APPROVE = 'Approved',
    REJECT = 'Rejected',
    PUBLISHED = 'Published'
}


export const COMPLIANCE_ACTIVITY_ORDER = [
    ComplianceActivityStatus.REJECTED,
    ComplianceActivityStatus.OVERDUE,
    ComplianceActivityStatus.PENDING,
    ComplianceActivityStatus.SUBMITTED,
    ComplianceActivityStatus.AUDITED
]

export const COMPLIANCE_ACTIVITY_INDICATION: any = {
    [ComplianceActivityStatus.REJECTED]: 'var(--red)',
    [ComplianceActivityStatus.OVERDUE]: 'var(--red)',
    [ComplianceActivityStatus.PENDING]: 'var(--yellow)',
    [ComplianceActivityStatus.SUBMITTED]: 'var(--light-green)',
    [ComplianceActivityStatus.AUDITED]: 'var(--dark-green)',
}

