import { API_BASE_URL, SUB_URL, keycloak_URL } from "../../../common/config";
import { API_ENDPOINTS } from "../../../services/apiEndPoints";
import Request, { KeycloakRequest } from "../../../services/interceptors/axios";


export const userLogout = (payload) => {
    const logout_URL = keycloak_URL + API_ENDPOINTS.USER_LOGOUT;
    return KeycloakRequest.post(logout_URL, payload);
};

export const refreshToken = (payload) => {
    const refresh_URL = keycloak_URL + API_ENDPOINTS.REFRESH_TOKEN_ENDPOINT;
    return KeycloakRequest.post(refresh_URL, payload);
};

export const userLogin  = (payload) => {
    const login_URL = keycloak_URL + API_ENDPOINTS.TOKEN_ENDPOINT;
    return KeycloakRequest.post(login_URL, payload);
};

export const registerNotificationToken = async (payload) => {
    const device_register_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.REGISTER_DEVICE_TOKEN;
    const response = await Request.post(device_register_URL, payload);
    return response;
}

export const checkForUpdate = async (payload) => {
    const checkForUpdate_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.CHECK_FOR_UPDATE;
    const response = await Request.post(checkForUpdate_URL, payload);
    return response?.data?.data;
}