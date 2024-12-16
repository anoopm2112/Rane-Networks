import { keycloak_REALM } from "../common/config";

export const API_ENDPOINTS = {
    TOKEN_ENDPOINT: `/realms/${keycloak_REALM}/protocol/openid-connect/token`,
    REFRESH_TOKEN_ENDPOINT: `/realms/${keycloak_REALM}/protocol/openid-connect/token`,
    USER_LOGOUT: `/realms/${keycloak_REALM}/protocol/openid-connect/logout`,
    // Digest List APIs
    DIGEST_LIST_API: `brief`,
    ARTICLE_FILTER: `article/filter`,
    PUBLICATION_LIST: `brief/publication`,
    SETTINGS_LIST: `setting/brief`,
    FEEDBACK: `feedback`,
    GET_SET_BOOKMARK: `bookmark`,
    GET_MY_SAVED_ARTICLE_LIST: `bookmark/article`,
    GET_MY_SAVED_BRIEF_LIST: `bookmark/brief`,
    FETCH_RESOURCES: `fetch`,
    SHARE_VIA_EMAIL: `share/brief`,
    REGISTER_DEVICE_TOKEN: `register`,
    CHECK_FOR_UPDATE: `check-update`
}; 