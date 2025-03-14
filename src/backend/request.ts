import axios from "axios";
import { getAuthToken } from "./auth";

function getBaseURL() {
    const { protocol, hostname } = window.location;

    //for apiprod
const api_url = hostname.includes('uat') ? `apiprod.ezycomp.com`: 'apiprod.ezycomp.com';

     //for apiproduat
     //const api_url = hostname.includes('uat') ? `apiproduat.ezycomp.com`: 'apiproduat.ezycomp.com';

  //for api
    //const api_url = hostname.includes('uat') ? `apiprouat.ezycomp.com`: 'apiprouat.ezycomp.com';

    //for apiuat
    
    //const api_url = hostname.includes('uat') ? `apiprouat.ezycomp.com`: 'apiprouat.ezycomp.com';

    //const api_url = "https://localhost:7221/";
    // const api_url = 'apiprouat.ezycomp.com'
    return `${hostname === 'localhost' ? 'https:' : protocol}//${api_url}`;
}

export function getChartsBaseUrl() {
    const { protocol, hostname } = window.location;

    //for apiproduat
    //const api_url = hostname.includes('uat') ? `apichartproduat.ezycomp.com`: 'apichartproduat.ezycomp.com';

    //for apiprod
     const api_url = hostname.includes('uat') ? `apichartprod.ezycomp.com`: 'apichartprod.ezycomp.com';

     //forapi
     //const api_url = hostname.includes('uat') ? `apichart.ezycomp.com`: 'apichart.ezycomp.com';

     //for apiuat
     //const api_url = hostname.includes('uat') ? `apichartuat.ezycomp.com`: 'apichartuat.ezycomp.com';

    // const api_url = 'apichartuat.ezycomp.com'
    //const api_url = "https://localhost:7221/";
    return `${hostname === 'localhost' ? 'https:' : protocol}//${api_url}`;
}

const apiInstance = axios.create({
    baseURL: ''
});

apiInstance.interceptors.response.use(
    response => response,
    error => error
);

function getHeaders(headers = {}): any {
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

function getQueryString(payload: any) {
    const keys = Object.keys(payload);
    const queries: any[] = [];
    keys.forEach(key => {
        const value = payload[key];
        if (typeof value !== undefined) {
            queries.push(`${key}=${value}`);
        }
    });
    return queries.join('&');
}

export function get(url: string, payload?: any, config?: any, others?: any) {
    if (Object.keys(payload || {}).length > 0) {
        url = `${url}?${getQueryString(payload)}`
    }
    const _url = url.indexOf('http') === 0 ? url : `${getBaseURL()}${url}`;
    return apiInstance.get(_url, { headers: getHeaders(config), ...others });
}

export function post(url: string, payload: any, config?: any, sendHeaders = true, others?: any) {
    const _url = url.indexOf('http') === 0 ? url : `${getBaseURL()}${url}`;
    return apiInstance.post(_url, payload, sendHeaders ? { headers: getHeaders(config), ...others } : null);
}

export function put(url: string, payload?: any, config?: any, sendHeaders = true) {
    const _url = url.indexOf('http') === 0 ? url : `${getBaseURL()}${url}`;
    return apiInstance.put(_url, payload, sendHeaders ? { headers: getHeaders(config) } : undefined);
}

export function del(url: string, payload?: any, config?: any, sendHeaders = true) {
    const _url = url.indexOf('http') === 0 ? url : `${getBaseURL()}${url}`;
    return apiInstance.delete(_url, { headers: getHeaders(config) });
}
