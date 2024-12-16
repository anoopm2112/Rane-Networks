import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator, AppState, Platform, Alert, Linking } from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
// custom imports
import styles from '../../commonViewStyles';
import STRINGS from '../../../common/strings';
import { AppContent, CommonHeader, CustomPopup, CustomSnackbar, InputText } from '../../../components';
import { COLORS } from '../../../common/enums/colors';
import { Context as AuthContext } from '../../../context/AuthContext';
import { convertHeight } from '../../../common/utils/dimentionUtils';
import { ROUTE_KEYS, SCREEN_CLASS } from '../../../navigation/constants';
import { getDigestList, getPublishedDetails, getPublishedDetailsFromDb } from '../api/wallApi';
import CustomIcon from '../../../assets/CustomIcon';
import {
    deleteDigestListFromLocalDB, insertDigestListToLocalDB
} from '../../../database/services/digestService';
import { checkNetworkConnectivity } from '../../../common/utils/networkUtil';
import { trimTrailingWhitespace, updateLocalDB } from '../../../common/utils/commonUtils';
import { insertDigestPublicationListToLocalDB, getAllDigestPublicationListFromLocalDB, updateReadStatusById, updateReadStatusByNotify, insertPublicationDateItemToDB } from '../../../database/services/publicationService';
import { DEFAULT_BRIEF_SLUG, FIRST_LAUNCH, INITIAL_LAUNCH, IS_PUBLICATIONS_SAVED, LAUNCH_FROM_NOTIFICATION, SAVED_DEFAULT_BRIEF, TIME_STAMP, USER_INFO, USER_IS_LOGIN_NEW, removeData, retrieveData, storeData } from '../../../common/constants/AsyncStorageConst';
import { trackScreen } from '../../../common/utils/analyticsUtils';
import notifee, { EventType } from '@notifee/react-native';
import { checkForUpdate } from '../../auth/api/authApi';

export default function DigestListPage(props) {
    const { navigation } = props;
    const { state } = useContext(AuthContext);
    const isFocused = useIsFocused();

    // states
    const [data, setData] = useState([]);
    const [appLoader, setAppLoader] = useState(false);
    const [publishAPILoader, setPublishAPILoader] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [snackbarNoInternetVisible, setSnackbarNoInternetVisible] = useState(false);
    const [publicationdata, setpublicationData] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);

    useEffect(() => {
        const fetchBriefData = async () => {
            if (Platform.OS === 'ios') {

                const JsonBriefData = await AsyncStorage.getItem(SAVED_DEFAULT_BRIEF);
                const user_login_new = await retrieveData(USER_IS_LOGIN_NEW);
                if (Object.keys(state?.defaultBrief).length > 0 && JSON.parse(JsonBriefData) !== null) {
                    await AsyncStorage.setItem(SAVED_DEFAULT_BRIEF, JSON.stringify(state?.defaultBrief));
                    if (user_login_new != null || user_login_new != undefined) {
                        navigation.navigate(ROUTE_KEYS.ARTICLE_LIST_PAGE, { digestName: state?.defaultBrief?.defaultBriefName, digestSlug: state?.defaultBrief?.defaultBriefSlug, briefDataGid: null });
                    }
                }
            } else {
                const initialNotification = await messaging().getInitialNotification();
                if (initialNotification) {
                    const { name, slug, gid } = initialNotification?.data;
                    const date = new Date().toISOString().slice(0, 10);
                    await insertPublicationDateItemToDB(slug, gid, date);
                    await AsyncStorage.setItem(LAUNCH_FROM_NOTIFICATION, STRINGS.notification);
                    Linking.openURL(`ranenetwork://myWallTab/articleListPage/${name}/${slug}/${gid}`);
                }
                const JsonBriefData = await AsyncStorage.getItem(SAVED_DEFAULT_BRIEF);
                const user_login_new = await retrieveData(USER_IS_LOGIN_NEW);
                const notificationclick = await AsyncStorage.getItem(LAUNCH_FROM_NOTIFICATION)
                if (notificationclick !== STRINGS.notification) {
                    if (Object.keys(state?.defaultBrief).length > 0 && JSON.parse(JsonBriefData) !== null) {
                        await AsyncStorage.setItem(SAVED_DEFAULT_BRIEF, JSON.stringify(state?.defaultBrief));
                        if (user_login_new != null || user_login_new != undefined) {
                            navigation.navigate(ROUTE_KEYS.ARTICLE_LIST_PAGE, { digestName: state?.defaultBrief?.defaultBriefName, digestSlug: state?.defaultBrief?.defaultBriefSlug, briefDataGid: null });
                        }
                    }
                } else {
                    await AsyncStorage.setItem(LAUNCH_FROM_NOTIFICATION, STRINGS.not_notficatication);
                }
            }
        }
        fetchBriefData();
    }, [isFocused]);

    useEffect(() => {
        const appStateListener = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            appStateListener?.remove();
        };
    }, []);

    const handleAppStateChange = async (nextAppState) => {
        if (nextAppState === 'active') {
            await checkAppVersion();
            setAppState(nextAppState);
        }
    };

    useEffect(() => {
        checkAppVersion();
        trackScreen(SCREEN_CLASS.DIGEST_LIST_PAGE, ROUTE_KEYS.DIGEST_LIST_PAGE)
    }, []);

    const checkAppVersion = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const isConnected = await checkNetworkConnectivity();
        try {
            let payload = {
                version: DeviceInfo.getVersion(),
                platform: Platform.OS
            }
            const updateResponse = await checkForUpdate(payload);
            // console.log('updateResponse', updateResponse);
            if (updateResponse?.force_update && isConnected) {
                Alert.alert(
                    STRINGS.update_required,
                    STRINGS.new_version_available,
                    [
                        {
                            text: STRINGS.update_now,
                            onPress: () => { Linking.openURL(updateResponse?.link) },
                        },
                    ]
                );
            } else {
                digestListAPI();
            }
        } catch (error) {
            console.error('Error checking app version:', error);
        }
    };

    useEffect(() => {
        if (data && publicationdata) {
            fetchData();
        }
    }, [data, publicationdata]);

    useEffect(() => {
        // Listen for incoming notifications
        notifee.onForegroundEvent(async ({ type, detail }) => {
            switch (type) {
                case EventType.TRIGGER_NOTIFICATION_CREATED:
                    onRefresh()
                    fetchData()
                    break;
            }
        });

    }, []);

    const checkFirstLaunch = async () => {
        var value = await retrieveData(FIRST_LAUNCH);
        var user_info = await retrieveData(USER_INFO);
        if (value === null || value === undefined) {
            setShowSettingsModal(true);
            await storeData(FIRST_LAUNCH, user_info);
        } else if (value !== null && !value.includes(user_info)) {
            await storeData(FIRST_LAUNCH, user_info + value);
            setShowSettingsModal(true);
        }

    }

    const checkInitialLaunch = async () => {
        var value = await retrieveData(INITIAL_LAUNCH);
        var user_info = await retrieveData(USER_INFO);
        if (value === null || value === undefined) {
            await storeData(INITIAL_LAUNCH, user_info);
        }
    }

    async function fetchData() {
        try {
            const combinedData = await combineData(data, publicationdata);
            setCombinedData(combinedData);
        } catch (error) {
            console.error('Error fetching or combining data:', error);
        }
    }

    const combineData = async (digestList, unreadDigests) => {
        try {
            // Use Promise.all to wait for both API responses
            const [digestResponse, unreadResponse] = await Promise.all([
                digestList, // Replace this with your API call for digestList
                unreadDigests, // Replace this with your API call for unreadDigests
            ]);

            const unreadData = unreadResponse.filter(item => item.readStatus === false);
            const secondJSONSlugs = new Set(unreadData?.map(item => item.slug));

            // Create the desired output array
            const combinedData = digestResponse?.map(item => ({
                name: item.name,
                slug: item.slug,
                isRead: !secondJSONSlugs.has(item.slug),
            }));
            return combinedData;
        } catch (error) {
            console.error('Error combining data:', error);
            return [];
        }
    };

    async function digestListAPI() {
        setAppLoader(true);
        let response = await getDigestList();
        if (response?.length != 0) {
            getPublishedDetailsAPI();
            let defaultBriefPayload = {
                defaultBriefName: response[0]?.name,
                defaultBriefSlug: response[0]?.slug
            }
            await AsyncStorage.setItem(DEFAULT_BRIEF_SLUG, JSON.stringify(defaultBriefPayload));
            const isConnected = await checkNetworkConnectivity();
            if (isConnected) {
                await deleteDigestListFromLocalDB();
                await insertDigestListToLocalDB(response);
            }

        }
        setData(response);
        setAppLoader(false);
    }

    async function getPublishedDetailsAPI() {
        const isConnected = await checkNetworkConnectivity();
        if (!isConnected) {
            setSnackbarNoInternetVisible(true);
            return;
        }

        setPublishAPILoader(true);
        const moreThanOneMonth = await checkIfMoreThanOneMonth();
        if (moreThanOneMonth) {
            removeData(IS_PUBLICATIONS_SAVED);
        }

        var value = await retrieveData(IS_PUBLICATIONS_SAVED);
        var isFirstLaunch = await retrieveData(INITIAL_LAUNCH);
        if (value != null) {
            const responseFromAPI = await getPublishedDetails();
            const responseFromLocalDB = await getPublishedDetailsFromDb();
            const getLengthBothArrays = responseFromAPI?.data?.length === responseFromLocalDB.length;
            if (!getLengthBothArrays) {
                const dataWithReadStatus = responseFromAPI?.data?.map(item => {
                    return {
                        ...item,
                        readStatus: true,
                        publication: item?.publication?.map(pub => {
                            return {
                                ...pub,
                                dateWiseReadStatus: true,
                            };
                        }),
                    };
                });
                await insertDigestPublicationListToLocalDB(dataWithReadStatus);
            }
            await updateLocalDB(responseFromAPI.data, responseFromLocalDB);
            const responseFromLocalDBAfterUpdate = await getPublishedDetailsFromDb();
            setpublicationData(responseFromLocalDBAfterUpdate);
        } else {
            if (isFirstLaunch != null && isFirstLaunch != undefined) {
                const responseData = await getPublishedDetails();
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const dataWithReadStatus = responseData?.data?.map(item => {
                    const readStatus = !item?.publication.length || !isAnyNewPublication(item?.publication, thirtyDaysAgo);
                    return {
                        ...item,
                        readStatus: readStatus,
                        publication: item?.publication?.map(pub => {
                            const entryDate = new Date(pub.date);
                            const dateWiseStatus = entryDate <= thirtyDaysAgo;
                            return {
                                ...pub,
                                dateWiseReadStatus: dateWiseStatus,
                            };
                        }),
                    };
                });
                await insertDigestPublicationListToLocalDB(dataWithReadStatus);
                setpublicationData(dataWithReadStatus);
                await storeData(IS_PUBLICATIONS_SAVED, STRINGS.save);
                const currentDate = new Date().getTime();
                await storeData(TIME_STAMP, currentDate.toString());
            } else {
                const responseData = await getPublishedDetails();
                // const thirtyDaysAgo = new Date();
                // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const dataWithReadStatus = responseData?.data?.map(item => {
                    const readStatus = true
                    return {
                        ...item,
                        readStatus: readStatus,
                        publication: item?.publication?.map(pub => {
                            const entryDate = new Date(pub.date);
                            const dateWiseStatus = true
                            return {
                                ...pub,
                                dateWiseReadStatus: dateWiseStatus,
                            };
                        }),
                    };
                });
                await insertDigestPublicationListToLocalDB(dataWithReadStatus);
                setpublicationData(dataWithReadStatus);
                await storeData(IS_PUBLICATIONS_SAVED, STRINGS.save);
                const currentDate = new Date().getTime();
                await storeData(TIME_STAMP, currentDate.toString());
            }
        }
        setPublishAPILoader(false);
        checkFirstLaunch();
        checkInitialLaunch();
    }

    const isAnyNewPublication = async (publicationlist, thirtyDaysAgo) => {
        // Use isAnyNewPublication() to check if at least one entry meets the condition
        return publicationlist.some(pub => {
            const entryDate = new Date(pub.date);
            return entryDate <= thirtyDaysAgo;
        });
    };

    const checkIfMoreThanOneMonth = async () => {
        try {
            const lastOpenDate = await retrieveData(TIME_STAMP);
            if (lastOpenDate) {
                const currentDate = new Date().getTime();
                const differenceInMs = currentDate - parseInt(lastOpenDate, 10);
                const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // Approximation of one month
                return differenceInMs > oneMonthInMs;
            }
            // Handle the case when lastOpenDate is not available (e.g., app opened for the first time)
            return false;
        } catch (error) {
            console.error('Error checking if more than a month has passed:', error);
            return false; // Handle errors gracefully and return false
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card}
            onPress={() => navigation.navigate(ROUTE_KEYS.ARTICLE_LIST_PAGE, { digestName: item.name, digestSlug: item.slug, briefDataGid: null })}>
            <View style={{ flexDirection: 'row' }}>
                <Text numberOfLines={1} style={styles.cardtext}>{item.name}</Text>
                {item.isRead === false &&
                    <View style={styles.notifyIconContainer}>
                        <CustomIcon iconPackage={'MaterialIcons'} name="fiber-manual-record" size={convertHeight(8)} color={COLORS.notify} />
                    </View>}
            </View>
            <CustomIcon iconPackage={'MaterialIcons'} name="keyboard-arrow-right" size={convertHeight(15)} color={COLORS.secondary} />
        </TouchableOpacity>
    );

    const onRefresh = () => {
        setRefreshing(true);
        digestListAPI();
        // getPublishedDetailsAPI();
        setRefreshing(false);
    };

    const onSearch = async () => {
        const isConnected = await checkNetworkConnectivity();
        if (isConnected) {
            navigation.navigate(ROUTE_KEYS.SEARCH_LIST_PAGE, { digestSlug: '' });
            setSnackbarNoInternetVisible(false);
        } else {
            setSnackbarNoInternetVisible(true);
        }
    };

    const hideSnackbar = (showAgain) => {
        setSnackbarNoInternetVisible(showAgain);
    };

    useFocusEffect(
        // This function will be called when the screen gains focus (Returning from Screen 2)
        useCallback(() => {
            // getPublishedDetailsAPI();
            digestListAPI();
        }, [])
    );
    const onNavigation = async () => {
        await storeData(USER_IS_LOGIN_NEW, state?.userEmail);
        navigation.navigate(ROUTE_KEYS.ACCOUNT_SETTINGS_TAB)
        setShowSettingsModal(false)
    }

    const handleOnClose = async () => {
        await storeData(USER_IS_LOGIN_NEW, state?.userEmail);
        setShowSettingsModal(false)
    }

    return (
        <AppContent>
            <CommonHeader />
            <View style={styles.nameContainer}>
                <Text style={styles.welcomeText}>{STRINGS.Welcome}, {trimTrailingWhitespace(state?.userName)}!</Text>
            </View>
            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTextHeader}>{STRINGS.digest_list_heading}</Text>
            </View>
            <TouchableOpacity style={{ margin: convertHeight(13) }} activeOpacity={0.8} onPress={() => { onSearch(); }}>
                <InputText isEditable={false} onSearchIconPress={() => { onSearch(); }} />
            </TouchableOpacity>
            {(appLoader || publishAPILoader) ?
                <View style={styles.mainContainer}>
                    <ActivityIndicator size="large" color={COLORS.secondary} />
                </View>
                :
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={combinedData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            }
            <CustomSnackbar visible={snackbarNoInternetVisible} message={STRINGS.no_internet_brief} onHideSnackbar={hideSnackbar} internetToast={true} />
            <CustomPopup
                title={STRINGS.first_lauch_alert} message={STRINGS.navigate_to_myaccount}
                visible={showSettingsModal} onClose={() => handleOnClose()}
                onConfirm={() => onNavigation()} />
        </AppContent>
    );
}