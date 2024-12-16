import React, { useContext, useEffect } from 'react';
import { Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import messaging from '@react-native-firebase/messaging'
// Custom Imports
import { ROUTE_KEYS } from './constants';
import {
    DigestListPage, MySavedList, Contact, AccountSettings, SearchPage, ArticleListPage,
    MySavedArticlesListPage, MySavedBriefListPage, SourcesPage, AboutUs, AboutLinkPage,
    MySavedLinkPage
} from '../views';
import { COLORS } from '../common/enums/colors';
import { convertHeight } from '../common/utils/dimentionUtils';
import STRINGS from '../common/strings';
import { Context as AuthContext } from '../context/AuthContext';
import {
    bootstrap, checkApplicationPermission, notificationListner,
    onForeGroundEvent, requestUserPermission, checkBatteryOptimization
} from '../common/utils/firebaseUtils';
import { insertPublicationDateItemToDB } from '../database/services/publicationService';

const { Navigator, Screen } = createBottomTabNavigator();
const StackNavigator = createStackNavigator();

export default function MainNavigator() {
    const { state } = useContext(AuthContext);

    useEffect(() => {
        getInitialURL();
        notificationListner();
        // checkBatteryOptimization();
        checkApplicationPermission();
        bootstrap();
        requestUserPermission();
        onForeGroundEvent();
    }, []);

    const getInitialURL = async () => {
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
            const { slug, gid, name } = initialNotification?.data || {};
            const date = new Date().toISOString().slice(0, 10);
            await insertPublicationDateItemToDB(slug, gid, date);
            Linking.openURL(`ranenetwork://myWallTab/articleListPage/${name}/${slug}/${gid}`);
        }
        return Linking.getInitialURL();
    }

    const getScreenOptions = ({ title }) => {
        return {
            tabBarLabel: title,
            tabBarLabelStyle: {
                fontSize: convertHeight(8),
                fontFamily: 'Lato-Regular'
            },
            headerShown: false,
        };
    };

    const MyWallNavigator = () => {
        return (
            <StackNavigator.Navigator initialRouteName={ROUTE_KEYS.DIGEST_LIST_PAGE}>
                <StackNavigator.Screen options={getScreenOptions({ title: STRINGS.my_wall })} name={ROUTE_KEYS.DIGEST_LIST_PAGE} component={DigestListPage} />
                <StackNavigator.Screen options={getScreenOptions({ title: STRINGS.explore })} name={ROUTE_KEYS.SEARCH_LIST_PAGE} component={SearchPage} />
                <StackNavigator.Screen options={getScreenOptions({ title: STRINGS.article_list })} name={ROUTE_KEYS.ARTICLE_LIST_PAGE} component={ArticleListPage} />
                <StackNavigator.Screen name={ROUTE_KEYS.MY_SAVED_ARTICLE_LIST_PAGE} component={MySavedArticlesListPage} />
                <StackNavigator.Screen name={ROUTE_KEYS.MY_SAVED_BRIEF_LIST_PAGE} component={MySavedBriefListPage} />
                <StackNavigator.Screen options={getScreenOptions({ title: STRINGS.explore })} name={ROUTE_KEYS.SOURCES_PAGE} component={SourcesPage} />
            </StackNavigator.Navigator>
        );
    };

    const MySavedListNavigator = () => {
        return (
            <StackNavigator.Navigator initialRouteName={ROUTE_KEYS.MY_SAVED_LIST_PAGE}>
                <StackNavigator.Screen options={getScreenOptions({ title: STRINGS.my_saved_list })} name={ROUTE_KEYS.MY_SAVED_LIST_PAGE} component={MySavedList} />
                <StackNavigator.Screen options={getScreenOptions({ title: STRINGS.article_list })} name={ROUTE_KEYS.ARTICLE_LIST_PAGE} component={ArticleListPage} />
                <StackNavigator.Screen options={getScreenOptions({ title: STRINGS.my_saved_link })} name={ROUTE_KEYS.MY_SAVED_LINK_PAGE} component={MySavedLinkPage} />
            </StackNavigator.Navigator>
        );
    };

    const AccountSettingsNavigator = () => {
        return (
            <StackNavigator.Navigator initialRouteName={ROUTE_KEYS.ACCOUNT_SETTINGS_PAGE}>
                <StackNavigator.Screen options={getScreenOptions({ title: STRINGS.my_account })} name={ROUTE_KEYS.ACCOUNT_SETTINGS_PAGE} component={AccountSettings} />
                <StackNavigator.Screen options={getScreenOptions({ title: STRINGS.about_us })} name={ROUTE_KEYS.ABOUT_US} component={AboutUs} />
                <StackNavigator.Screen options={getScreenOptions({ title: STRINGS.about_link })} name={ROUTE_KEYS.ABOUT_LINK_PAGE} component={AboutLinkPage} />
            </StackNavigator.Navigator>
        );
    };

    return (
        <Navigator
            screenOptions={({ route }) => ({
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === ROUTE_KEYS.MY_WALL_TAB) {
                        iconName = 'home';
                    } else if (route.name === ROUTE_KEYS.MY_SAVED_LIST_TAB) {
                        iconName = 'bookmark';
                    } else if (route.name === ROUTE_KEYS.CONTACT_RANE) {
                        iconName = 'phone-in-talk';
                    } else if (route.name === ROUTE_KEYS.ACCOUNT_SETTINGS_TAB) {
                        iconName = 'account-circle';
                    }

                    // You can return any icon component you prefer here
                    if (route.name === ROUTE_KEYS.MY_WALL_TAB) {
                        return <Entypo name={iconName} size={convertHeight(15)} color={color} />;
                    } else if (route.name === ROUTE_KEYS.CONTACT_RANE) {
                        return <MaterialCommunityIcons name={iconName} size={convertHeight(15)} color={color} />;
                    } else if (route.name === ROUTE_KEYS.ACCOUNT_SETTINGS_TAB) {
                        return <MaterialCommunityIcons name={iconName} size={convertHeight(15)} color={color} />;
                    } else {
                        return <Icon name={iconName} size={convertHeight(14)} color={color} />;
                    }
                },
                tabBarActiveTintColor: COLORS.bottomBarActive,
                tabBarInactiveTintColor: COLORS.secondary,
                tabBarStyle: {
                    backgroundColor: COLORS.black
                }
            })}
        >
            <Screen options={getScreenOptions({ title: STRINGS.my_wall })} name={ROUTE_KEYS.MY_WALL_TAB} component={MyWallNavigator} />
            <Screen options={getScreenOptions({ title: STRINGS.my_saved_list })} name={ROUTE_KEYS.MY_SAVED_LIST_TAB} component={MySavedListNavigator} />
            <Screen options={getScreenOptions({ title: STRINGS.contact_rane })} name={ROUTE_KEYS.CONTACT_RANE} component={Contact} />
            <Screen options={getScreenOptions({ title: STRINGS.my_account })} name={ROUTE_KEYS.ACCOUNT_SETTINGS_TAB} component={AccountSettingsNavigator} />
        </Navigator>
    );
}