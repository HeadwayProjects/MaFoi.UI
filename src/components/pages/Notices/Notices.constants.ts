import dayjs from "dayjs";
import { MONTHS_ENUM } from "../../common/Constants";
import { ComplianceActivityStatus } from "../../../constants/Compliance.constants";
import { getValue } from "../../../utils/common";
import { CentralId, RuleTypeEnum } from "../Masters/Master.constants";

export function getNoticePayload(data: any) {
    const {
        act,
        activity,
        approverDueDate,
        associateCompany,
        auditedDate = "0001-01-01T00:00:00",
        auditRemarks = '',
        auditStatus = '',
        auditted,
        company,
        complianceManager,
        complianceOwner,
        day = 1,
        department,
        dueDate,
        formsStatusRemarks = '',
        id,
        issuedAuthority = '',
        issuedDepartment = '',
        location,
        month = MONTHS_ENUM[new Date().getMonth()],
        noticeDate = "0001-01-01T00:00:00",
        noticeDescription = '',
        noticeDueDate = "0001-01-01T00:00:00",
        rule,
        ruleCompliance,
        savedDate = "0001-01-01T00:00:00",
        startDate = dayjs(new Date()).startOf('D').local().format(),
        status = ComplianceActivityStatus.DUE,
        submittedDate = "0001-01-01T00:00:00",
        uploadNotice = '',
        veritical,
        year = new Date().getFullYear(),
    } = data;

    return {
        actId: act.value,
        activityId: activity.value,
        actStateMappingId: ruleCompliance.id,
        approverDueDate: dayjs(approverDueDate).startOf('D').local().format(),
        associateCompanyId: associateCompany.value,
        auditedDate,
        auditRemarks,
        auditStatus,
        auditted: auditted.value,
        companyId: company.value,
        complianceManagerId: complianceManager ? complianceManager.value : null,
        complianceOwnerId: complianceOwner ? complianceOwner.value : null,
        day,
        departmentId: department ? department.value : null,
        dueDate: dayjs(dueDate).startOf('D').local().format(),
        formsStatusRemarks,
        id,
        isNotice: true,
        issuedAuthority,
        issuedDepartment,
        locationId: location.value,
        month,
        noticeDate: dayjs(noticeDate).startOf('D').local().format(),
        noticeDescription,
        noticeDueDate: dayjs(noticeDueDate).startOf('D').local().format(),
        published: false,
        ruleId: rule.value,
        savedDate,
        startDate,
        status,
        submittedDate,
        uploadNotice,
        veriticalId: veritical ? veritical.value : null,
        year,
    }
}

export function getNoticeData(data: any) {
    const {
        act,
        activity,
        actStateMapping,
        approverDueDate,
        associateCompany,
        auditedDate,
        auditRemarks,
        auditStatus,
        auditted,
        company,
        complianceManager,
        complianceOwner,
        day,
        department,
        dueDate,
        formsStatusRemarks,
        id,
        issuedAuthority,
        issuedDepartment,
        location,
        month,
        noticeDate,
        noticeDescription,
        noticeDueDate,
        rule,
        ruleCompliance,
        savedDate,
        startDate,
        status,
        submittedDate,
        uploadNotice,
        veritical,
        year
    } = data;
    return {
        act: { value: act.id, label: act.name, act },
        activity: { value: activity.id, label: activity.name, activity },
        approverDueDate: new Date(approverDueDate),
        associateCompany: { value: associateCompany.id, label: associateCompany.name, associateCompany },
        auditedDate,
        auditRemarks,
        auditStatus,
        auditted: { value: auditted, label: auditted },
        company: { value: company.id, label: company.name, company },
        complianceManager: complianceManager ? { value: complianceManager.id, label: complianceManager.name } : null,
        complianceOwner: complianceOwner ? { value: complianceOwner.id, label: complianceOwner.name } : null,
        day,
        department: department ? { value: department.id, label: department.name } : null,
        dueDate: new Date(dueDate),
        establishmentType: { value: act.establishmentType, label: act.establishmentType },
        formsStatusRemarks,
        id,
        issuedAuthority,
        issuedDepartment,
        location: { value: location.id, label: location.name, location },
        stateId: getValue(actStateMapping, 'stateId'),
        month,
        noticeDate: new Date(noticeDate),
        noticeDescription,
        noticeDueDate: new Date(noticeDueDate),
        rule: { value: rule.id, label: rule.name, rule },
        ruleCompliance: actStateMapping,
        savedDate,
        startDate,
        status,
        submittedDate,
        type: actStateMapping.stateId === CentralId ?
            { value: RuleTypeEnum.CENTRAL, label: RuleTypeEnum.CENTRAL } :
            { value: RuleTypeEnum.STATE, label: RuleTypeEnum.STATE },
        uploadNotice,
        veritical: veritical ? { value: veritical.id, label: veritical.name } : null,
        year
    }
}