import { useMutation } from "@tanstack/react-query";
import { get, post } from "./request";

export function useAuditReport(onSuccess?: any, onError?: any) {
    const { mutate: auditReport, error, isLoading: exporting } = useMutation(
        ['auditReport'],
        async (payload: any) => await post('/api/Auditor/GetAuditReport', payload, null, true, { responseType: 'blob' }),
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
