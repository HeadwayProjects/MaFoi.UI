import { ACTIONS } from "../../common/Constants";

export function GetMastersBreadcrumb(page) {
    return [
        { id: 'home', label: 'Home', path: '/' },
        { id: 'masters', label: 'Masters', path: '/masters/law' },
        { id: page, label: page }
    ]
}

export function GetActionTitle(type, action, isMaster = true) {
    if (!type) {
        return '';
    }
    if (action === ACTIONS.ADD) {
        return `Add ${type}${isMaster ? ' Master' : ''}`;
    } else if (action === ACTIONS.EDIT) {
        return `Edit ${type}${isMaster ? ' Master' : ''}`;
    } else if (action === ACTIONS.VIEW) {
        return `View ${type}${isMaster ? ' Master' : ''}`;
    } else {
        return `${type}${isMaster ? ' Master' : ''}`;
    }
}

export function FindDuplicateMasters(data, obj) {
    if (!data || !obj) {
        return [];
    }

    const keys = Object.keys(obj);
    const parsedObj = {};
    keys.forEach(key => {
        const value = (obj[key] || '').toUpperCase();
        parsedObj[key] = value.replace(/[^A-Z0-9]/ig, '');
    })

    return data.filter(x => {
        const duplicateKey = keys.find(key => {
            const value = (x[key] || '').toUpperCase();
            const parsedValue = value.replace(/[^A-Z0-9]/ig, '');
            return value && value === parsedObj[key];
        });
        return Boolean(duplicateKey);
    });
}

export function GetRuleDesc({ name, sectionNo, ruleNo }) {
    const value = [name];
    if (sectionNo) {
        value.push(`(Section No. ${sectionNo})`);
    }
    if (ruleNo) {
        value.push(`(Rule No. ${ruleNo})`);
    }
    return value.join(' ');
}

export const RuleType = ['Central', 'State'];

export const ActivityType = [
    'Appointment',
    'Assurance',
    'Audit',
    'Deposit',
    'Display',
    'Export/Import',
    'Internal Compliance',
    'Intimation',
    'Meeting',
    'Policy',
    'Register',
    'Registration',
    'Return'
];

export const Periodicity = [
    'Annually', 'Emburance', 'Half Yearly', 'Monthly', 'One Time', 'Quarterly'
];

export const CalendarType = [
    'Calendar Year',
    'Financial Year'
];

export const RiskType = ['Low', 'Medium', 'High'];

export const AuditType = ['Statutory', 'Internal'];

export const Revenue = ['$1M - $10M', '$10M - $20M', '$2M - $50M', '$50M - $100M'];

export const Reputation = ['Good', 'Moderate', 'Bad'];

export const CompanyStatus = ['Active', 'InActive'];

export const EmployeesCount = ['1-100', '101 - 200', '201 - 500', '501 - 1000','1001 - 2000', '2001 - 5000', '> 5000'];

export const Salutation = ['Mr.', 'Miss.', 'Mrs.'];

export const EstablishmentTypes = ['CLRA', 'Factory', 'Shops'];