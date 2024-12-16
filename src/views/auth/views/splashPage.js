import React, { useEffect, useContext } from 'react';
import { View, Image } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
// custom imports
import { Context as AuthContext } from '../../../context/AuthContext';
import { ACCESS_TOKEN, DEFAULT_BRIEF_SLUG, LAUNCH_FROM_NOTIFICATION, REFRESH_TOKEN, SAVED_DEFAULT_BRIEF, USER_INFO, USER_IS_LOGIN_NEW, retrieveData, storeData } from '../../../common/constants/AsyncStorageConst';
import { ROUTE_KEYS, SCREEN_CLASS } from '../../../navigation/constants';
import AssetIconsPack from '../../../assets/IconProvide';
import { COLORS } from '../../../common/enums/colors';
import AuthStyleSheetFactory from '../authStyleSheetFactory';
import { useLinkTo } from "@react-navigation/native";
import { trackScreen } from '../../../common/utils/analyticsUtils';
import { getDigestList } from '../../wall/api/wallApi';
import { checkNetworkConnectivity } from '../../../common/utils/networkUtil';
import strings from '../../../common/strings';

export default function SplashPage(props) {
    const { navigation } = props;
    const { signin } = useContext(AuthContext);

    const styles = AuthStyleSheetFactory.getStyles().authScreenStyles;

    useEffect(() => {
        async function fetchUserAuth() {
            var value = await retrieveData(REFRESH_TOKEN);
            var access_value = await retrieveData(ACCESS_TOKEN);
            var user_info = await retrieveData(USER_INFO);
            var user_is_login_new = await retrieveData(USER_IS_LOGIN_NEW);
            var default_Brief = await AsyncStorage.getItem(DEFAULT_BRIEF_SLUG);
            const defaultBriefData = JSON.parse(default_Brief);
            await AsyncStorage.setItem(LAUNCH_FROM_NOTIFICATION, strings.not_notficatication);
            await AsyncStorage.setItem(SAVED_DEFAULT_BRIEF, JSON.stringify(defaultBriefData));
            if (value !== null) {
                let userResult = {
                    userToken: value?.userToken,
                    accessToken: access_value?.accessToken,
                    userName: user_info,
                    userEmail: user_is_login_new,
                    defaultBrief: {
                        defaultBriefName: defaultBriefData.defaultBriefName,
                        defaultBriefSlug: defaultBriefData.defaultBriefSlug
                    }
                };
                signin(userResult);
            } else {
                navigation.navigate(ROUTE_KEYS.LOGIN_PAGE);
            }
        }
        trackScreen(SCREEN_CLASS.SPLASH_PAGE,ROUTE_KEYS.SPLASH_PAGE)


        // setTimeout(() => {
            fetchUserAuth();
            SplashScreen.hide();
        // }, 2000);
    }, []);

    return (
        <View style={[styles.mainContainer, { backgroundColor: COLORS.splashBg }]}>
            <Image source={AssetIconsPack.icons.app_splash} style={styles.background} />
        </View>
    );
}