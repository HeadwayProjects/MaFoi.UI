import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./request";

export function useGetLaws(payload: any) {
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

export function useCreateLaw(onSuccess?: any, onError?: any) {
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

export function useUpdateLaw(onSuccess?: any, onError?: any) {
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

export function useDeleteLaw(onSuccess?: any, onError?: any) {
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

export async function getActs(payload: any) {
    return await api.post(`/api/Act/GetAll`, payload)
}

export function useGetActs(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['acts', payload],
        async () => await api.post(`/api/Act/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { acts: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateAct(onSuccess?: any, onError?: any) {
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

export function useUpdateAct(onSuccess?: any, onError?: any) {
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

export function useDeleteAct(onSuccess?: any, onError?: any) {
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

export function useImportActs(onSuccess?: any, onError?: any) {
    const { mutate: importActs, error, isLoading: uploading } = useMutation(
        ['importActs'],
        async ({ formData }: any) => await api.post('/api/Act/Import', formData, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { importActs, error, uploading };
}

export async function getActivities(payload: any) {
    return await api.post(`/api/Activity/GetAll`, payload)
}

export function useGetActivities(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['activities', payload],
        async () => await api.post(`/api/Activity/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { activities: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateActivity(onSuccess?: any, onError?: any) {
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

export function useUpdateActivity(onSuccess?: any, onError?: any) {
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

export function useDeleteActivity(onSuccess?: any, onError?: any) {
    const { mutate: deleteActivity, error, isLoading: deleting } = useMutation(
        ['deleteActivity'],
        async ({ id }: any) => await api.del(`/api/Activity/Delete?Id=${id}`),
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

export function useImportActivities(onSuccess?: any, onError?: any) {
    const { mutate: importActivities, error, isLoading: uploading } = useMutation(
        ['importActivities'],
        async ({ formData }: any) => await api.post('/api/Activity/Import', formData, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { importActivities, error, uploading };
}

export async function getRules(payload: any) {
    return await api.post(`/api/Rule/GetAll`, payload);
}

export function useGetRules(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['rules', payload],
        async () => await api.post(`/api/Rule/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { rules: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateRule(onSuccess?: any, onError?: any) {
    const { mutate: createRule, error, isLoading } = useMutation(
        ['createRule'],
        async (payload) => await api.post('/api/Rule/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createRule, error, isLoading };
}

export function useUpdateRule(onSuccess?: any, onError?: any) {
    const { mutate: updateRule, error, isLoading } = useMutation(
        ['updateRule'],
        async (payload) => await api.put('/api/Rule/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateRule, error, isLoading };
}

export function useDeleteRule(onSuccess?: any, onError?: any) {
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

export function useImportRules(onSuccess?: any, onError?: any) {
    const { mutate: importRules, error, isLoading: uploading } = useMutation(
        ['importRules'],
        async ({ formData }: any) => await api.post('/api/Rule/Import', formData, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { importRules, error, uploading };
}
export function useGetStates(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['states', payload],
        async () => await api.post(`/api/State/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { states: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useDeleteState(onSuccess?: any, onError?: any) {
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

export function useCreateState(onSuccess?: any, onError?: any) {
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

export function useUpdateState(onSuccess?: any, onError?: any) {
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

export function useGetCities(payload: any, enabled = true) {
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
export function useDeleteCity(onSuccess?: any, onError?: any) {
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

export function useCreateCity(onSuccess?: any, onError?: any) {
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

export function useUpdateCity(onSuccess?: any, onError?: any) {
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

export async function getLocations(payload: any) {
    const response = await api.get(`/api/Location/GetAll`, payload);
    return (response || {}).data || [];
}

export function useGetLocations(payload: any, enabled = true) {
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

export function useCreateLocation(onSuccess?: any, onError?: any) {
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

export function useUpdateLocation(onSuccess?: any, onError?: any) {
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

export function useDeleteLocation(onSuccess?: any, onError?: any) {
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

export function useImportLocations(onSuccess?: any, onError?: any) {
    const { mutate: importLocations, error, isLoading: uploading } = useMutation(
        ['importLocations'],
        async ({ CID, ACID, formData }: any) => await api.post(`/api/Mappings/BulkImportCompanyLocations?companyId=${CID}&associateCompanyId=${ACID}`, formData, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { importLocations, error, uploading };
}

export function useGetCompanies(payload: any, enabled = true) {
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

export function useCreateCompany(onSuccess?: any, onError?: any) {
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

export function useUploadLogo(onSuccess?: any, onError?: any) {
    const { mutate: uploadLogo, error, isLoading: uploading } = useMutation(
        ['uploadLogo'],
        async ({ id, formData }: any) => await api.put(`/api/Company/UploadLogo?id=${id}`, formData),
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

export function useUpdateCompany(onSuccess?: any, onError?: any) {
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

export function useDeleteCompany(onSuccess?: any, onError?: any) {
    const { mutate: deleteCompany, error, isLoading } = useMutation(
        ['deleteCompany'],
        async (id) => await api.del(`/api/Company/Delete?Id=${id}`),
        {
            onError,
            onSuccess
        }
    );
    return { deleteCompany, error, isLoading };
}

export function useGetSmtpDetails(companyId: any, payload: any, enabled = true) {
    const queryClient = useQueryClient();
    function invalidate() {
        queryClient.invalidateQueries(['smtpDetails', companyId, payload])
    }
    const { data, isFetching, refetch } = useQuery(
        ['smtpDetails', companyId, payload],
        async () => await api.get(`/api/Smtp/GetByCompanyId/${companyId}`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );
    return { smtp: (data || {}).data || {}, isFetching, refetch, invalidate };
}

export function useCreateSmtp(onSuccess?: any, onError?: any) {
    const { mutate: createSmtp, error, isLoading: creating } = useMutation(
        ['createSmtp'],
        async (payload) => await api.post('/api/Smtp/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createSmtp, error, creating };
}

export function useUpdateSmtp(onSuccess?: any, onError?: any) {
    const { mutate: updateSmtp, error, isLoading: updating } = useMutation(
        ['updateSmtp'],
        async (payload) => await api.put('/api/Smtp/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateSmtp, error, updating };
}

export function useDeleteSmtp(onSuccess?: any, onError?: any) {
    const { mutate: deleteSmtp, error } = useMutation(
        ['deleteSmtp'],
        async (id) => await api.del(`/api/Smtp/Delete?Id=${id}`),
        {
            onError,
            onSuccess
        }
    );
    return { deleteSmtp, error };
}

export function useGetRuleCompliances(payload: any, enabled = true) {
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

export function useCreateRuleCompliance(onSuccess?: any, onError?: any) {
    const { mutate: createRuleCompliance, error, isLoading: creating } = useMutation(
        ['createRuleCompliance'],
        async (payload) => await api.post('/api/RuleComplianceDetail/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createRuleCompliance, error, creating };
}

export function useUpdateRuleCompliance(onSuccess?: any, onError?: any) {
    const { mutate: updateRuleCompliance, error, isLoading: updating } = useMutation(
        ['updateRuleCompliance'],
        async (payload) => await api.put('/api/RuleComplianceDetail/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateRuleCompliance, error, updating };
}

export function useDeleteRuleCompliance(onSuccess?: any, onError?: any) {
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

export function useStateRuleCompanyMappings(payload: any, enabled = true) {
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

export function useCreateStateRuleCompanyMapping(onSuccess?: any, onError?: any) {
    const { mutate: createStateRuleCompanyMapping, error, isLoading: creating } = useMutation(
        ['createStateRuleCompanyMapping'],
        async (payload: any) => await api.post('/api/Mappings/Add', payload),
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
export function useUpdateStateRuleMapping(onSuccess?: any, onError?: any) {
    const { mutate: updateStateRuleMapping, error, isLoading: updating } = useMutation(
        ['updateStateRuleMapping'],
        async (payload) => await api.post('/api/Mappings/UpdateActStateMapping', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateStateRuleMapping, error, updating };
}

export function useUploadActStateMappingTemplate(onSuccess?: any, onError?: any) {
    const { mutate: uploadActStateMappingTemplate, error, isLoading: uploading } = useMutation(
        ['uploadActStateMappingTemplate'],
        async ({ id, formData }: any) => await api.put(`/api/Mappings/UploadActStateMappingTemplate?id=${id}`, formData),
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

export function useDeleteActStateMapping(onSuccess?: any, onError?: any) {
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

export function useGetCompanyLocations(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['companyLocations', payload],
        async () => await api.post(`/api/Mappings/GetCompanyLocations`, payload || {}),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { locations: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateCompanyLocation(onSuccess?: any, onError?: any) {
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

export function useUpdateCompanyLocation(onSuccess?: any, onError?: any) {
    const { mutate: updateCompanyLocation, error, isLoading: updating } = useMutation(
        ['updateCompanyLocation'],
        async (payload) => await api.put('/api/Mappings/EditCompanyLocations', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateCompanyLocation, error, updating };
}

export function useDeleteCompanyLocation(onSuccess?: any, onError?: any) {
    const { mutate: deleteCompanyLocation, error, isLoading: deleting } = useMutation(
        ['deleteCompanyLocation'],
        async (id) => await api.del(`/api/Mappings/DeleteCompanyLocations?id=${id}`),
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

export function useGetUserCompanies(payload: any, enabled = true) {
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

export function useCreateUserLocationMapping(onSuccess?: any, onError?: any) {
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

export function useExportAuditSchedule(onSuccess?: any, onError?: any) {
    const { mutate: exportAuditSchedule, error, isLoading: exporting } = useMutation(
        ['exportAuditSchedule'],
        async (payload: any) => await api.post('/api/Company/ExportAuditSchedule', payload, null, true, { responseType: 'blob' }),
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

export function useImportAuditSchedule(onSuccess?: any, onError?: any) {
    const { mutate: importAuditSchedule, error, isLoading: uploading } = useMutation(
        ['importAuditSchedule'],
        async (formData: any) => await api.post(`/api/Company/ImportAuditSchedule`, formData, null, true, { responseType: 'blob' }),
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

export function useDeleteAuditSchedule(onSuccess?: any, onError?: any) {
    const { mutate: deleteAuditSchedule, error, isLoading: deleting } = useMutation(
        ['deleteAuditSchedule'],
        async (payload: any) => await api.post(`/api/ToDo/Delete`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteAuditSchedule, error, deleting };
}

export function useUpdateAuditSchedule(onSuccess?: any, onError?: any) {
    const { mutate: updateAuditSchedule, error, isLoading: updating } = useMutation(
        ['updateAuditSchedule'],
        async (payload: any) => await api.put(`/api/ToDo/Update`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateAuditSchedule, error, updating };
}

export function useBulkUpdateAuditSchedule(onSuccess?: any, onError?: any) {
    const { mutate: updateBulkAuditSchedule, error, isLoading: updating } = useMutation(
        ['updateBulkAuditSchedule'],
        async (payload) => await api.put(`/api/ToDo/BulkUpdate`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateBulkAuditSchedule, error, updating };
}

