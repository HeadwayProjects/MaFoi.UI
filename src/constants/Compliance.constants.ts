import { getUserDetails, hasUserAccess } from "../backend/auth"
import { USER_PRIVILEGES } from "../components/pages/UserManagement/Roles/RoleConfiguration"


export enum ComplianceActivityStatus {
    DUE = 'Due',
    NON_COMPLIANT = 'NonCompliant',
    PENDING = 'Submitted',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
    LATE_CLOSURE = 'Late',
    ON_TIME = 'OnTime'
}

export const ComplianceStatusMapping: any = {
    [ComplianceActivityStatus.DUE]: 'Due',
    [ComplianceActivityStatus.NON_COMPLIANT]: 'Non-Compliant',
    [ComplianceActivityStatus.PENDING]: 'Pending',
    [ComplianceActivityStatus.APPROVED]: 'Approved',
    [ComplianceActivityStatus.REJECTED]: 'Rejected',
    [ComplianceActivityStatus.LATE_CLOSURE]: 'Late Closure',
    [ComplianceActivityStatus.ON_TIME]: 'On time'
}

export const ComplianceStatusIconMapping: any = {
    [ComplianceActivityStatus.DUE]: 'clock',
    [ComplianceActivityStatus.NON_COMPLIANT]: 'exclamation-circle',
    [ComplianceActivityStatus.PENDING]: 'check-square',
    [ComplianceActivityStatus.APPROVED]: 'check-circle',
    [ComplianceActivityStatus.REJECTED]: 'times-circle',
}


export const COMPLIANCE_ACTIVITY_ORDER = [
    ComplianceActivityStatus.REJECTED,
    ComplianceActivityStatus.NON_COMPLIANT,
    ComplianceActivityStatus.DUE,
    ComplianceActivityStatus.PENDING,
    ComplianceActivityStatus.APPROVED
]

export const COMPLIANCE_ACTIVITY_INDICATION: any = {
    [ComplianceActivityStatus.DUE]: 'var(--gray)',
    [ComplianceActivityStatus.NON_COMPLIANT]: 'var(--medium-red)',
    [ComplianceActivityStatus.PENDING]: 'var(--yellow)',
    [ComplianceActivityStatus.APPROVED]: 'var(--light-blue)',
    [ComplianceActivityStatus.REJECTED]: 'var(--red)'
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
        color: '--gray'
    },
    [ComplianceChartStatus.PENDING]: {
        value: ComplianceChartStatus.PENDING,
        label: ComplianceStatusMapping[ComplianceActivityStatus.PENDING],
        color: '--yellow'
    },
    [ComplianceChartStatus.LATE]: {
        value: ComplianceChartStatus.LATE,
        label: ComplianceStatusMapping[ComplianceActivityStatus.LATE_CLOSURE],
        color: '--orange'
    },
    [ComplianceChartStatus.NON_COMPLIANT]: {
        value: ComplianceChartStatus.NON_COMPLIANT,
        label: 'Non-Compliant',
        color: '--medium-red'
    },
    [ComplianceChartStatus.ON_TIME]: {
        value: ComplianceChartStatus.ON_TIME,
        label: ComplianceStatusMapping[ComplianceActivityStatus.ON_TIME],
        color: '--green'
    }
}

export enum DashboardView {
    CALENDAR = 'calendar',
    CHART = 'chart'
}

export function setUserDetailsInFilters(filters: any[] = [], type = false) {
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