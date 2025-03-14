import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./request";
import { log } from "node:console";
import { IVendor } from "../models/vendor";

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


export function useImporvendortLocations(onSuccess?: any, onError?: any) {
    const { mutate: importvendorLocations, error, isLoading: uploading } = useMutation(
        ['importvendorLocations'],
        async ({ CID, ACID, locationId, formData }: any) => await api.post(`/api/Mappings/BulkImportVendorLocationsMappings?companyId=${CID}&associateCompanyId=${ACID}&locationId=${locationId}`, formData, null, true, { responseType: 'blob' }),

        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { importvendorLocations, error, uploading };
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



export function useGetVendorCompanies(payload: any, enabled = true) {
    const queryClient = useQueryClient();
    function invalidate() {
        queryClient.invalidateQueries(['Vendorcompanies', payload])
    }
    const { data, isFetching, refetch } = useQuery(
        ['Vendorcompanies', payload],
        async () => await api.post(`/api/Company/GetUserVendorCompanies`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { Vendorcompanies: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch, invalidate };
}


export function useGetUserVendorsCompanies(enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['userVendorsCompanies'],
        async () => await api.get('/api/Company/GetUserVendorCompanies'),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { userVendorsCompanies: (data || {}).data || [], isFetching, refetch };
}


export function useGetVendorAssociateCompanies(id: any) {
    const { data, isFetching, refetch } = useQuery(
        ['userVendorsAsscoiateCompanies', id],
        async () => {
            const response = await api.get(`/api/Company/GetUserVendorAssociateCompanies?companyId=${id}`);
            console.log(response, "Response from API");
            return response.data;
        },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );

    return {
        userVendorsAsscoiateCompanies: (data || {}) || [],
        isFetching,
        refetch,
    };
}



export function useGetVendorLocations(cid: any, asid: any) {
    const { data, isFetching, refetch } = useQuery(
        ['VendorLocations', cid, asid],
        async () => {
            const response = await api.get(`/api/Company/GetUserVendorLocations?companyId=${cid}&associateCompanyId=${asid}`);
            return response.data;
        },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!cid && !!asid
        }
    );

    return {
        VendorLocations: (data || {}) || [],
        isFetching,
        refetch
    };
}


export function useGetVendorCategoriresCompanies(cid: any, asid: any, lid: string) {
    // console.log(cid,"dcid",asid,"asid",lid,"lid");


    const { data, isFetching, refetch } = useQuery(
        ['VendorCategories', cid, asid, lid],
        async () => await api.get(`/api/Company/GetUserVendorCategories?companyId=${cid}&associateCompanyId=${asid}&locationId=${lid}`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!cid && !!asid && !!lid
        }
    );

    return {
        VendorCategories: (data || {}).data || [],
        isFetching,
        refetch
    };
}

export function useGetVendor(cid: any, asid: any, lid: any, vid: any) {
    const { data, isFetching, refetch } = useQuery(
        ['Getvendors', cid, asid, lid, vid],
        async () => await api.get(`/api/Company/GetUserVendorsByCategoryId?companyId=${cid}&associateCompanyId=${asid}&locationId=${lid}&vendorCategoryId=${vid}`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!cid && !!asid && !!lid && !!vid
        }
    );

    return {
        Getvendors: (data || {}).data || [],
        isFetching,
        refetch
    };
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
            enabled: enabled && !!companyId
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

export async function getRuleMappings(payload: any) {
    const response = await api.post(`/api/Mappings/GetActStateList`, payload);
    return (response || {}).data || {};
}

export function useGetRuleMappings(payload: any, enabled = true) {
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

export function useCreateRuleMapping(onSuccess?: any, onError?: any) {
    const { mutate: createRuleMapping, error, isLoading: creating } = useMutation(
        ['createRuleMapping'],
        async (payload: any) => await api.post('/api/Mappings/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createRuleMapping, error, creating };
}
export function useUpdateRuleMapping(onSuccess?: any, onError?: any) {
    const { mutate: updateRuleMapping, error, isLoading: updating } = useMutation(
        ['updateRuleMapping'],
        async (payload) => await api.post('/api/Mappings/UpdateActStateMapping', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateRuleMapping, error, updating };
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

export function useDeleteActStateMappingForm(onSuccess?: any, onError?: any) {
    const { mutate: deleteActStateMappingForm, error, isLoading: deleting } = useMutation(
        ['deleteActStateMappingForm'],
        async (id: any) => await api.del(`/api/ActStateMapping/DeleteForm?id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteActStateMappingForm, error, deleting };
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

export function useImportMappings(onSuccess?: any, onError?: any) {
    const { mutate: importMappings, error, isLoading: uploading } = useMutation(
        ['importMappings'],
        async ({ formData }: any) => await api.post('/api/Mappings/BulkActStateMapping', formData, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { importMappings, error, uploading };
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
        async (payload) => await api.post('/api/Mappings/AddCompanyLocationDetails', payload),
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

export function useUploadLocationMappingDigitalSign(onSuccess?: any, onError?: any) {
    const { mutate: uploadDigitalSign, error, isLoading: uploading } = useMutation(
        ['uploadDigitalSign'],
        async ({ id, formData }: any) => await api.put(`/api/Mappings/UploadLogo?id=${id}`, formData),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { uploadDigitalSign, error, uploading };
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

export function useGetVerticals(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['verticals', payload],
        async () => await api.post(`/api/Vertical/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return {
        verticals: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch
    };
}

export function useCreateVertical(onSuccess?: any, onError?: any) {
    const { mutate: createVertical, error, isLoading } = useMutation<any>(
        ['createVertical'],
        async (payload) => await api.post('/api/Vertical/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createVertical, error, creating: isLoading };
}

export function useUpdateVertical(onSuccess?: any, onError?: any) {
    const { mutate: updateVertical, error, isLoading } = useMutation(
        ['updateVertical'],
        async (payload) => await api.put('/api/Vertical/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateVertical, error, updating: isLoading };
}

export function useDeleteVertical(onSuccess?: any, onError?: any) {
    const { mutate: deleteVertical, error, isLoading } = useMutation(
        ['deleteVertical'],
        async (id) => await api.del(`/api/Vertical/Delete?id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteVertical, error, deleting: isLoading };
}

export function useGetDepartments(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['departments', payload],
        async () => await api.post(`/api/Department/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return {
        departments: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch
    };
}

export function useCreateDepartment(onSuccess?: any, onError?: any) {
    const { mutate: createDepartment, error, isLoading } = useMutation(
        ['createDepartment'],
        async (payload) => await api.post('/api/Department/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createDepartment, error, creating: isLoading };
}

export function useUpdateDepartment(onSuccess?: any, onError?: any) {
    const { mutate: updateDepartment, error, isLoading } = useMutation(
        ['updateDepartment'],
        async (payload) => await api.put('/api/Department/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateDepartment, error, updating: isLoading };
}

export function useDeleteDepartment(onSuccess?: any, onError?: any) {
    const { mutate: deleteDepartment, error, isLoading } = useMutation(
        ['deleteDepartment'],
        async (id) => await api.del(`/api/Department/Delete?id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteDepartment, error, deleting: isLoading };
}

export function useGetEscalationMatrix(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['escalationMatrix', payload],
        async () => await api.post(`/api/EscalationMatrix/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return {
        matrixList: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch
    };
}

export function useCreateEscalationMatrix(onSuccess?: any, onError?: any) {
    const { mutate: createMatrix, error, isLoading } = useMutation(
        ['createMatrix'],
        async (payload) => await api.post('/api/EscalationMatrix/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createMatrix, error, creating: isLoading };
}

export function useUpdateEscalationMatrix(onSuccess?: any, onError?: any) {
    const { mutate: updateMatrix, error, isLoading } = useMutation(
        ['updateMatrix'],
        async (payload) => await api.put('/api/EscalationMatrix/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateMatrix, error, updating: isLoading };
}

export function useDeleteEscalationMatrix(onSuccess?: any, onError?: any) {
    const { mutate: deleteMatrix, error, isLoading } = useMutation(
        ['deleteMatrix'],
        async (id) => await api.del(`/api/EscalationMatrix/Delete?id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteMatrix, error, deleting: isLoading };
}

export function useGetDepartmentUserMappings(payload: any, enabled = true) {
    const { data, isFetching, refetch }: any = useQuery(
        ['departmentUsers', payload],
        async () => await api.post(`/api/UserDepartmentMap/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );
    return {
        departmentUsers: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch
    };
}

export function useCreateDepartmentUserMapping(onSuccess?: any, onError?: any) {
    const { mutate: createDepartmentUserMapping, error, isLoading } = useMutation(
        ['createDepartmentUserMapping'],
        async (payload) => await api.post('/api/UserDepartmentMap/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createDepartmentUserMapping, error, creating: isLoading };
}

export function useUpdateDepartmentUserMapping(onSuccess?: any, onError?: any) {
    const { mutate: updateDepartmentUserMapping, error, isLoading } = useMutation(
        ['updateDepartmentUserMapping'],
        async (payload) => await api.put('/api/UserDepartmentMap/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateDepartmentUserMapping, error, updating: isLoading };
}

export function useDeleteDepartmentUserMapping(onSuccess?: any, onError?: any) {
    const { mutate: deleteDepartmentUserMapping, error, isLoading } = useMutation(
        ['deleteDepartmentUserMapping'],
        async (id) => await api.del(`/api/UserDepartmentMap/Delete?id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteDepartmentUserMapping, error, deleting: isLoading };
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


export function useGetAllNotifications(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['notifications', payload],
        async () => await api.post(`/api/Mappings/GetNotifications`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );
    return {
        notifications: ((data || {}).data || {}).list || [],
        total: ((data || {}).data || {}).count || 0,
        counts: ((data || {}).data || {}).notificationcounts || {},
        isFetching, refetch
    };
}

export function useUpdateNotificationStatus(payload: any, enabled = false) {
    const { data, isFetching, refetch } = useQuery(
        ['updateStatus', payload],
        async () => await api.post(`/api/Mappings/UpdateNotificationStatus`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );
    return { data: (data || {}).data, isFetching };
}


export function useGetVendorCategories(payload: any) {
    const { data, isFetching, refetch } = useQuery(
        ['vendorCategories', payload],
        async () => await api.post(`/api/VendorCategories/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );
    return { vendorCategories: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateVendorCategory(onSuccess?: any, onError?: any) {
    const { mutate: createVendorCategory, error, isLoading: creating } = useMutation(
        ['createVendorCategory'],
        async (payload) => await api.post('/api/VendorCategories/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createVendorCategory, error, creating };
}

export function useUpdateVendorCategory(onSuccess?: any, onError?: any) {
    const { mutate: updateVendorCategory, error, isLoading: updating } = useMutation(
        ['updateVendorCategory'],
        async (payload) => await api.put('/api/VendorCategories/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateVendorCategory, error, updating };
}

export function useGetVendors(payload: any, enabled = true) {
    const queryClient = useQueryClient();
    function invalidate() {
        queryClient.invalidateQueries(['vendors', payload])
    }
    const { data, isFetching, refetch } = useQuery(
        ['vendors', payload],
        async () => await api.post(`/api/VendorDetails/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { vendors: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch, invalidate };
}
export function useCreateVendor(onSuccess?: any, onError?: any) {
    const { mutate: createVendor, error, isLoading: creating } = useMutation(
        ['createVendor'],
        async (payload) => await api.post('/api/VendorDetails/Add', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createVendor, error, creating };
}

export function useUpdateVendor(onSuccess?: any, onError?: any) {
    const { mutate: updateVendor, error, isLoading: updating } = useMutation(
        ['updateVendor'],
        async (payload: any) => await api.put('/api/VendorDetails/Update', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateVendor, error, updating };
}


export function useGetCompanyVendorLocations(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['vendorLocations', payload],

        async () => await api.post(`/api/Mappings/GetAllVedorLocationMapping`, payload || {}),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );
    return { vendorLocations: ((data || {}).data || {}).mappingList || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateVendorLocation(onSuccess?: any, onError?: any) {
    const { mutate: createVendorLocationMapping, error, isLoading: creating } = useMutation(
        ['createVendorLocationMapping'],
        async (payload) => await api.post('/api/Mappings/AddVendorMappings', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );

    return { createVendorLocationMapping, error, creating };
}

export function useUpdateVendorLocation(onSuccess?: any, onError?: any) {
    const { mutate: updateVendorLocationMapping, error, isLoading: updating } = useMutation(
        ['updateVendorLocationMapping'],
        async (payload) => await api.post('/api/Mappings/UpdateVendorLocationMapping', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    console.log('updateeeeeeeeee', updating);

    return { updateVendorLocationMapping, error, updating };
}

export function useGetUserVendorLocation(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['userCompanies', payload],
        async () => await api.get(`/api/Company/GetUserVendorsById`, payload || {}),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { userCompanies: (data || {}).data || [], isFetching, refetch };
}

export function useCreateUserVendorLocationMapping(onSuccess?: any, onError?: any) {
    const { mutate: createUserVendorLocationMapping, error, isLoading: creating } = useMutation(
        ['createUserVendorLocationMapping'],
        async (payload) => await api.post('/api/Mappings/AddUserVendorLocation', payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createUserVendorLocationMapping, error, creating };
}
/**
 * Vendor Audit Schedule
 */
export function useExportVendorAuditSchedule(onSuccess?: any, onError?: any) {
    const { mutate: exportVendorAuditSchedule, error, isLoading: exporting } = useMutation(
        ['exportVendorAuditSchedule'],
        async (payload: any) => await api.post('/api/VendorDetails/ExportAuditScheduleVendor', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { exportVendorAuditSchedule, error, exporting };
}

export function useImportVendorAuditSchedule(onSuccess?: any, onError?: any) {
    const { mutate: importVendorAuditSchedule, error, isLoading: uploading } = useMutation(
        ['importVendorAuditSchedule'],
        async (formData: any) => await api.post(`/api/VendorDetails/ImportAuditScheduleVendor`, formData, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { importVendorAuditSchedule, error, uploading };
}

export function useDeleteVendorAuditSchedule(onSuccess?: any, onError?: any) {
    const { mutate: deleteAuditSchedule, error, isLoading: deleting } = useMutation(
        ['deleteAuditSchedule'],
        async (payload: any) => await api.put(`/api/ToDoVendor/Delete`, payload),
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

export function useUpdateVendorAuditSchedule(onSuccess?: any, onError?: any) {
    const { mutate: updateAuditSchedule, error, isLoading: updating } = useMutation(
        ['updateAuditSchedule'],
        async (payload: any) => await api.put(`/api/ToDoVendor/Update`, payload),
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

export function useBulkUpdateVendorAuditSchedule(onSuccess?: any, onError?: any) {
    const { mutate: updateBulkAuditSchedule, error, isLoading: updating } = useMutation(
        ['updateBulkAuditSchedule'],
        async (payload) => await api.put(`/api/ToDoVendor/BulkUpdate`, payload),
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

