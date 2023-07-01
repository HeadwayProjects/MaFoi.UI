import { useMutation, useQuery } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { get, post } from "./request";

export function getAuthToken() {
    return sessionStorage.getItem('auth-token') || null;
}

export function setAuthToken(token: string) {
    sessionStorage.setItem('auth-token', token);
}

export function clearAuthToken() {
    sessionStorage.removeItem('auth-token');
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