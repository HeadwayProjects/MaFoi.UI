import { useQuery } from "@tanstack/react-query";
import * as api from "./request";

export function useGetAuditorLimeStatus(userId) {
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

export function useGetAuditorPerformance(userId, frequency) {
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