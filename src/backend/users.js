import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "./request";


const USERS = '/api/UserManagement';

export function useGetUsers(payload, enabled = true) {
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
export function useGetUserRoles(payload, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['userRoles', payload],
        async () => await api.get(`${USERS}/GetAllRoles`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );
    return { roles: (data || {}).data || [], isFetching, refetch };
}

export function useCreateUser(onSuccess, onError) {
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

export function useUpdateUser(onSuccess, onError) {
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

export function useDeleteUser(onSuccess, onError) {
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