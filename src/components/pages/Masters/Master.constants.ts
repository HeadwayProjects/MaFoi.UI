import { ACTIONS } from "../../common/Constants";

export function GetMastersBreadcrumb(page: string) {
    return [
        { id: 'home', label: 'Home', path: '/' },
        { id: 'masters', label: 'Masters', path: '/masters/law' },
        { id: page, label: page }
    ]
}

export function GetActionTitle(type: any, action: any, isMaster = true) {
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

export function FindDuplicateMasters(data: any, obj: any) {
    if (!data || !obj) {
        return [];
    }

    const keys = Object.keys(obj);
    const parsedObj: any = {};
    keys.forEach(key => {
        const value = (obj[key] || '').toUpperCase();
        parsedObj[key] = value.replace(/[^A-Z0-9]/ig, '');
    })

    return data.filter((x: any) => {
        const duplicateKey = keys.find(key => {
            const value = (x[key] || '').toUpperCase();
            const parsedValue = value.replace(/[^A-Z0-9]/ig, '');
            return value && parsedValue === parsedObj[key];
        });
        return Boolean(duplicateKey);
    });
}

export function GetRuleDesc({ name, sectionNo, ruleNo }: any) {
    const value = [name];
    if (sectionNo) {
        value.push(`(Section No. ${sectionNo})`);
    }
    if (ruleNo) {
        value.push(`(Rule No. ${ruleNo})`);
    }
    return value.join(' ');
}

export const RuleTypeEnum = {
    CENTRAL: 'Central',
    STATE: 'State'
}

export const RuleType = [RuleTypeEnum.CENTRAL, RuleTypeEnum.STATE];

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
    'Registers',
    'Registration',
    'Returns'
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

export const EmployeesCount = ['1-100', '101 - 200', '201 - 500', '501 - 1000', '1001 - 2000', '2001 - 5000', '> 5000'];

export const Salutation = ['Mr.', 'Miss.', 'Mrs.'];

export const EstablishmentTypes = ['CLRA', 'Factory', 'Shops'];

export const CentralId = '3c31d2b2-afc6-4efa-8d12-635920524e5f';