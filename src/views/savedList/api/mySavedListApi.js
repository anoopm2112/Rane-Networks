import { API_BASE_URL, SUB_URL } from "../../../common/config";
import { checkNetworkConnectivity } from "../../../common/utils/networkUtil";
import { 
    getMySavedArticleListFromLocalDB, getMySavedBriefListFromLocalDB, removeMySavedArticleListFromLocalDB, 
    removeMySavedBriefListFromLocalDB, 
    saveArticleListToMySavedListLocalDB, saveBriefListToMySavedListLocalDB 
} from "../../../database/services/mysavedService";
import { API_ENDPOINTS } from "../../../services/apiEndPoints";
import Request from "../../../services/interceptors/axios";

export const getMySavedArticleList = async () => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        const response = await getMySavedArticleListFromLocalDB();
        return JSON.parse(JSON.stringify(response));
    } else {
        const GET_SAVED_ARTICLE_LIST_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.GET_MY_SAVED_ARTICLE_LIST;
        const response = await Request.get(GET_SAVED_ARTICLE_LIST_URL);
        if (response?.status === 200) {
            return response?.data?.data;
        } else {
            return [];
        }
    }
};

export const getMySavedBriefList = async () => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        const response = await getMySavedBriefListFromLocalDB();
        return JSON.parse(JSON.stringify(response));
    } else {
        const GET_SAVED_ARTICLE_LIST_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.GET_MY_SAVED_BRIEF_LIST;
        const response = await Request.get(GET_SAVED_ARTICLE_LIST_URL);
        if (response?.status === 200) {
            return response?.data?.data;
        } else {
            return [];
        }
    }
};

export const bookmarkMySavedArticleList = async (payload) => {
    const brief_GID = payload?.brief?.gid;
    const brief_slug = payload?.brief?.slug;
    const article_GID = payload?.gid;

    // await saveArticleListToMySavedListLocalDB(payload);
    const SET_ARTICLE_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.GET_SET_BOOKMARK + `/${brief_slug}` + `/${brief_GID}` + `/${article_GID}`;
    const response = await Request.post(SET_ARTICLE_URL);
    return response?.status;
};

export const bookmarkMySavedBriefList = async (payload) => {
    const brief_GID = payload?.brief_gid;
    const brief_slug = payload?.slug;

    // await saveBriefListToMySavedListLocalDB(payload);
    const SET_BRIEF_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.GET_SET_BOOKMARK + `/${brief_slug}` + `/${brief_GID}`;
    const response = await Request.post(SET_BRIEF_URL);
    return response;
};

export const removeBookmarkMySavedArticleList = async (payload) => {
    const brief_GID = payload?.brief?.gid;
    const brief_slug = payload?.brief?.slug;
    const article_GID = payload?.gid;

    // await removeMySavedArticleListFromLocalDB(payload.id);
    const REMOVE_ARTICLE_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.GET_SET_BOOKMARK + `/${brief_slug}` + `/${brief_GID}` + `/${article_GID}`;
    const response = await Request.delete(REMOVE_ARTICLE_URL);
    return response?.status;
};

export const removeBookmarkMySavedBriefList = async (payload) => {
    const brief_GID = payload?.gid;
    const brief_slug = payload?.slug;

    // await removeMySavedBriefListFromLocalDB(payload.gid);
    const REMOVE_BRIEF_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.GET_SET_BOOKMARK + `/${brief_slug}` + `/${brief_GID}`;
    const response = await Request.delete(REMOVE_BRIEF_URL);
    return response?.status;
};