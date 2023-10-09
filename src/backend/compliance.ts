import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { del, get, getChartsBaseUrl, post, put } from "./request";

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

    return {
        activities: ((data || {}).data || {}).list || [],
        total: ((data || {}).data || {}).count || 0,
        statusCount: ((data || {}).data || {}).statusCount || [],
        isFetching, refetch
    };
}

export function useGetComplianceById(id: any, payload = {}) {
    const queryClient = useQueryClient();
    function invalidate() {
        queryClient.invalidateQueries(['complianceById', id, payload])
    }
    const { data, isFetching, refetch } = useQuery(
        ['complianceById', id, payload],
        async () => await get(`/api/Compliance/Get/${id}`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: Boolean(id)
        }
    );

    return { activity: ((data || {}).data || null) as any, isFetching, refetch, invalidate };
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

export function useDeleteComplianceDocument(onSuccess?: any, onError?: any) {
    const { mutate: deleteDocument, error, isLoading: deleting } = useMutation(
        ['deleteDocument'],
        async (id: any) => await del(`/api/ComplianceDetails/Delete?Id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteDocument, error, deleting };
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


export function useSubmitComplianceActivity(onSuccess?: any, onError?: any) {
    const { mutate: submitComplianceActivity, error, isLoading: submitting } = useMutation(
        ['submitComplianceActivity'],
        async (keys: any) => await post(`/api/Compliance/SubmitToAudit`, keys),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { submitComplianceActivity, error, submitting };
}

export function useGetComplianceActivityDocuments(payload: any = {}) {
    const queryClient = useQueryClient();
    function invalidate() {
        queryClient.invalidateQueries(['complianceActivityDocuments', payload.complianceId])
    }
    const { data, isFetching, refetch } = useQuery(
        ['complianceActivityDocuments', payload.complianceId],
        async () => await get('/api/ComplianceDetails/GetByToDo', payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: Boolean((payload || {}).complianceId)
        }
    );
    return { documents: (data || {}).data || [], isFetching, invalidate, refetch };
}

export function useGetComplianceByDate(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['complianceByDate', payload],
        async () => await post('/api/Compliance/GetAllGroupByDate', payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { groups: (data || {}).data || [], isFetching, refetch };
}

export function useUploadDocument(onSuccess?: any, onError?: any) {
    const { mutate: uploadDocument, error, isLoading: uploading } = useMutation(
        ['uploadFile'],
        async ({ id, formData }: any) => await post(`/api/FileUpload/UploadComplianceSingleFile?complianceId=${id}`, formData, null, true),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { uploadDocument, error, uploading };
}

export function useGetOverallComplianceStatus(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['overallComplianceStatus', { ...payload, pagination: null }],
        async () => await post('/api/Compliance/GetByStatus', { ...payload, pagination: null }),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { response: (data || {}).data || [], isFetching, refetch };
}

export function useGetComplianceStatusByCategory(category: string, payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['complianceStatusByCategory', category, payload],
        async () => await post(`/api/Compliance/GetByCategory?category=${category}`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { response: (data || {}).data || [], isFetching, refetch };
}

export function useExportComplianceDashbard(onSuccess?: any, onError?: any) {
    const { mutate: exportDashboard, error, isLoading: exporting } = useMutation(
        ['auditReport'],
        async (payload: any) => await post(`${getChartsBaseUrl()}/Audit/GetDashboardReport`, payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportDashboard, error, exporting };
}