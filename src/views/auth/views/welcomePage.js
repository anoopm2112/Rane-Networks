import React from 'react';
import { RNKeycloak } from '@react-keycloak/native';
import { ReactNativeKeycloakProvider } from '@react-keycloak/native';
// custom imports
import { keycloak_CLIENT_ID, keycloak_REALM, keycloak_REDIRECT_URI, keycloak_URL } from '../../../common/config';
import LoginPage from './loginPage';

export default function WelcomePage() {

    const keycloak = new RNKeycloak({
        url: keycloak_URL,
        realm: keycloak_REALM,
        clientId: keycloak_CLIENT_ID,
    });

    return (
        <ReactNativeKeycloakProvider
            authClient={keycloak}
            initOptions={{
                redirectUri: keycloak_REDIRECT_URI,
                // if you need to customize "react-native-inappbrowser-reborn" View you can use the following attribute
                inAppBrowserOptions: {
                    enableUrlBarHiding: true,
                    enableDefaultShare: false,
                    forceCloseOnRedirection: false,
                    showInRecents: true,
                    // For iOS check: https://github.com/proyecto26/react-native-inappbrowser#ios-options
                    // For Android check: https://github.com/proyecto26/react-native-inappbrowser#android-options
                },
            }}
        >
            <LoginPage />
        </ReactNativeKeycloakProvider>
    );
}