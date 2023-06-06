import { useMutation, useQuery } from "@tanstack/react-query";
import { del, get, post, put } from "./request";

const EMAIL_TEMPLATES = '/api/EmailTemplates';

export function useGetAllEmailTemplateTypes(payload, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['emailTemplateTypes', payload],
        async () => await get(`${EMAIL_TEMPLATES}/GetAllTemplateTypes`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );
    return { templateTypes: (data || {}).data, total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useGetAllTemplates(payload, enabled = true) {
    const { data, isFetching, refetch } = useQuery(
        ['templates', payload],
        async () => await post(`${EMAIL_TEMPLATES}/GetAll`, payload),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled
        }
    );

    return { templates: ((data || {}).data || {}).list || [], total: ((data || {}).data || {}).count || 0, isFetching, refetch };
}

export function useCreateEmailTemplate(onSuccess, onError) {
    const { mutate: createEmailTemplate, error, isLoading: creating } = useMutation(
        ['createEmailTemplate'],
        async (payload) => await post(`${EMAIL_TEMPLATES}/Add`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { createEmailTemplate, error, creating };
}

export function useUpdateEmailTemplate(onSuccess, onError) {
    const { mutate: updateEmailTemplate, error, isLoading: updating } = useMutation(
        ['updateEmailTemplate'],
        async (payload) => await put(`${EMAIL_TEMPLATES}/Update`, payload),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { updateEmailTemplate, error, updating };
}

export function useDeleteEmailTemplate(onSuccess, onError) {
    const { mutate: deleteEmailTemplate, error, isLoading: deleting } = useMutation(
        ['deleteEmailTemplate'],
        async (id) => await del(`${EMAIL_TEMPLATES}/Delete?Id=${id}`),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {}).data || {};
                onSuccess(data);
            }
        }
    );
    return { deleteEmailTemplate, error, deleting };
}
