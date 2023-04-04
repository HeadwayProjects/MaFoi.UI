import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./request";

export function useGetUserCompanies() {
    const { data, isFetching } = useQuery(
        ['userCompanies'],
        async () => await api.get('/api/Company/GetUserCompanies'),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    return { userCompanies: (data || {}).data || [], isFetching };
}

export function useGetActivityDocuments(activityId) {
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