import { ACTIONS } from "../../common/Constants";

export function GetMastersBreadcrumb(page) {
    return [
        { id: 'home', label: 'Home', path: '/' },
        { id: 'masters', label: 'Masters', path: '/masters/act' },
        { id: page, label: page }
    ]
}

export function GetActionTitle(type, action) {
    if (!type) {
        return '';
    }
    if (action === ACTIONS.ADD) {
        return `Add ${type} Master`;
    } else if (action === ACTIONS.EDIT) {
        return `Edit ${type} Master`;
    } else if (action === ACTIONS.VIEW) {
        return `View ${type} Master`;
    } else {
        return `${type} Master`;
    }
}

export const RuleType = [
    { id: 'S', name: 'State' },
    { id: 'C', name: 'Central' }
];

export const ActivityType = [
    { id: 'RET', name: 'Return' },
    { id: 'ASS', name: 'Assurance' },
    { id: 'REGS', name: 'Registration' },
    { id: 'REG', name: 'Register' },
    { id: 'DIS', name: 'Display' },
    { id: 'AUD', name: 'Audit' },
    { id: 'INT', name: 'Intimation' },
    { id: 'DEP', name: 'Deposit' },
    { id: 'E/I', name: 'Export/Import' },
    { id: 'APP', name: 'Appointment' },
    { id: 'IC', name: 'Internal Compliance' },
    { id: 'MTG', name: 'Meeting' },
    { id: 'PLCY', name: 'Policy' }
];

export const Periodicity = [
    { id: 'E', name: 'Emburance' },
    { id: 'M', name: 'Monthly' },
    { id: 'Q', name: 'Quarterly' },
    { id: 'H', name: 'Half Yealy' },
    { id: 'A', name: 'Anually' },
    { id: '0', name: 'One Time' }
];

export const CalendarType = [
    { id: 'C', name: 'Calendar Year' },
    { id: 'F', name: 'Financial Year' }
];