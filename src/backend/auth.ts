import { useMutation, useQuery } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { get, post } from "./request";
import { Storage } from "./storage";
import { API_DELIMITER } from "../utils/constants";

const AUTH_TOKEN = 'auth-token';
const USER_PRIVILEGES = 'user-privileges';

export function getAuthToken() {
    return Storage.getValue(AUTH_TOKEN);
}

export function setAuthToken(token: string) {
    Storage.setValue(AUTH_TOKEN, token);
}

export function clearAuthToken() {
    Storage.removeValue([AUTH_TOKEN]);
}

export function setUserSession(token: string, privileges: string) {
    Storage.setValue(AUTH_TOKEN, token);
    Storage.setValue(USER_PRIVILEGES, privileges);
}

export function clearUserSession() {
    Storage.removeValue([AUTH_TOKEN, USER_PRIVILEGES]);
}

export function getUserDetails(_token = ''): any {
    const token = getAuthToken();
    if (token || _token) {
        try {
            return jwtDecode(token || _token);
        } catch (e) {
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

export function useUserLogin(onSuccess?: any, onError?: any) {
    const { mutate: userLogin, error, isLoading } = useMutation(
        ['userLogin'],
        async ({ username, password }: any) => await post(`/api/Auth/Login?username=${username}&password=${password}`, {}, null, false),
        {
            onError,
            onSuccess: (response) => {
                onSuccess((response || {}).data)
            }
        }
    );
    return { userLogin, error, isLoading };
}

export function useValidateToken(token: string) {
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

export function useValidateUrl(token: string) {
    const { data, isFetching } = useQuery(
        ['validateUrl', token],
        async () => await get(`/api/Auth/IsLinkExpired?token=${token}`),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!token
        }
    );
    return { status: (data || {}).data || {}, isFetching };
}

export function useChangePassword(onSuccess?: any, onError?: any) {
    const { mutate: changePassword, error } = useMutation(
        ['changePassword'],
        async ({ username, oldPassword, newPassword, token }: any) => {
            const url = `/api/Auth/ChangePassword?username=${username}&oldPassword=${oldPassword || ''}&newPassword=${newPassword}`;
            const _response = await post(url, {}, { Authorization: token });
            return _response
        },
        {
            onError,
            onSuccess: (response) => {
                onSuccess((response || {}).data || {})
            }
        }
    );
    return { changePassword, error };
}

export function useForgotPassword(onSuccess?: any, onError?: any) {
    const { mutate: forgotPassword, error } = useMutation(
        ['forgotPassword'],
        async ({ username }: any) => await get(`/api/Auth/ForgotPassword?username=${username}`),
        {
            onError,
            onSuccess: (response) => {
                onSuccess((response || {}).data || {})
            }
        }
    );
    return { forgotPassword, error };
}

export function useGenerateOTP(onSuccess?: any, onError?: any) {
    const { mutate: generateOTP, error, isLoading } = useMutation(
        ['generateOTP'],
        async ({ username }: any) => await get(`/api/Auth/GenerateOTP?username=${username}`),
        {
            onError,
            onSuccess: (response) => {
                onSuccess((response || {}).data || {})
            }
        }
    );
    return { generateOTP, error, isLoading };
}

export function useLoginWithOtp(onSuccess?: any, onError?: any) {
    const { mutate: loginWithOtp, error, isLoading } = useMutation(
        ['updateLocation'],
        async ({ username, otp, token }: any) => await post(`/api/Auth/LoginWithOtp?username=${username}&loginOtp=${otp}`, {}, { Authorization: token }),
        {
            onError,
            onSuccess: (response) => {
                onSuccess((response || {}).data || {})
            }
        }
    );
    return { loginWithOtp, error, isLoading };
}

export function hasUserAccess(key: string) {
    const privileges = (Storage.getValue(USER_PRIVILEGES) || '').split(API_DELIMITER);
    return privileges.includes(key);
}