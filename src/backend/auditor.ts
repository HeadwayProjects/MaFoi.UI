import { useQuery } from "@tanstack/react-query";
import * as api from "./request";

export function useGetAuditorLimeStatus(userId: string) {
    const { data, isFetching } = useQuery(
        ['auditorLimeStatus', userId],
        async () => await api.get(`/api/Auditor/GetAuditorDashboard?auditorId=${userId}`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!userId
        }
    );

    return { limeStatus: (data || {}).data || {}, isFetching };
}

export function useGetAuditorPerformance(userId: string, frequency: any) {
    const { data, isFetching } = useQuery(
        ['auditorPerformance', userId, frequency],
        async () => await api.get(`/api/Auditor/GetPerformance?auditorId=${userId}&frequency=${frequency}`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!userId && typeof frequency !== 'undefined'
        }
    );

    return { auditorPerformance: (data || {}).data || {}, isFetching };
}

export function useGetAuditorActivites(payload: any) {
    const { data, isFetching, refetch } = useQuery(
        ['auditorActivities', payload],
        async () => await api.post('/api/ToDo/GetToDoByCriteria', payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!payload
        }
    );

    return { activities: (data || {}).data || [], isFetching, refetch };
}