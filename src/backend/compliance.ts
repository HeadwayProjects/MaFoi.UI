import { useMutation, useQuery } from "@tanstack/react-query";
import { post, put } from "./request";

export function useExportComplianceSchedule(onSuccess?: any, onError?: any) {
    const { mutate: exportComplianceSchedule, error, isLoading: exporting } = useMutation(
        ['exportComplianceSchedule'],
        async (payload: any) => await post('/api/Compliance/ExportAuditSchedule', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportComplianceSchedule, error, exporting };
}

export function useImportComplianceSchedule(onSuccess?: any, onError?: any) {
    const { mutate: importComplianceSchedule, error, isLoading: uploading } = useMutation(
        ['importComplianceSchedule'],
        async (formData: any) => await post(`/api/Compliance/ImportAuditSchedule`, formData, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { importComplianceSchedule, error, uploading };
}

export function useGetAllComplianceActivities(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['complianceActivities', payload],
        async () => await post('/api/Compliance/GetAll', payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { activities: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useDeleteComplianceSchedule(onSuccess?: any, onError?: any) {
    const { mutate: deleteComplianceSchedule, error, isLoading: deleting } = useMutation(
        ['deleteComplianceSchedule'],
        async (payload: any) => await post(`/api/Compliance/Delete`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteComplianceSchedule, error, deleting };
}

export function useBulkUpdateComplianceSchedule(onSuccess?: any, onError?: any) {
    const { mutate: updateBulkComplianceSchedule, error, isLoading: updating } = useMutation(
        ['updateBulkComplianceSchedule'],
        async (payload) => await put(`/api/Compliance/BulkUpdate`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateBulkComplianceSchedule, error, updating };
}

export function useUpdateComplianceSchedule(onSuccess?: any, onError?: any) {
    const { mutate: updateComplianceSchedule, error, isLoading: updating } = useMutation(
        ['updateComplianceSchedule'],
        async (payload: any) => await put(`/api/Compliance/Update`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateComplianceSchedule, error, updating };
}
