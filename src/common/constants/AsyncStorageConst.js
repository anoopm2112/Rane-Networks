import EncryptedStorage from 'react-native-encrypted-storage';

export const REFRESH_TOKEN = 'refresh_token';
export const ACCESS_TOKEN = 'access_token';
export const USER_INFO = 'user_info';
export const USER_IS_LOGIN_NEW = 'user_is_login_new';
export const SEARCH_TERMS = 'search_terms';
export const LOGIN_PAGE_TERMS = 'login_page_terms';
export const IS_PUBLICATIONS_SAVED = 'is_publications_saved';
export const TIME_STAMP = 'time_stamp';
export const NOTIFY_DEVICE_TOKEN = 'notify_device_token';
export const FIRST_LAUNCH = 'first_launch';
export const DEFAULT_BRIEF_SLUG = 'default_brief_slug';
export const SCREEN_CONFIG_CHECK = 'screen_config_check';
export const SAVED_DEFAULT_BRIEF = 'saved_default_brief';
export const DEVICE_REG_ENDPIOINT_ID = 'device_reg_endpoind_id';
export const INITIAL_LAUNCH = 'initial_launch';
export const LAUNCH_FROM_NOTIFICATION = 'launch_from_notification';

export const storeData = async (key, value) => {
    try {
        await EncryptedStorage.setItem(key, value);
    } catch (e) {
        console.error('Error storing data:', e);
    }
};

export const retrieveData = async (key) => {
    try {
        const value = await EncryptedStorage.getItem(key);
        if (value !== null) {
            return value;
        } else {
            return null;
        }
    } catch (e) {
        console.error('Error retrieving data:', e);
    }
};

export const removeData = async (key) => {
    try {
        await EncryptedStorage.removeItem(key);
    } catch (e) {
        console.error('Error retrieving data:', e);
    }
};