import { getUserDetails, hasUserAccess } from "../../../backend/auth";
import { USER_PRIVILEGES } from "../UserManagement/Roles/RoleConfiguration";

export enum ComplianceActivityStatus {
    PENDING = 'Pending',
    ACTIVITY_SAVED = 'ActivitySaved',
    OVERDUE = 'Overdue',
    DUE = 'Due',
    REJECTED = 'Rejected',
    AUDITED = 'Approved',
    SUBMITTED = 'Submitted',
    APPROVE = 'Approved',
    REJECT = 'Rejected',
    PUBLISHED = 'Published',
    LATE_CLOSURE = 'Late',
    ON_TIME = 'OnTime',
    NON_COMPLIANT = 'NonCompliant'
}

export const ComplianceStatusMapping = {
    [ComplianceActivityStatus.PENDING]: 'Pending',
    [ComplianceActivityStatus.OVERDUE]: 'Due',
    [ComplianceActivityStatus.DUE]: 'Due',
    [ComplianceActivityStatus.LATE_CLOSURE]: 'Late Closure',
    [ComplianceActivityStatus.ON_TIME]: 'On time',
    [ComplianceActivityStatus.SUBMITTED]: 'Sumitted',
    [ComplianceActivityStatus.AUDITED]: 'Approved',
    [ComplianceActivityStatus.REJECTED]: 'Rejected'
}

export const ComplianceStatusIconMapping: any = {
    [ComplianceActivityStatus.DUE]: 'clock',
    [ComplianceActivityStatus.PENDING]: 'clock',
    [ComplianceActivityStatus.NON_COMPLIANT]: 'exclamation-circle',
    [ComplianceActivityStatus.SUBMITTED]: 'check-square',
    [ComplianceActivityStatus.AUDITED]: 'check-circle',
    [ComplianceActivityStatus.REJECTED]: 'times-circle',
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
    [ComplianceActivityStatus.OVERDUE]: 'var(--light-red)',
    [ComplianceActivityStatus.PENDING]: 'var(--yellow)',
    [ComplianceActivityStatus.SUBMITTED]: 'var(--light-green)',
    [ComplianceActivityStatus.AUDITED]: 'var(--dark-green)',
}

export enum ComplianceChartStatus {
    DUE = 'due',
    LATE = 'late',
    NON_COMPLIANT = 'nonCompliant',
    ON_TIME = 'onTime',
    PENDING = 'pending'
}

export const ComplianceChartStatusMapping: any = {
    [ComplianceChartStatus.DUE]: {
        value: ComplianceChartStatus.DUE,
        label: ComplianceStatusMapping[ComplianceActivityStatus.DUE],
        color: 'rgba(220, 53, 69, 0.5)'
    },
    [ComplianceChartStatus.LATE]: {
        value: ComplianceChartStatus.LATE,
        label: ComplianceStatusMapping[ComplianceActivityStatus.DUE],
        color: '#FFC000'
    },
    [ComplianceChartStatus.NON_COMPLIANT]: {
        value: ComplianceChartStatus.NON_COMPLIANT,
        label: 'Non-Compliance',
        color: '#FF0000'
    },
    [ComplianceChartStatus.ON_TIME]: {
        value: ComplianceChartStatus.ON_TIME,
        label: ComplianceStatusMapping[ComplianceActivityStatus.ON_TIME],
        color: '#548235'
    },
    [ComplianceChartStatus.PENDING]: {
        value: ComplianceChartStatus.PENDING,
        label: ComplianceStatusMapping[ComplianceActivityStatus.PENDING],
        color: '#FFC000'
    }
}

export enum DashboardView {
    CALENDAR = 'calendar',
    CHART = 'chart'
}

export function setUserDetailsInFilters(filters: any[], type = false) {
    filters = filters || [];
    let key = '';
    let userType = '';
    if (hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD)) {
        key = 'complianceOwnerId';
        userType = 'owner';
    } else if (hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD)) {
        key = 'complianceManagerId';
        userType = 'manager'
    }
    if (key) {
        const index = filters.findIndex(({ columnName }: any) => columnName === key);
        if (index === -1) {
            filters.push({ columnName: key, value: getUserDetails().userid })
        }
    }
    if (type && userType) {
        const index = filters.findIndex(({ columnName }: any) => columnName === 'user');
        if (index === -1) {
            filters.push({ columnName: 'user', value: userType })
        }
    }
    return filters;
}