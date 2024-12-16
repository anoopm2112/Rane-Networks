import { API_BASE_URL, SUB_URL } from "../../../common/config";
import { checkNetworkConnectivity } from "../../../common/utils/networkUtil";
import { getMyAccountBriefListFromLocalDB, getMyAccountSettingsDataFromLocalDB } from "../../../database/services/myaccountService";
import { API_ENDPOINTS } from "../../../services/apiEndPoints";
import Request from "../../../services/interceptors/axios";

export const getSettingsBriefList = async () => {
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
        const response = await getMyAccountBriefListFromLocalDB();
        return JSON.parse(JSON.stringify(response));
    } else {
        const SETTINGS_LIST_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.SETTINGS_LIST;
        const response = await Request.get(SETTINGS_LIST_URL);
        if (response?.status === 200) {
            return response?.data?.data;
        } else {
            return [];
        }
    }
};

export const updateSettings = async (slug, isNotify, isShowOnWall) => {
    let payload = { show_on_wall: isShowOnWall, notify: isNotify };
    const ACCOUNT_SETTINGS_UPDATE_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.SETTINGS_LIST + `/${slug}`;
    const response = await Request.patch(ACCOUNT_SETTINGS_UPDATE_URL, payload);
    return response?.data?.data;
};

export const aboutUsDetails = async (payload) => {
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
        const response = await getMyAccountSettingsDataFromLocalDB();
        if (response?.length === 0) {
            return [];
        } else {
            return JSON.parse(JSON.stringify(response[0]));
        }
    } else {
        const ABOUT_US_DETAILS_URL = API_BASE_URL + SUB_URL + API_ENDPOINTS.FETCH_RESOURCES;
        const response = await Request.post(ABOUT_US_DETAILS_URL, payload);
        return response?.data?.data;
    }
};