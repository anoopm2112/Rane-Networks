import React, { useContext, useState, useEffect, useRef } from 'react';
import {
    View, Text, StatusBar, ActivityIndicator, BackHandler, Image, TouchableOpacity, ImageBackground, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import querystring from 'query-string';
import { useNavigation } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// custom imports
import { config, keycloak_CLIENT_ID } from '../../../common/config';
import { COLORS } from '../../../common/enums/colors';
import { ACCESS_TOKEN, DEFAULT_BRIEF_SLUG, DEVICE_REG_ENDPIOINT_ID, FIRST_LAUNCH, INITIAL_LAUNCH, LOGIN_PAGE_TERMS, NOTIFY_DEVICE_TOKEN, REFRESH_TOKEN, removeData, retrieveData, SAVED_DEFAULT_BRIEF, storeData, USER_INFO, USER_IS_LOGIN_NEW } from '../../../common/constants/AsyncStorageConst';
import { Context as AuthContext } from '../../../context/AuthContext';
import { registerNotificationToken, userLogin, userLogout } from '../api/authApi';
import { SUCCESS_STATUS_CODE } from '../../../common/service/ApiConstants';
import { getLoginURL } from '../../../common/utils/authUtils';
import { AppContent, AppLoadingModal, CommonHeader } from '../../../components';
import AssetIconsPack from '../../../assets/IconProvide';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import STRINGS from '../../../common/strings';
import AuthStyleSheetFactory from '../authStyleSheetFactory';
import { aboutUsDetails } from '../../accountSettings/api/accountSettingsApi';
import { trackButtonClick } from '../../../common/utils/analyticsUtils';
import { createPayloadForRegisterDevice } from '../../../common/utils/commonUtils';
import { deleteMyAccountSettingsDataFromLocalDB, insertMyAccountSettingsDataToLocalDB } from '../../../database/services/myaccountService';
import { getDigestList } from '../../wall/api/wallApi';

export default function LoginPage() {
    const [webUrl, setWebUrl] = useState('');
    const [urlState, setUrlState] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(true);
    const [isWebError, setIsWebError] = useState(false);
    const [pageTerms, setPageTerms] = useState(true);

    const styles = AuthStyleSheetFactory.getStyles().authScreenStyles;

    const { signin } = useContext(AuthContext);
    const webviewRef = useRef(null);
    const isNetInfo = useNetInfo();
    const navigation = useNavigation();

    const handleBackButton = async () => {
        setLoginLoading(true);
        if (Platform.OS === 'ios') {
            navigation.setOptions({ gestureEnabled: false });
        }
        const loginPage = await AsyncStorage.getItem(LOGIN_PAGE_TERMS);
        if (JSON.parse(loginPage)) {
            BackHandler.exitApp();
            if (Platform.OS === 'ios') {
                navigation.setOptions({ gestureEnabled: true });
            }
            setLoginLoading(false);
            return true;
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            webviewRef.current.goBack();
            if (Platform.OS === 'ios') {
                navigation.setOptions({ gestureEnabled: true });
            }
            setLoginLoading(false);
            return true;
        }
    };

    useEffect(() => {
        startLoginProcess();
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        if (Platform.OS === 'ios') {
            navigation.addListener('gestureEnd', handleBackButton);
        }
        const checkNetworkConnectivity = () => {
            setIsConnected(true);
        };
        checkNetworkConnectivity();
        return () => {
            backHandler.remove();
            if (Platform.OS === 'ios') {
                navigation.removeListener('gestureEnd', handleBackButton);
            }
        };
    }, [isNetInfo]);

    const startLoginProcess = async () => {
        return new Promise((resolve, reject) => {
            const { url, state } = getLoginURL(config);
            setWebUrl(url);
            setUrlState(state);
        });
    };

    const onOpenURL = (url) => {
        const { code, state } = querystring.parse(querystring.extract(url));
        if (urlState === state) {
            if (code !== undefined) {
                retrieveTokens(code);
            }
        }
    };

    const retrieveTokens = async (code) => {
        setLoginLoading(true);
        if (code) {
            const { redirectUri, clientId } = config;
            const data = {
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
                client_id: clientId,
                code: code,
            };

            const res = await userLogin(data);
            if (res.status === SUCCESS_STATUS_CODE) {
                const refreshToken = res.data?.refresh_token;
                const accessToken = res.data?.access_token;
                // const decodedToken = jwtDecode(res.data?.id_token);
                await storeData(REFRESH_TOKEN, refreshToken);
                await storeData(ACCESS_TOKEN, accessToken);
                let payload = { resource: ["link", "user", "about_us"] }
                let response = await aboutUsDetails(payload);
                if (response === undefined) {
                    const data = {
                        client_id: keycloak_CLIENT_ID,
                        refresh_token: refreshToken,
                    };
                    await userLogout(data);
                    setIsWebError(false);
                    setLoginLoading(false);
                    return true;
                }
                var user_is_login_new = await retrieveData(USER_IS_LOGIN_NEW);
                if (user_is_login_new !== response?.user?.email) {
                    removeData(USER_IS_LOGIN_NEW);
                    removeData(FIRST_LAUNCH);
                    removeData(INITIAL_LAUNCH);
                    await AsyncStorage.removeItem(SAVED_DEFAULT_BRIEF);
                }
                await deleteMyAccountSettingsDataFromLocalDB();
                await insertMyAccountSettingsDataToLocalDB(response);
                const fullName = response?.user?.name ? response?.user?.name : response?.user?.email;
                await storeData(USER_INFO, fullName);
                let userResult = {
                    userToken: refreshToken,
                    accessToken: accessToken,
                    userName: fullName,
                    userEmail: response?.user?.email
                };
                let digestRes = await getDigestList();
                if (digestRes?.length != 0) {
                    let defaultBriefPayload = {
                        defaultBriefName: digestRes[0]?.name,
                        defaultBriefSlug: digestRes[0]?.slug
                    }
                    await AsyncStorage.setItem(DEFAULT_BRIEF_SLUG, JSON.stringify(defaultBriefPayload));
                    userResult.defaultBrief = defaultBriefPayload;
                }
                const deviceToken = await AsyncStorage.getItem(NOTIFY_DEVICE_TOKEN);
                const payloadForRegisterDevice = await createPayloadForRegisterDevice();
                payloadForRegisterDevice.device_id = JSON.parse(deviceToken);
                const registerResponse = await registerNotificationToken(payloadForRegisterDevice);
                if (registerResponse?.status === 200) {
                    const regEndpointId = registerResponse?.data?.data[0]?.endpoint_id;
                    if (regEndpointId !== undefined) {
                        await AsyncStorage.setItem(DEVICE_REG_ENDPIOINT_ID, JSON.stringify(regEndpointId));
                        console.log('TOKEN REGISTERED');
                    }
                }
                trackButtonClick('Login Button');
                signin(userResult);
            } else {
                console.log('ERROR LOGIN');
            }
        }
        setLoginLoading(false);
    };

    const onNavigationStateChange = async (navState) => {
        if (navState.url.includes('auth')) {
            await AsyncStorage.setItem(LOGIN_PAGE_TERMS, JSON.stringify(true));
            setPageTerms(true);
        } else {
            await AsyncStorage.setItem(LOGIN_PAGE_TERMS, JSON.stringify(false));
            if (!navState.url.includes('about:blank')) {
                setPageTerms(false);
            }
        }
        onOpenURL(navState.url);
    };

    const IndicatorLoadingView = () => {
        return (
            <ActivityIndicator color={COLORS.secondary} size="large" style={styles.IndicatorStyle} />
        );
    };

    const onWebViewError = (syntheticEvent) => {
        setIsWebError(false);
        const { nativeEvent } = syntheticEvent;
        if (nativeEvent.code === -2) {
            setIsConnected(false);
        } else {
            setIsWebError(true);
        }
    };

    const handleRetry = () => {
        setIsConnected(true);
    };

    const WebErrorView = () => {
        return (
            <ImageBackground style={styles.background} source={AssetIconsPack.icons.login_bg}>
                <ActivityIndicator color={COLORS.secondary} size="large" style={styles.IndicatorStyle} />
            </ImageBackground>
        )
    }

    return (
        <>
            <View style={styles.container}>
                <StatusBar backgroundColor={COLORS.systemBar} barStyle={'light-content'} />
                {isConnected ? (
                    isWebError ? (
                        <WebErrorView />
                    ) : (
                        <>
                            {!pageTerms && (
                                <TouchableOpacity style={styles.backButtonContainer} onPress={handleBackButton}>
                                    <MaterialIcons name="arrow-back-ios" size={convertHeight(16)} color={COLORS.secondary} />
                                    <Text style={{ color: COLORS.secondary, fontSize: convertHeight(12) }}>Back</Text>
                                </TouchableOpacity>
                            )}
                            <WebView
                                ref={webviewRef}
                                source={{ uri: webUrl }}
                                style={styles.webview}
                                originWhitelist={['*']}
                                javaScriptEnabled={true}
                                onNavigationStateChange={onNavigationStateChange}
                                onError={onWebViewError}
                                domStorageEnabled={true}
                                renderLoading={IndicatorLoadingView}
                                startInLoadingState={true}
                            />
                        </>
                    )
                ) : (
                    <ImageBackground style={styles.background} source={AssetIconsPack.icons.login_bg}>
                        <CommonHeader />
                        <View style={styles.noInternetContainer}>
                            <Image style={styles.no_internet_Icon}
                                source={AssetIconsPack.icons.no_wifi_full} />
                            <Text style={styles.noInternetText}>{STRINGS.no_internet_connectivity}</Text>
                            <Text style={styles.checkConnectionText}>{STRINGS.check_internet_connection}</Text>
                            <TouchableOpacity onPress={handleRetry} style={styles.okBtnContainer}>
                                <Text style={{ color: COLORS.secondary, fontSize: convertHeight(12), fontFamily: 'Lato-Bold' }}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                )}
            </View>
            <AppLoadingModal visible={loginLoading} />
        </>
    );
}