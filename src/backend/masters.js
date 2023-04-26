import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "./request";

export function useGetActs() {
    const { data, isFetching, refetch } = useQuery(
        ['acts'],
        async () => await api.get(`/api/Act/GetAll`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    return { acts: (data || {}).data || [], isFetching, refetch };
}

export function useGetActivities() {
    const { data, isFetching, refetch } = useQuery(
        ['activities'],
        async () => await api.get(`/api/Activity/GetAll`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    return { activities: (data || {}).data || [], isFetching, refetch };
}

export function useGetRules() {
    const { data, isFetching, refetch } = useQuery(
        ['rules'],
        async () => await api.get(`/api/Rule/GetAll`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    return { rules: (data || {}).data || [], isFetching, refetch };
}

export function useGetStates() {
    const { data, isFetching, refetch } = useQuery(
        ['states'],
        async () => await api.get(`/api/State/GetAll`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    return { states: (data || {}).data || [], isFetching, refetch };
}

export function useGetCities() {
    const { data, isFetching, refetch } = useQuery(
        ['cities'],
        async () => await api.get(`/api/City/GetAll`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    return { cities: (data || {}).data || [], isFetching, refetch };
}

export function useGetLocations() {
    const { data, isFetching, refetch } = useQuery(
        ['locations'],
        async () => await api.get(`/api/Location/GetAll`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
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