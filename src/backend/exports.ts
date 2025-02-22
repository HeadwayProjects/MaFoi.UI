import { useMutation } from "@tanstack/react-query";
import { get, getChartsBaseUrl, post } from "./request";

export function useAuditReport(onSuccess?: any, onError?: any) {
    const { mutate: auditReport, error, isLoading: exporting } = useMutation(
        ['auditReport'],
        async (payload: any) => await post(`${getChartsBaseUrl()}/Audit/GetAuditReport`, payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { auditReport, error, exporting };
}

export function useAuditReportForVendor(onSuccess?: any, onError?: any) {
    const { mutate: auditReportVendor, error, isLoading: exporting } = useMutation(
        ['auditReportVendor'],
        async (payload: any) => await post(`${getChartsBaseUrl()}/Audit/GetAuditReportForVendor`, payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response: any) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { auditReportVendor, error, exporting };
}

export function useExportVendorCategories(onSuccess?: any, onError?: any) {
    const { mutate: exportLaws, error, isLoading: exporting } = useMutation(
        ['exportLaws'],
        async (payload: any) => await post('/api/VendorCategories/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportLaws, error, exporting };
}

export function useExportLaws(onSuccess?: any, onError?: any) {
    const { mutate: exportLaws, error, isLoading: exporting } = useMutation(
        ['exportLaws'],
        async (payload: any) => await post('/api/Law/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportLaws, error, exporting };
}

export function useExportAct(onSuccess?: any, onError?: any) {
    const { mutate: exportAct, error, isLoading: exporting } = useMutation(
        ['exportAct'],
        async (payload: any) => await post('/api/Act/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportAct, error, exporting };
}

export function useExportHolidayList(onSuccess?: any, onError?: any) {
    const { mutate: exportHolidayList, error, isLoading: exporting } = useMutation(
        ['exportHolidayList'],
        async (payload: any) => await post('/api/Holiday/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportHolidayList, error, exporting };
}

export function useExportAttendanceConfig(onSuccess?: any, onError?: any) {
    const { mutate: exportAttendanceConfig, error, isLoading: exporting } = useMutation(
        ['exportAttendanceConfig'],
        async (payload: any) => await post('/api/Attendance/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportAttendanceConfig, error, exporting };
}

export function useExportLeaveConfig(onSuccess?: any, onError?: any) {
    const { mutate: exportLeaveConfig, error, isLoading: exporting } = useMutation(
        ['exportLeaveConfig'],
        async (payload: any) => await post('/api/Leave/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportLeaveConfig, error, exporting };
}

export function useExportEmployees(onSuccess?: any, onError?: any) {
    const { mutate: exportEmployees, error, isLoading: exporting } = useMutation(
        ['exportEmployees'],
        async (payload: any) => await post('/api/Employee/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportEmployees, error, exporting };
}

export function useExportEmployeesLeaveCredit(onSuccess?: any, onError?: any) {
    const { mutate: exportEmployeesLeaveCredit, error, isLoading: exporting } = useMutation(
        ['exportEmployeesLeaveCredit'],
        async (payload: any) => await post('/api/Leave/EmployeeLeaveCreditExport', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportEmployeesLeaveCredit, error, exporting };
}

export function useExportEmployeesLeaveAvailed(onSuccess?: any, onError?: any) {
    const { mutate: exportEmployeesLeaveAvailed, error, isLoading: exporting } = useMutation(
        ['exportEmployeesLeaveAvailed'],
        async (payload: any) => await post('/api/Leave/EmployeeAvailedExport', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportEmployeesLeaveAvailed, error, exporting };
}

export function useExportEmployeesAttendance(onSuccess?: any, onError?: any) {
    const { mutate: exportEmployeesAttendance, error, isLoading: exporting } = useMutation(
        ['exportEmployeesAttendance'],
        async (payload: any) => await post('/api/Employee/EmployeeAttendanceexport', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportEmployeesAttendance, error, exporting };
}

export function useExportEmployeesWage(onSuccess?: any, onError?: any) {
    const { mutate: exportEmployeesWage, error, isLoading: exporting } = useMutation(
        ['exportEmployeesWage'],
        async (payload: any) => await post('/api/Employee/EmployeeWagesexport', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportEmployeesWage, error, exporting };
}


export function useExportActivities(onSuccess?: any, onError?: any) {
    const { mutate: exportActivity, error, isLoading: exporting } = useMutation(
        ['exportActivity'],
        async (payload: any) => await post('/api/Activity/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportActivity, error, exporting };
}

export function useExportRules(onSuccess?: any, onError?: any) {
    const { mutate: exportRules, error, isLoading: exporting } = useMutation(
        ['exportRules'],
        async (payload: any) => await post('/api/Rule/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportRules, error, exporting };
}

export function useExportStates(onSuccess?: any, onError?: any) {
    const { mutate: exportStates, error, isLoading: exporting } = useMutation(
        ['exportStates'],
        async (payload: any) => await post('/api/State/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportStates, error, exporting };
}

export function useExportCities(onSuccess?: any, onError?: any) {
    const { mutate: exportCities, error, isLoading: exporting } = useMutation(
        ['exportCities'],
        async (payload: any) => await post('/api/City/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportCities, error, exporting };
}
export function useExportActStateMappings(onSuccess?: any, onError?: any) {
    const { mutate: exportActStateMappings, error, isLoading: exporting } = useMutation(
        ['exportActStateMappings'],
        async (payload: any) => await post('/api/Mappings/ExportActStateMapping', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportActStateMappings, error, exporting };
}

export function useExportRuleCompliance(onSuccess?: any, onError?: any) {
    const { mutate: exportRuleCompliance, error, isLoading: exporting } = useMutation(
        ['exportRuleCompliance'],
        async (payload: any) => await post('/api/RuleComplianceDetail/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportRuleCompliance, error, exporting };
}

export function useExportRuleComplianceMapping(onSuccess?: any, onError?: any) {
    const { mutate: exportRuleComplianceMapping, error, isLoading: exporting } = useMutation(
        ['exportRuleComplianceMapping'],
        async (payload: any) => await get('/api/RuleComplianceDetail/ExportMapping', payload, null, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportRuleComplianceMapping, error, exporting };
}

export function useExportCompanies(onSuccess?: any, onError?: any) {
    const { mutate: exportCompanies, error, isLoading: exporting } = useMutation(
        ['exportCompanies'],
        async (payload: any) => await post('/api/Company/ExportCompany', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportCompanies, error, exporting };
}

export function useExportVendors(onSuccess?: any, onError?: any) {
    const { mutate: exportVendors, error, isLoading: exporting } = useMutation(
        ['exportCompanies'],

        async (payload: any) => await post('/api/VendorDetails/ExportVendors', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }

        }

    );
    return { exportVendors, error, exporting };
}

export function useExportAssociateCompanies(onSuccess?: any, onError?: any) {
    const { mutate: exportAssociateCompanies, error, isLoading: exporting } = useMutation(
        ['exportAssociateCompanies'],
        async (payload: any) => await post('/api/Company/ExportAssociateCompany', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportAssociateCompanies, error, exporting };
}

export function useExportVendorLocations(onSuccess?: any, onError?: any) {
    const { mutate: exportVendorLocations, error, isLoading: exporting } = useMutation(
        ['exportVendorLocations'],
        async (payload: any) => await post('/api/Mappings/ExportVendorLocationMappings', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportVendorLocations, error, exporting };
}

export function useExportCompanyLocations(onSuccess?: any, onError?: any) {
    const { mutate: exportCompanyLocations, error, isLoading: exporting } = useMutation(
        ['exportCompanyLocations'],
        async (payload: any) => await post('/api/Mappings/ExportCompanyLocations', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportCompanyLocations, error, exporting };
}

export function useExportUsers(onSuccess?: any, onError?: any) {
    const { mutate: exportUsers, error, isLoading: exporting } = useMutation(
        ['exportUsers'],
        async (payload: any) => await post('/api/UserManagement/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportUsers, error, exporting };
}

export function useExportVerticals(onSuccess?: any, onError?: any) {
    const { mutate: exportVertical, error, isLoading: exporting } = useMutation(
        ['exportVertical'],
        async (payload: any) => await post('/api/Vertical/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportVertical, error, exporting };
}

export function useExportDepartments(onSuccess?: any, onError?: any) {
    const { mutate: exportDepartments, error, isLoading: exporting } = useMutation(
        ['exportDepartments'],
        async (payload: any) => await post('/api/Department/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportDepartments, error, exporting };
}

export function getAuditReportFileName(row: any, contentType: string) {
    const {company, associateCompany, location, month} = row;
    let fileNames: string[] = ['Audit_Report', company.code, associateCompany.code, location.code, month];
    const fileExt = contentType.split('/')[1] || 'pdf';
    return `${fileNames.join('_')}.${fileExt}`;
}
