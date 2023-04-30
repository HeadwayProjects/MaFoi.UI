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

function getQueryString(payload) {
    const keys = Object.keys(payload);
    const queries = [];
    keys.forEach(key => {
        const value = payload[key];
        if (typeof value !== undefined) {
            queries.push(`${key}=${value}`);
        }
    });
    return queries.join('&');
}

export function get(url, payload, config) {
    if (Object.keys(payload || {}).length > 0) {
        url = `${url}?${getQueryString(payload)}`
    }
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
