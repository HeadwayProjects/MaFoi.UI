import { useMutation, useQuery } from "@tanstack/react-query";
import { del, get, post, put } from "./request";

const NOTIFICATION_BASE_URL = '/api/Notification';

export function useGetAllNotificationTemplateTypes(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['notificationTemplateTypes', payload],
        async () => await get(`${NOTIFICATION_BASE_URL}/GetAllTemplateTypes`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );
    return { templateTypes: (data || {}).data, isFetching, refetch };
}

export function useGetAllTemplates(payload: any, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['notificationTemplates', payload],
        async () => await post(`${NOTIFICATION_BASE_URL}/GetAllTemplates`, payload),
        {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { templates: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}


export function useCreateNotificationTemplate(onSuccess?: any, onError?: any) {
    const { mutate: createNotificationTemplate, error, isLoading: creating } = useMutation(
        ['createNotificationTemplate'],
        async (payload: any) => await post(`${NOTIFICATION_BASE_URL}/CreateTemplate`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createNotificationTemplate, error, creating };
}

export function useUpdateNotificationTemplate(onSuccess?: any, onError?: any) {
    const { mutate: updateNotificationTemplate, error, isLoading: updating } = useMutation(
        ['updateNotificationTemplate'],
        async (payload) => await put(`${NOTIFICATION_BASE_URL}/UpdateTemplate`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateNotificationTemplate, error, updating };
}

export function useDeleteNotificationTemplate(onSuccess?: any, onError?: any) {
    const { mutate: deleteNotificationTemplate, error, isLoading: deleting } = useMutation(
        ['deleteNotificationTemplate'],
        async (id) => await del(`${NOTIFICATION_BASE_URL}/DeleteTemplate?Id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteNotificationTemplate, error, deleting };
}