import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, ActivityIndicator, Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useIsFocused } from '@react-navigation/native';
// custom Imports
import { keycloak_CLIENT_ID } from '../../../common/config';
import { AppContent, CommonHeader, CustomPopup, Header, CustomSnackbar } from '../../../components';
import STRINGS from '../../../common/strings';
import { COLORS } from '../../../common/enums/colors';
import { userLogout } from '../../auth/api/authApi';
import { ACCESS_TOKEN, REFRESH_TOKEN, IS_PUBLICATIONS_SAVED, removeData, retrieveData, FIRST_LAUNCH, INITIAL_LAUNCH } from '../../../common/constants/AsyncStorageConst';
import { Context as AuthContext } from '../../../context/AuthContext';
import { LOGOUT_STATUS_CODE } from '../../../common/service/ApiConstants';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import CustomIcon from '../../../assets/CustomIcon';
import { ROUTE_KEYS, SCREEN_CLASS } from '../../../navigation/constants';
import { aboutUsDetails, getSettingsBriefList, updateSettings } from '../api/accountSettingsApi';
import AccountSettingsStyleSheetFactory from '../accountSettingsStyles';
import { deleteMyAccountBriefListFromLocalDB, deleteMyAccountSettingsDataFromLocalDB, insertMyAccountBriefListToLocalDB, insertMyAccountSettingsDataToLocalDB } from '../../../database/services/myaccountService';
import { checkNetworkConnectivity } from '../../../common/utils/networkUtil';
import { trackButtonClick, trackScreen } from '../../../common/utils/analyticsUtils';

export default function AccountSettings(props) {
    const { navigation } = props;
    const { signout } = useContext(AuthContext);

    const [alertVisible, setAlertVisible] = useState(false);
    const [appLoader, setAppLoader] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarDefaultBriefVisible, setSnackbarDefaultBriefVisible] = useState(false);
    const [snackbarNoInternetVisible, setSnackbarNoInternetVisible] = useState(false);
    const [snackbarNotfiUpdateVisible, setSnackbarNotfiUpdateVisible] = useState(false);
    const [resourceData, setResourceData] = useState([]);
    const isFocused = useIsFocused();

    const STYLES = AccountSettingsStyleSheetFactory.getStyles().accountScreenStyles;

    useEffect(() => {
        settingsBriefListAPI();
        fetchLinkResources();
        trackScreen(SCREEN_CLASS.ACCOUNT_SETTINGS_PAGE,ROUTE_KEYS.ACCOUNT_SETTINGS_PAGE);
    }, [isFocused]);

    const fetchLinkResources = async () => {
        let payload = { resource: ["link", "user", "about_us"] }
        const resources = await aboutUsDetails(payload);
        const isConnected = await checkNetworkConnectivity();
        if (isConnected) {
            deleteMyAccountSettingsDataFromLocalDB();
            insertMyAccountSettingsDataToLocalDB(resources);
        }
        setResourceData(resources);
    }

    const settingsBriefListAPI = async () => {
        try {
            setAppLoader(true);
            let response = await getSettingsBriefList();
            await deleteMyAccountBriefListFromLocalDB();
            await insertMyAccountBriefListToLocalDB(response);
            setTableData(response);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setAppLoader(false); // Hide the loader whether the response was successful or not
        }
    };

    const handleLogout = async () => {
        const token = await retrieveData(REFRESH_TOKEN);

        trackButtonClick('Logout')

        if (token) {
            const data = {
                client_id: keycloak_CLIENT_ID,
                refresh_token: token,
            };

            userLogout(data).then((res) => {
                if (res.status === LOGOUT_STATUS_CODE) {
                    removeData(REFRESH_TOKEN);
                    removeData(ACCESS_TOKEN);
                    removeData(IS_PUBLICATIONS_SAVED);
                    removeData(INITIAL_LAUNCH);
                    signout();
                } else {
                    console.log(STRINGS.unable_to_logout);
                }
            }).catch((err) => {
                console.log(STRINGS.something_went_wrong, err);
            });
        }
    };

    const handleSwitchChange = async (itemData, switchType, notify, show_on_wall) => {
        setSnackbarVisible(false);
        setSnackbarNoInternetVisible(false);
        setSnackbarDefaultBriefVisible(false);
        setSnackbarNotfiUpdateVisible(false);
        const isConnected = await checkNetworkConnectivity();
        if (!isConnected) {
            setSnackbarNoInternetVisible(true);
            return;
        }

        trackButtonClick(switchType)

        setTableData((prevData) =>
            prevData.map((item) => {
                if (item.slug === itemData.slug) {
                    if (switchType === 'show_on_wall' && itemData.slug === tableData[0].slug) {
                        setSnackbarDefaultBriefVisible(true);
                        console.log('start')
                        return item; // Keep show_on_wall unchanged
                    } else {
                        if (switchType === 'show_on_wall' && !show_on_wall) {
                            console.log('start show')
                            // If  show_on_wallis set to false, also set notify to false
                            updateSettings(itemData.slug, notify, show_on_wall);
                            setSnackbarVisible(true);
                            return { ...item, [switchType]: show_on_wall, notify: false };
                        } else {
                            console.log('start show else')
                            if (show_on_wall === true) {
                                updateSettings(itemData.slug, notify, show_on_wall);
                                setSnackbarVisible(true);
                                return { ...item, [switchType]: !item[switchType] };
                            } else {
                                setSnackbarNotfiUpdateVisible(true);
                                return { ...item, [switchType]: show_on_wall, notify: false };
                            }
                        }
                    }
                } else {
                    return item;
                }
            })
        );
    };

    const hideSnackbar = (showAgain) => {
        setSnackbarVisible(showAgain);
    };

    const renderItem = ({ item }) => (
        <View key={item.slug.toString()} style={STYLES.BriefRow}>
            <Text style={[STYLES.BriefColumn, { flex: 1.5, paddingLeft: convertWidth(10) }]}>{item.name}</Text>
            <View style={[STYLES.BriefColumn, { flex: 0.75 }]}>
                <View style={{ marginLeft: item.show_on_wall || Platform.OS === 'ios' ? 0 : 10 }}>
                    <Switch
                        value={item.show_on_wall}
                        onValueChange={() => {
                            handleSwitchChange(item, 'show_on_wall', item.notify, !item.show_on_wall);
                        }}
                        thumbColor={item.show_on_wall ? COLORS.switch_thumb : COLORS.secondary}
                        trackColor={{ false: COLORS.switch_track, true: COLORS.switch_track_disable }}
                        style={STYLES.switch}
                    />
                </View>
            </View>
            <View style={[STYLES.BriefColumn, { flex: 0.75 }]}>
                <View style={{ marginLeft: item.notify || Platform.OS === 'ios' ? 0 : 10 }}>
                    <Switch
                        value={item.notify}
                        onValueChange={() => {
                            handleSwitchChange(item, 'notify', !item.notify, item.show_on_wall);
                        }}
                        thumbColor={item.notify ? COLORS.switch_thumb : COLORS.secondary}
                        trackColor={{ false: COLORS.switch_track, true: COLORS.switch_track_disable }}
                        style={STYLES.switch}
                    />
                </View>
            </View>
        </View>
    );

    const renderHeader = () => (
        <View style={STYLES.BriefCardContainer}>
            <View style={[STYLES.BriefCardColumn, { flex: 1.5, paddingLeft: convertWidth(11) }]}>
                <Text style={STYLES.headingText}>{STRINGS.briefs_name}</Text>
            </View>
            <View style={[STYLES.BriefCardColumn, { flex: 0.70, paddingHorizontal: convertWidth(5) }]}>
                <Text style={[STYLES.headingText, { textAlign: 'center' }]}>{STRINGS.show_on_Wall}</Text>
            </View>
            <View style={[STYLES.BriefCardColumn, { flex: 0.75, paddingHorizontal: convertWidth(5) }]}>
                <Text style={STYLES.headingText}>{STRINGS.notification}</Text>
            </View>
        </View>
    );

    const socialRenderIcon = (item, index) => (
        <TouchableOpacity key={index.toString()} onPress={() => Linking.openURL(item.href)} style={STYLES.round}>
            {item.label === 'Twitter' ?
                <CustomIcon iconPackage={'AntDesign'} name={'twitter'} size={convertHeight(18)} color={COLORS.black} />
                :
                item.label === 'LinkedIn' ?
                    <CustomIcon iconPackage={'Entypo'} name={'linkedin'} size={convertHeight(18)} color={COLORS.black} />
                    :
                    <CustomIcon iconPackage={'AntDesign'} name={'youtube'} size={convertHeight(18)} color={COLORS.black} />
            }
        </TouchableOpacity>
    );

    const aboutUsHandler = async () => {
        setSnackbarVisible(false);
        setSnackbarNoInternetVisible(false);
        setSnackbarDefaultBriefVisible(false);
        setSnackbarNotfiUpdateVisible(false);

        navigation.navigate(ROUTE_KEYS.ABOUT_US, { sourceData: resourceData?.about_us });
    }

    const logoutHandler = async () => {
        setSnackbarNoInternetVisible(false);
        const isConnected = await checkNetworkConnectivity();
        if (!isConnected) {
            setSnackbarNoInternetVisible(true);
            return;
        }

        setAlertVisible(true);
    } 

    return (
        <AppContent>
            <CommonHeader />
            <View style={{ marginHorizontal: convertWidth(4) }}>
                <Header title={STRINGS.my_account_settings} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: convertWidth(15) }}>
                {resourceData?.user?.name && <View style={[STYLES.profileContainer, { borderTopRightRadius: 5, borderTopLeftRadius: 5, borderWidth: 0.25 }]}>
                    <Text style={[STYLES.profileText, { fontFamily: 'Lato-Bold' }]}>{STRINGS.username}:</Text>
                    <Text numberOfLines={1} style={[STYLES.profileText, { flex: 1, textAlign: 'right' }]}>{resourceData?.user?.name}</Text>
                </View>}
                <View style={[STYLES.profileContainer, {
                    borderBottomRightRadius: 5, borderBottomLeftRadius: 5, borderWidth: 0.25, marginBottom: convertHeight(10),
                    borderTopRightRadius: resourceData?.user?.name ? 0 : 5, borderTopLeftRadius: resourceData?.user?.name ? 0 : 5, borderWidth: 0.25,
                }]}>
                    <Text style={[STYLES.profileText, { fontFamily: 'Lato-Bold' }]}>{STRINGS.email_address}:</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[STYLES.profileText, { flex: 1, textAlign: 'right' }]}>{resourceData?.user?.email}</Text>
                </View>
                <View style={STYLES.container}>
                    <Text style={STYLES.briefSettingsHeaderText}>{STRINGS.briefs_settings}</Text>
                    {/* <FlatList
                        data={tableData}
                        ListHeaderComponent={renderHeader}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    /> */}
                    {renderHeader()}
                    {appLoader ?
                        <View style={STYLES.mainContainer}>
                            <ActivityIndicator size="large" color={COLORS.secondary} />
                        </View>
                        :
                        tableData.map((item) => renderItem({ item }))
                    }
                </View>
                <TouchableOpacity onPress={() => aboutUsHandler()} 
                    style={[STYLES.logoutContainer, { marginVertical: convertHeight(8) }]}>
                    <Text style={STYLES.profileText}>{STRINGS.about_us}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => logoutHandler()} style={STYLES.logoutContainer}>
                    <Text style={STYLES.profileText}>Logout</Text>
                    <View style={{ paddingRight: convertWidth(8) }}>
                        <CustomIcon iconPackage={'MaterialIcons'} name="logout" size={18} color={COLORS.secondary} />
                    </View>
                </TouchableOpacity>

                <View style={[STYLES.socialIconContainer, { paddingVertical: convertHeight(18), flexDirection: 'row' }]}>
                    {resourceData?.link?.social.map((item, index) => socialRenderIcon(item, index))}
                </View>

                <View style={STYLES.socialIconContainer}>
                    <Text style={STYLES.versionText}>{resourceData?.about_us?.name}</Text>
                    <Text style={[STYLES.versionText, { paddingTop: convertHeight(5), paddingBottom: convertHeight(15) }]}>{STRINGS.app_version}: {DeviceInfo.getVersion()}</Text>
                </View>

            </ScrollView>
            <CustomPopup
                title={STRINGS.logout} message={STRINGS.confirm_logout}
                visible={alertVisible} onClose={() => setAlertVisible(false)}
                onConfirm={() => handleLogout()} />
            <CustomSnackbar
                visible={snackbarVisible || snackbarDefaultBriefVisible || snackbarNotfiUpdateVisible || snackbarNoInternetVisible}
                message={
                    snackbarVisible ? STRINGS.settings_updated :
                        snackbarNotfiUpdateVisible ? STRINGS.notification_enable :
                            snackbarDefaultBriefVisible ? STRINGS.not_disable_default_brief : STRINGS.no_internet
                }
                onHideSnackbar={hideSnackbar} />
        </AppContent>
    );
}