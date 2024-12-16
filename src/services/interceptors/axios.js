import axios from 'axios';
import { Alert } from 'react-native';
// custom imports
import { API_BASE_URL, keycloak_CLIENT_ID, keycloak_URL } from "../../common/config";
import { ACCESS_TOKEN, REFRESH_TOKEN, removeData, retrieveData, storeData } from "../../common/constants/AsyncStorageConst";
import { refreshToken, userLogout } from "../../views/auth/api/authApi";
import { LOGOUT_STATUS_CODE } from '../../common/service/ApiConstants';
import STRINGS from '../../common/strings';
import { PassAccessTokenProvider } from '../../context/createDataContext';

export class Api {
    constructor(
        config = { baseURL: API_BASE_URL, timeout: 2000, headers: {} }
    ) {
        this._client = axios.create(config);
    }
    get client() {
        return this._client;
    }

    async get(url, config) {
        return await this._client.get(url, config);
    }

    async post(url, data, config) {
        return await this._client.post(url, data, config);
    }

    async patch(url, data, config) {
        return await this._client.patch(url, data, config);
    }

    async put(url, data, config) {
        return await this._client.put(url, data, config);
    }

    async delete(url, data, config) {
        return await this._client.delete(url, config);
    }
}

// ================= Request ================//
let isRefreshing = false;
let failedQueue = [];
let isAlertShown = false;

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const Request = new Api({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor
Request._client.interceptors.request.use(
    async function (config) {
        let token = await retrieveData(ACCESS_TOKEN);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Request Response
Request._client.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        const logoutAttribute = error?.response?.headers['logout'];
        if (error?.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axios(originalRequest);
                }).catch(error => {
                    return Promise.reject(error);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            const refreshTokenData = await retrieveData(REFRESH_TOKEN);

            return new Promise(function (resolve, reject) {
                const data = {
                    refresh_token: refreshTokenData,
                    grant_type: 'refresh_token',
                    client_id: keycloak_CLIENT_ID,
                };
                refreshToken(data).then(({ data }) => {
                    Request.client.defaults.headers['Authorization'] = 'Bearer ' + data?.access_token;
                    originalRequest.headers['Authorization'] = 'Bearer ' + data?.access_token;
                    processQueue(null, data?.access_token);
                    storeData(ACCESS_TOKEN, data?.access_token);
                    storeData(REFRESH_TOKEN, data?.refresh_token);
                    resolve(axios(originalRequest));
                }).catch(error => {
                    processQueue(error, null);
                    handleLogout();
                    reject(error);
                }).then(() => {
                    isRefreshing = false;
                });
            });
        } else if (logoutAttribute === "1") {
            const { title, description } = error?.response?.data;
            if (!isAlertShown) {
                isAlertShown = true;
                Alert.alert(title, description, [{ text: 'OK', onPress: () => { isAlertShown = false, handleLogout() } }]);
            }
        }
        return error.response;
    }
);

// ================= Keycloak Request ================//
export const KeycloakRequest = new Api({
    baseURL: keycloak_URL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

//KeycloakRequest interceptor
KeycloakRequest._client.interceptors.request.use(
    async function (config) {
        let token = await retrieveData(ACCESS_TOKEN);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

//KeycloakResponse interceptor
KeycloakRequest._client.interceptors.response.use(
    async function (response) {
        await storeData(ACCESS_TOKEN, response?.data?.access_token);
        await storeData(REFRESH_TOKEN, response?.data?.refresh_token);
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (error.response?.status === 400 && !originalRequest._retry) {
            handleLogout();
        }
        return Promise.reject(error);
    }
);

const handleLogout = async () => {
    let RefreshToken = await retrieveData(REFRESH_TOKEN);
    const data = { client_id: keycloak_CLIENT_ID, refresh_token: RefreshToken };

    userLogout(data).then((res) => {
        if (res.status === LOGOUT_STATUS_CODE) {
            removeData(REFRESH_TOKEN);
            removeData(ACCESS_TOKEN);
            PassAccessTokenProvider?.({ type: 'signout' });
        } else {
            console.log(STRINGS.unable_to_logout);
        }
    }).catch((err) => {
        console.log(STRINGS.something_went_wrong, err);
    });
}

export default Request;