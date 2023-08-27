import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "./request";


const USERS = '/api/UserManagement';

export function useGetUsers(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['users', payload],
        async () => await api.post(`${USERS}/GetAllUsers`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );
    return { users: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}
export function useGetUserRoles(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['userRoles', payload],
        async () => await api.post(`${USERS}/GetAllRoles`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );
    return { roles: (data || {}).data || [], isFetching, refetch };
}

export function useCreateUser(onSuccess?: any, onError?: any) {
    const { mutate: createUser, error, isLoading: creating } = useMutation(
        ['createUser'],
        async (payload) => await api.post(`${USERS}/CreateUser`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createUser, error, creating };
}

export function useUpdateUser(onSuccess?: any, onError?: any) {
    const { mutate: updateUser, error, isLoading: updating } = useMutation(
        ['updateUser'],
        async (payload) => await api.put(`${USERS}/EditUser`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateUser, error, updating };
}

export function useDeleteUser(onSuccess?: any, onError?: any) {
    const { mutate: deleteUser, error, isLoading: deleting } = useMutation(
        ['deleteUser'],
        async (id) => await api.del(`${USERS}/DeleteUser?id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteUser, error, deleting };
}

export function useGetCompanyUsers(companyId: any) {
    const { data, isFetching, refetch } = useQuery(
        ['companyUsers', companyId],
        async () => await api.get(`/api/Mappings/GetUsersByCompany`, { companyId }),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: Boolean(companyId)
        }
    );
    return { companyUsers: (data || {}).data || [], isFetching, refetch };
}
export function useCreateRole(onSuccess?: any, onError?: any) {
    const { mutate: createRole, error, isLoading: creating } = useMutation(
        ['createRole'],
        async (payload) => await api.post(`${USERS}/CreateRole`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createRole, error, creating };
}

export function useUpdateRole(onSuccess?: any, onError?: any) {
    const { mutate: updateRole, error, isLoading: updating } = useMutation(
        ['updateRole'],
        async (payload) => await api.put(`${USERS}/EditRole`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateRole, error, updating };
}

export function useDeleteRole(onSuccess?: any, onError?: any) {
    const { mutate: deleteRole, error, isLoading: deleting } = useMutation(
        ['deleteRole'],
        async (id) => await api.del(`${USERS}/DeleteRole?id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteRole, error, deleting };
}