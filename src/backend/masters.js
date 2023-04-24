import { useQuery } from "@tanstack/react-query";
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