import { useMutation } from "@tanstack/react-query";
import { post } from "./request";

export function useAuditReport(onSuccess, onError) {
    const { mutate: auditReport, error, isLoading: exporting } = useMutation(
        ['auditReport'],
        async (payload) => await post('/api/Auditor/GetAuditReport', payload, null, true, { responseType: 'blob' }),
        {
            onError,
            onSuccess: (response) => {
                const data = (response || {});
                onSuccess(data);
            }
        }
    );
    return { auditReport, error, exporting };
}