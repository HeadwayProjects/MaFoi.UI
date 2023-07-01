import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./request";

export function useGetUserCompanies() {
    const { data, isFetching, refetch } = useQuery(
        ['userCompanies'],
        async () => await api.get('/api/Company/GetUserCompanies'),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    return { userCompanies: (data || {}).data || [], isFetching, refetch };
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