import { API_BASE_URL, SUB_URL } from "../../../common/config";
import { API_ENDPOINTS } from "../../../services/apiEndPoints";
import { checkNetworkConnectivity } from "../../../common/utils/networkUtil";
// Local Database Services
import { getArticleListFromLocalDB } from "../../../database/services/articleService";
import { getDigestListFromLocalDB } from "../../../database/services/digestService";
import Request from "../../../services/interceptors/axios";
import { PublicationDetailsJson } from "../../../JsonData/JsonMockData";
import { getAllDigestPublicationListFromLocalDB } from "../../../database/services/publicationService";

export const getDigestList = async () => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        const response = await getDigestListFromLocalDB();
        return JSON.parse(JSON.stringify(response));
    } else {
        const DIGEST_LIST_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.DIGEST_LIST_API;
        const response = await Request.get(DIGEST_LIST_URL);
        if (response?.status === 200) {
            return response?.data?.data;
        } else {
            return [];
        }
    }
};

export const getArticleList = async (digestSlug, date) => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        const response = await getArticleListFromLocalDB(digestSlug, date);
        let localDBarticleRes;
        if (response.length !== 0 && response !== undefined) {
            localDBarticleRes = JSON.parse(JSON.stringify(response[0]));
        } else {
            localDBarticleRes = [];
        }
        return localDBarticleRes;
    } else {
        const ARTICLE_LIST_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.DIGEST_LIST_API + `/${digestSlug}`;
        const response = await Request.get(ARTICLE_LIST_URL);
        if (response?.status === 200) {
            if (response?.data?.data.length > 0) {
                return response?.data?.data[0];
            } else {
                return response?.data?.data;
            }
        } else {
            return [];
        }
    }
};

export const getArticleListFilter = async (digestSlug, selectedDate) => {
    const isConnected = await checkNetworkConnectivity();

    if (!isConnected) {
        const response = await getArticleListFromLocalDB(digestSlug, selectedDate);
        if (response === undefined) {
            return [];
        } else {
            return JSON.parse(JSON.stringify(response));
        }
    } else {
        const ARTICLE_HORIZONTAL_DATE_LIST_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.DIGEST_LIST_API + `/${digestSlug}` + `/${selectedDate}`;
        const response = await Request.get(ARTICLE_HORIZONTAL_DATE_LIST_URL);
        if (response?.data?.data.length > 0) {
            return response?.data?.data[0];
        } else {
            return response?.data?.data;
        }
    }
};

export const searchFilter = async (payload) => {
    const SEARCH_FILTER_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.ARTICLE_FILTER;
    const response = await Request.post(SEARCH_FILTER_URL, payload);
    if (response?.status === 200) {
        return response?.data?.data;
    } else {
        return [];
    }
};

export const shareViaEmail = async (slug, briefId, payload) => {
    const SHARE_EMAIL_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.SHARE_VIA_EMAIL + `/${slug}` + `/${briefId}`;
    const response = await Request.post(SHARE_EMAIL_URL, payload);
    return response?.status;
};

export const getPublishedDetails = async () => {
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
        const response = await getAllDigestPublicationListFromLocalDB();
        return response;
    } else {
        const PUBLICATION_LIST_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.PUBLICATION_LIST;
        const response = await Request.get(PUBLICATION_LIST_URL);
        return response?.data;
    }
};

export const getPublishedDetailsFromDb = async () => {
    const response = await getAllDigestPublicationListFromLocalDB();
    return response;
};

export const sendFeedBackApi = async (slug, briefId, articleId, payload) => {
    const FEEDBACK_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.FEEDBACK + `/${slug}` + `/${briefId}` + `/${articleId}`;
    const response = await Request.post(FEEDBACK_URL, payload);
    return response?.status;
};
