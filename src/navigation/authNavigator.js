import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// Custom Imports
import { ROUTE_KEYS } from './constants';
import { SplashPage, WelcomePage, LoginPage } from '../views';
import { requestUserPermission } from '../common/utils/firebaseUtils';

const { Navigator, Screen } = createStackNavigator();

export default function AuthNavigator() {


    useEffect(() => {
        requestUserPermission();
    }, []);

    return (
        <Navigator initialRouteName={ROUTE_KEYS.SPLASH_PAGE}>
            <Screen name={ROUTE_KEYS.SPLASH_PAGE} component={SplashPage} options={{ headerShown: false }} />
            <Screen name={ROUTE_KEYS.WELCOME_PAGE} component={WelcomePage} options={{ headerShown: false }} />
            <Screen name={ROUTE_KEYS.LOGIN_PAGE} component={LoginPage} options={{ headerShown: false }} />
        </Navigator>
    );
}