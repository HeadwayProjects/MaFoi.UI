import { useMutation } from "@tanstack/react-query";
import { post } from "./request";

export function useAuditReport(onSuccess, onError) {
    const { mutate: auditReport, error, isLoading: exporting } = useMutation(
        ['auditReport'],
        async (payload) => await post('/api/Auditor/GetAuditReport', payload, null, true, { responseType: 'blob' }),
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

export function useExportLaws(onSuccess, onError) {
    const { mutate: exportLaws, error, isLoading: exporting } = useMutation(
        ['exportLaws'],
        async (payload) => await post('/api/Law/Export', payload, null, true, { responseType: 'blob' }),
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

export function useExportAct(onSuccess, onError) {
    const { mutate: exportAct, error, isLoading: exporting } = useMutation(
        ['exportAct'],
        async (payload) => await post('/api/Act/Export', payload, null, true, { responseType: 'blob' }),
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

export function useExportActivities(onSuccess, onError) {
    const { mutate: exportActivity, error, isLoading: exporting } = useMutation(
        ['exportActivity'],
        async (payload) => await post('/api/Activity/Export', payload, null, true, { responseType: 'blob' }),
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

export function useExportRules(onSuccess, onError) {
    const { mutate: exportRules, error, isLoading: exporting } = useMutation(
        ['exportRules'],
        async (payload) => await post('/api/Rule/Export', payload, null, true, { responseType: 'blob' }),
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

export function useExportStates(onSuccess, onError) {
    const { mutate: exportStates, error, isLoading: exporting } = useMutation(
        ['exportStates'],
        async (payload) => await post('/api/State/Export', payload, null, true, { responseType: 'blob' }),
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

export function useExportCities(onSuccess, onError) {
    const { mutate: exportCities, error, isLoading: exporting } = useMutation(
        ['exportCities'],
        async (payload) => await post('/api/City/Export', payload, null, true, { responseType: 'blob' }),
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
export function useExportActStateMappings(onSuccess, onError) {
    const { mutate: exportActStateMappings, error, isLoading: exporting } = useMutation(
        ['exportActStateMappings'],
        async (payload) => await post('/api/Mappings/ExportActStateList', payload, null, true, { responseType: 'blob' }),
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