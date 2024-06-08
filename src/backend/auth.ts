import { useMutation, useQuery } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { get, post } from "./request";
import { Storage } from "./storage";
import { API_DELIMITER } from "../utils/constants";
import { USER_PRIVILEGES } from "../components/pages/UserManagement/Roles/RoleConfiguration";

const AUTH_TOKEN = 'auth-token';
const USER_PRIVILEGES_KEY = 'user-privileges';
const USER_ROLE = 'user-role';

export function getAuthToken() {
    return Storage.getValue(AUTH_TOKEN);
}

export function getUserPrivileges() {
    const userPrivileges = Storage.getValue(USER_PRIVILEGES_KEY) || '';
    return userPrivileges.split(API_DELIMITER);
}

export function setUserRole(role: string, privileges: string) {
    Storage.setValue(USER_ROLE, role);
    Storage.setValue(USER_PRIVILEGES_KEY, privileges);
}

export function getUserRole() {
    return Storage.getValue(USER_ROLE) || '';
}

export function setAuthToken(token: string) {
    Storage.setValue(AUTH_TOKEN, token);
}

export function clearAuthToken() {
    Storage.removeValue([AUTH_TOKEN]);
}

export function setUserSession(token: string, privileges: string, role: string) {
    Storage.setValue(AUTH_TOKEN, token);
    setUserRole(role, privileges);
}

export function clearUserSession() {
    Storage.removeValue([AUTH_TOKEN, USER_PRIVILEGES_KEY, USER_ROLE]);
}

export function getUserDetails(_token = ''): any {
    const token = getAuthToken();
    return parseToken(token || _token);
}

export function parseToken(token: string): any {
    if (token) {
        try {
            return jwtDecode(token);
        } catch (e) {
            return null;
        }
    }
    return null;
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
    const privileges = (Storage.getValue(USER_PRIVILEGES_KEY) || '').split(API_DELIMITER);
    return privileges.includes(key);
}

export function isAdmin() {
    return !hasUserAccess(USER_PRIVILEGES.SUBMITTER_DASHBOARD)
        && !hasUserAccess(USER_PRIVILEGES.REVIEWER_DASHBOARD)
        && !hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD)
        && !hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD)
        && !hasUserAccess(USER_PRIVILEGES.ESCALATION_DASHBOARD)
}

export function isComplianceUser() {
    return hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD)
        || hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD);
}