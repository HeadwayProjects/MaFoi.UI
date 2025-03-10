import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./request";

export function useGetUserCompanies(enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['userCompanies'],
        async () => await api.get('/api/Company/GetUserCompanies'),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { userCompanies: (data || {}).data || [], isFetching, refetch };
}

export function useGetForms(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['stateMappingForms', payload],
        async () => await api.post('/api/ActStateMapping/GetForms', payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );
    return { forms: (data || {}).data || [], isFetching, refetch };
}

export function useGetActivityDocuments(activityId: string) {
    const queryClient = useQueryClient();
    function invalidate() {
        queryClient.invalidateQueries(['activityDocuments', activityId])
    }
    const { data, isFetching } = useQuery(
        ['activityDocuments', activityId],
        async () => await api.get(`/api/ToDoDetails/GetByToDo?toDoId=${activityId}`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!activityId
        }
    );
    return { documents: (data || {}).data || [], isFetching, invalidate };
}

export function useGetVendorActivityDocuments(activityId: string) {
    const queryClient = useQueryClient();
    function invalidate() {
        queryClient.invalidateQueries(['activityDocuments', activityId])
    }
    const { data, isFetching } = useQuery(
        ['activityDocuments', activityId],
        async () => await api.get(`/api/ToDoVendorDetails/GetByVendorToDo?toDoVendorId=${activityId}`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!activityId
        }

    );

    return { documents: (data || {}).data || [], isFetching, invalidate };
}

export function useGetAllActivities(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['auditorActivities', payload],
        async () => await api.post('/api/ToDo/GetAll', payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { activities: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useGetVendorActivites(payload: any) {
    const { data, isFetching, refetch } = useQuery(
        ['auditorActivities', payload],
        async () => await api.post('/api/ToDo/GetToDoByCriteria', payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!payload && !!payload.company
        }
    );

    return { activities: (data || {}).data || [], isFetching, refetch };
}



export function useExportTodos(onSuccess?: any, onError?: any) {
    const { mutate: exportTodos, error, isLoading: exporting } = useMutation(
        ['exportTodos'],
        async (payload: any) => await api.post('/api/ToDo/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportTodos, error, exporting };
}

export function useGetUserVendors(enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['userVendors'],
        async () => await api.get('/api/Company/GetUserVendors'),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { userVendors: (data || {}).data || [], isFetching, refetch };
}

// Vendor audit activites
export function useGetAllVendorActivities(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['auditorActivities', payload],
        async () => await api.post('/api/ToDoVendor/GetAll', payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { activities: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useExportVendorTodos(onSuccess?: any, onError?: any) {
    const { mutate: exportTodos, error, isLoading: exporting } = useMutation(
        ['exportTodos'],
        async (payload: any) => await api.post('/api/ToDoVendor/Export', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response: any) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportTodos, error, exporting };
}

export function useUpdateAuditorVendor(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['updateAuditDetails', payload],
        async () => await api.post('/api/AuditorVendor/UpdateAuditVendorDetails', payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { AuditVendors: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}


export function useSendReportAsEmail(onSuccess?: any, onError?: any) {
    const { mutate: sendEmail, error, isLoading: adding } = useMutation(
        ['sendEmail'],
        async (payload: any) => await api.post('/api/AuditorVendor/SendEmailDownlaodVendorReport', payload),
        {
            onError,
            onSuccess: (response: any) => {
                const { data } = response || {};
                onSuccess(data || {});
            }
        }
    );
    return { sendEmail, error, adding };
}
export function useToDoWithZip(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['multiIds', payload],
        async () => await api.post('api/ToDoVendorDetails/GetByToDowithZipWithOnlyFileforMultipleIds', payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { multipleIds: (data || {}).data || [], isFetching, refetch };
}


// export function useExportCompanyLocations(onSuccess?: any, onError?: any) {
//     const { mutate: exportCompanyLocations, error, isLoading: exporting } = useMutation(
//         ['exportCompanyLocations'],
//         async (payload: any) => await api.post('/api/Mappings/ExportVendorLocationMappings', payload, null, true, { responseType: 'blob' }),
//         {
//             onError,
//             onSuccess: (response) => {
//                 const data = (response || {});
//                 onSuccess(data);
//             }
//         }
//     );
//     return { exportCompanyLocations, error, exporting };
// }

export function useExportAssociateVendors(onSuccess?: any, onError?: any) {
    const { mutate: exportVendors, error, isLoading: exporting } = useMutation(
        ['exportAssociateCompanies'],
        async (payload: any) => await api.post('/api/VendorDetails/ExportVendors', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response: any) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportVendors, error, exporting };
}

export function useVendorImportLocations(onSuccess?: any, onError?: any) {
    const { mutate: VendorImportLocation, error, isLoading: uploading } = useMutation(
        ['VendorImportLocation'],
        async ({ CID, ACID, LID, formData }: any) =>
            await api.post(
                `/api/Mappings/BulkImportVendorLocationsMappings?companyId=${CID}&associateCompanyId=${ACID}&locationId=${LID}`,
                formData,
                null,
                true,
                { responseType: 'blob' }
            ),
        {
            onError,
            onSuccess: (response: any) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );

    return { VendorImportLocation, error, uploading };
}