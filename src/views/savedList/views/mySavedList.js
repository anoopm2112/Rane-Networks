import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// custom imports
import { COLORS } from '../../../common/enums/colors';
import { AppContent, CommonHeader, Header } from '../../../components';
import STRINGS from '../../../common/strings';
import { ROUTE_KEYS } from '../../../navigation/constants';
import { MySavedArticlesListPage, MySavedBriefListPage } from '../..';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';

export default function MySavedList() {
    const Tab = createMaterialTopTabNavigator();

    const screenOptions = {
        tabBarStyle: {
            margin: convertHeight(8),
            borderColor: COLORS.borderline,
            borderWidth: 0.25,
            borderRadius: 5,
        },
        tabBarIndicatorStyle: {
            backgroundColor: COLORS.bottomBarActive,
            height: '90%',
            width: convertWidth(165),
            borderRadius: 5,
            margin: convertHeight(2)
        }
    };

    const getTabScreenOptions = ({ title }) => {
        return {
            tabBarActiveTintColor: COLORS.secondary,
            tabBarInactiveTintColor: COLORS.secondary,
            tabBarLabel: title,
            tabBarLabelStyle: {
                fontSize: convertHeight(11),
                fontFamily: 'Lato-Bold',
                textTransform: 'none'
            },
        };
    };

    return (
        <AppContent>
            <CommonHeader />
            <View style={{ marginHorizontal: convertWidth(4) }}>
                <Header title={STRINGS.my_saved_list} />
            </View>
            <Tab.Navigator screenOptions={screenOptions}>
                <Tab.Screen
                    options={getTabScreenOptions({ title: STRINGS.briefs })}
                    name={ROUTE_KEYS.MY_SAVED_ARTICLE_LIST_PAGE} component={MySavedBriefListPage} />
                <Tab.Screen
                    options={getTabScreenOptions({ title: STRINGS.articles })}
                    name={ROUTE_KEYS.MY_SAVED_BRIEF_LIST_PAGE} component={MySavedArticlesListPage} />
            </Tab.Navigator>
        </AppContent>
    );
}