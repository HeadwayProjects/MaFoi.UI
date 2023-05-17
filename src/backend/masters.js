import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./request";

export function useGetLaws(payload) {
    const { data, isFetching, refetch } = useQuery(
        ['laws', payload],
        async () => await api.post(`/api/Law/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );
    return { laws: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateLaw(onSuccess, onError) {
    const { mutate: createLaw, error, isLoading: creating } = useMutation(
        ['createLaw'],
        async (payload) => await api.post('/api/Law/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createLaw, error, creating };
}

export function useUpdateLaw(onSuccess, onError) {
    const { mutate: updateLaw, error, isLoading: updating } = useMutation(
        ['updateLaw'],
        async (payload) => await api.put('/api/Law/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateLaw, error, updating };
}

export function useDeleteLaw(onSuccess, onError) {
    const { mutate: deleteLaw, error, isLoading: deleting } = useMutation(
        ['deleteLaw'],
        async (id) => await api.del(`/api/Law/Delete?Id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteLaw, error, deleting };
}

export function useGetActs(payload) {
    const { data, isFetching, refetch } = useQuery(
        ['acts', payload],
        async () => await api.post(`/api/Act/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    return { acts: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateAct(onSuccess, onError) {
    const { mutate: createAct, error, isLoading: creating } = useMutation(
        ['createAct'],
        async (payload) => await api.post('/api/Act/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createAct, error, creating };
}

export function useUpdateAct(onSuccess, onError) {
    const { mutate: updateAct, error, isLoading: updating } = useMutation(
        ['updateAct'],
        async (payload) => await api.put('/api/Act/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateAct, error, updating };
}

export function useDeleteAct(onSuccess, onError) {
    const { mutate: deleteAct, error, isLoading: deleting } = useMutation(
        ['deleteAct'],
        async (id) => await api.del(`/api/Act/Delete?Id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteAct, error, deleting };
}

export function useGetActivities(payload) {
    const { data, isFetching, refetch } = useQuery(
        ['activities', payload],
        async () => await api.post(`/api/Activity/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    return { activities: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateActivity(onSuccess, onError) {
    const { mutate: createActivity, error, isLoading: creating } = useMutation(
        ['createActivity'],
        async (payload) => await api.post('/api/Activity/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createActivity, error, creating };
}

export function useUpdateActivity(onSuccess, onError) {
    const { mutate: updateActivity, error, isLoading: updating } = useMutation(
        ['updateActivity'],
        async (payload) => await api.put('/api/Activity/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateActivity, error, updating };
}

export function useDeleteActivity(onSuccess, onError) {
    const { mutate: deleteActivity, error, isLoading: deleting } = useMutation(
        ['deleteActivity'],
        async ({ id }) => await api.del(`/api/Activity/Delete?Id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteActivity, error, deleting };
}

export function useGetRules(payload) {
    const { data, isFetching, refetch } = useQuery(
        ['rules', payload],
        async () => await api.post(`/api/Rule/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    return { rules: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateRule(onSuccess, onError) {
    const { mutate: createRule, error, isLoading } = useMutation(
        ['createRule'],
        async (payload) => await api.post('/api/Rule/Add', payload),
        {
            onError,
            onSuccess
        }
    );
    return { createRule, error, isLoading };
}

export function useUpdateRule(onSuccess, onError) {
    const { mutate: updateRule, error, isLoading } = useMutation(
        ['updateRule'],
        async (payload) => await api.put('/api/Rule/Update', payload),
        {
            onError,
            onSuccess
        }
    );
    return { updateRule, error, isLoading };
}

export function useDeleteRule(onSuccess, onError) {
    const { mutate: deleteRule, error, isLoading } = useMutation(
        ['deleteRule'],
        async (id) => await api.del(`/api/Rule/Delete?Id=${id}`),
        {
            onError,
            onSuccess
        }
    );
    return { deleteRule, error, isLoading };
}

export function useGetStates(payload) {
    const { data, isFetching, refetch } = useQuery(
        ['states', payload],
        async () => await api.post(`/api/State/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    return { states: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useDeleteState(onSuccess, onError) {
    const { mutate: deleteState, error } = useMutation(
        ['deleteState'],
        async (id) => await api.del(`/api/State/Delete?id=${id}`),
        {
            onError,
            onSuccess
        }
    );
    return { deleteState, error };
}

export function useCreateState(onSuccess, onError) {
    const { mutate: createState, error } = useMutation(
        ['createState'],
        async (payload) => await api.post('/api/State/Add', payload),
        {
            onError,
            onSuccess
        }
    );
    return { createState, error };
}

export function useUpdateState(onSuccess, onError) {
    const { mutate: updateState, error } = useMutation(
        ['updateState'],
        async (payload) => await api.put('/api/State/Update', payload),
        {
            onError,
            onSuccess
        }
    );
    return { updateState, error };
}

export function useGetCities(payload, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['cities', payload],
        async () => await api.post(`/api/City/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return {
        cities: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch
    };
}
export function useDeleteCity(onSuccess, onError) {
    const { mutate: deleteCity, error } = useMutation(
        ['deleteCity'],
        async (id) => await api.del(`/api/City/Delete?id=${id}`),
        {
            onError,
            onSuccess
        }
    );
    return { deleteCity, error };
}

export function useCreateCity(onSuccess, onError) {
    const { mutate: createCity, error } = useMutation(
        ['createCity'],
        async (payload) => await api.post('/api/City/Add', payload),
        {
            onError,
            onSuccess
        }
    );
    return { createCity, error };
}

export function useUpdateCity(onSuccess, onError) {
    const { mutate: updateCity, error } = useMutation(
        ['updateState'],
        async (payload) => await api.put('/api/City/Update', payload),
        {
            onError,
            onSuccess
        }
    );
    return { updateCity, error };
}

export async function getLocations(payload) {
    const response = await api.get(`/api/Location/GetAll`, payload);
    return (response || {}).data || [];
}

export function useGetLocations(payload, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['locations', payload],
        async () => await api.get(`/api/Location/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { locations: (data || {}).data || [], isFetching, refetch };
}

export function useCreateLocation(onSuccess, onError) {
    const { mutate: createLocation, error } = useMutation(
        ['createLocation'],
        async (payload) => await api.post('/api/Location/Add', payload),
        {
            onError,
            onSuccess
        }
    );
    return { createLocation, error };
}

export function useUpdateLocation(onSuccess, onError) {
    const { mutate: updateLocation, error } = useMutation(
        ['updateLocation'],
        async (payload) => await api.put('/api/Location/Update', payload),
        {
            onError,
            onSuccess
        }
    );
    return { updateLocation, error };
}

export function useDeleteLocation(onSuccess, onError) {
    const { mutate: deleteLocation, error } = useMutation(
        ['deleteLocation'],
        async (id) => await api.del(`/api/Location/Delete?id=${id}`),
        {
            onError,
            onSuccess
        }
    );
    return { deleteLocation, error };
}

export function useGetCompanies(payload, enabled = true) {
    const queryClient = useQueryClient();
    function invalidate() {
        queryClient.invalidateQueries(['companies', payload])
    }
    const { data, isFetching, refetch } = useQuery(
        ['companies', payload],
        async () => await api.post(`/api/Company/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { companies: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch, invalidate };
}

export function useCreateCompany(onSuccess, onError) {
    const { mutate: createCompany, error, isLoading: creating } = useMutation(
        ['createCompany'],
        async (payload) => await api.post('/api/Company/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createCompany, error, creating };
}

export function useUploadLogo(onSuccess, onError) {
    const { mutate: uploadLogo, error, isLoading: uploading } = useMutation(
        ['uploadLogo'],
        async ({ id, formData }) => await api.put(`/api/Company/UploadLogo?id=${id}`, formData),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { uploadLogo, error, uploading };
}

export function useUpdateCompany(onSuccess, onError) {
    const { mutate: updateCompany, error, isLoading: updating } = useMutation(
        ['updateCompany'],
        async (payload) => await api.put('/api/Company/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateCompany, error, updating };
}

export function useDeleteCompany(onSuccess, onError) {
    const { mutate: deleteCompany, error } = useMutation(
        ['deleteCompany'],
        async (id) => await api.del(`/api/Company/Delete?Id=${id}`),
        {
            onError,
            onSuccess
        }
    );
    return { deleteCompany, error };
}

export function useGetRuleCompliances(payload, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['ruleCompliances', payload],
        async () => await api.post(`/api/RuleComplianceDetail/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );
    return { ruleCompliances: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateRuleCompliance(onSuccess, onError) {
    const { mutate: createRuleCompliance, error, isLoading: creating } = useMutation(
        ['createRuleCompliance'],
        async (payload) => await api.post('/api/RuleComplianceDetail/Add', payload),
        {
            onError,
            onSuccess
        }
    );
    return { createRuleCompliance, error, creating };
}

export function useUpdateRuleCompliance(onSuccess, onError) {
    const { mutate: updateRuleCompliance, error, isLoading: updating } = useMutation(
        ['updateRuleCompliance'],
        async (payload) => await api.put('/api/RuleComplianceDetail/Update', payload),
        {
            onError,
            onSuccess
        }
    );
    return { updateRuleCompliance, error, updating };
}

export function useDeleteRuleCompliance(onSuccess, onError) {
    const { mutate: deleteRuleCompliance, error, isLoading: deleting } = useMutation(
        ['deleteRuleCompliance'],
        async (id) => await api.del(`/api/RuleComplianceDetail/Delete?Id=${id}`),
        {
            onError,
            onSuccess
        }
    );
    return { deleteRuleCompliance, error, deleting };
}

export function useStateRuleCompanyMappings(payload, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['mappings', payload],
        async () => await api.post(`/api/Mappings/GetActStateList`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { mappings: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateStateRuleCompanyMapping(onSuccess, onError) {
    const { mutate: createStateRuleCompanyMapping, error, isLoading: creating } = useMutation(
        ['createStateRuleCompanyMapping'],
        async (payload) => await api.post('/api/Mappings/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createStateRuleCompanyMapping, error, creating };
}

export function useUploadActStateMappingTemplate(onSuccess, onError) {
    const { mutate: uploadActStateMappingTemplate, error, isLoading: uploading } = useMutation(
        ['uploadActStateMappingTemplate'],
        async ({ id, formData }) => await api.put(`/api/Mappings/UploadActStateMappingTemplate?id=${id}`, formData),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { uploadActStateMappingTemplate, error, uploading };
}

export function useDeleteActStateMapping(onSuccess, onError) {
    const { mutate: deleteActStateMapping, error, isLoading: deleting } = useMutation(
        ['deleteActStateMapping'],
        async (id) => await api.del(`/api/Mappings/DeleteActStateMapping?id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteActStateMapping, error, deleting };
}

export function useGetCompanyLocations(payload, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['companyLocations', payload],
        async () => await api.get(`/api/Mappings/GetCompanyLocations`, payload || {}),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { locations: (data || {}).data || [], isFetching, refetch };
}

export function useCreateCompanyLocation(onSuccess, onError) {
    const { mutate: createCompanyLocation, error, isLoading: creating } = useMutation(
        ['createCompanyLocation'],
        async (payload) => await api.post('/api/Mappings/AddCompanyLocation', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createCompanyLocation, error, creating };
}

export function useDeleteCompanyLocation(onSuccess, onError) {
    const { mutate: deleteCompanyLocation, error, isLoading: deleting } = useMutation(
        ['deleteCompanyLocation'],
        async (payload) => await api.post(`/api/Mappings/Delete`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteCompanyLocation, error, deleting };
}

export function useGetUserCompanies(payload, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['userCompanies', payload],
        async () => await api.get(`/api/Mappings/GetUserCompanyLocation`, payload || {}),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { userCompanies: (data || {}).data || [], isFetching, refetch };
}

export function useCreateUserLocationMapping(onSuccess, onError) {
    const { mutate: createUserLocationMapping, error, isLoading: creating } = useMutation(
        ['createUserLocationMapping'],
        async (payload) => await api.post('/api/Mappings/AddUserCompanyLocation', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createUserLocationMapping, error, creating };
}

export function useExportAuditSchedule(onSuccess, onError) {
    const { mutate: exportAuditSchedule, error, isLoading: exporting } = useMutation(
        ['exportAuditSchedule'],
        async (payload) => await api.post('/api/Company/ExportAuditSchedule', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportAuditSchedule, error, exporting };
}

export function useImportAuditSchedule(onSuccess, onError) {
    const { mutate: importAuditSchedule, error, isLoading: uploading } = useMutation(
        ['importAuditSchedule'],
        async (formData) => await api.post(`/api/Company/ImportAuditSchedule`, formData, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { importAuditSchedule, error, uploading };
}