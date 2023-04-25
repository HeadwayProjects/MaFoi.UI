import { useQuery } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { get } from "./request";

export function getAuthToken() {
    return sessionStorage.getItem('auth-token') || null;
}

export function setAuthToken(token) {
    sessionStorage.setItem('auth-token', token);
}

export function clearAuthToken() {
    sessionStorage.removeItem('auth-token');
}

export function getUserDetails(_token) {
    const token = getAuthToken();
    if (token || _token) {
        try {
            return jwtDecode(token || _token);
        } catch(e) {
            return null;
        }
    }
    return null;
}

export function isVendor() {
    const user = getUserDetails();
    if (user) {
        try {
            return user.role.toLowerCase().includes('vendor');
        } catch (e) {
            return false;
        }
    }
    return false;
}

export function useValidateToken(token) {
    const { data, isFetching } = useQuery(
        ['validateToken', token],
        async () => await get(`/api/Auth/IsValidToken?token=${token}`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!token
        }
    );

    return { status: (data || {}).data || {}, isFetching };
}