import axios from "axios";
import { getAuthToken } from "./auth";

const apiInstance = axios.create({
    baseURL: 'https://ezycompapi.azurewebsites.net/'
});

apiInstance.interceptors.response.use(
    response => response,
    error => error
);

function getHeaders(headers = {}) {
    const authToken = getAuthToken();
    if (authToken) {
        return {
            Authorization: `bearer ${authToken}`,
            ...headers
        }
    } else {
        return headers;
    }
}

export function get(url, config) {
    return apiInstance.get(url, { headers: getHeaders(config) });
}

export function post(url, payload, config, sendHeaders = true) {
    return apiInstance.post(url, payload, sendHeaders ? { headers: getHeaders(config) } : null);
}

export function put(url, payload, config, sendHeaders = true) {
    return apiInstance.put(url, payload, sendHeaders ? { headers: getHeaders(config) } : null);
}

export function del(url, payload, config, sendHeaders = true) {
    return apiInstance.delete(url, { headers: getHeaders(config) });
}
