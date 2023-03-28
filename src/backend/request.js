import axios from "axios";
import { getAuthToken } from "./auth";

const apiInstance = axios.create({
    baseURL: 'https://ezycompapi.azurewebsites.net/'
});

apiInstance.interceptors.response.use(
    response => response,
    error => error
);

function getHeaders(headers) {
    const authToken = getAuthToken();
    if (authToken) {
        return {
            ...headers,
            Authorization: `bearer ${authToken}`
        }
    } else {
        return headers;
    }
}

export function get(url) {
    return apiInstance.get(url, { headers: getHeaders() });
}

export function post(url, payload, sendHeaders = true) {
    return apiInstance.post(url, payload, sendHeaders ? { headers: getHeaders() } : null);
}

export function del(url, payload, sendHeaders = true) {
    return apiInstance.delete(url, { headers: getHeaders() });
}
