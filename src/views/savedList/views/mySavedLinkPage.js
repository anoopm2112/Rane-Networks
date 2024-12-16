import React, { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
// custom imports
import { AppContent, CommonHeader, Header, WebViewLinkShow } from '../../../components';
import { ROUTE_KEYS } from '../../../navigation/constants';

export default function MySavedLinkPage(props) {
    const { navigation } = props;
    const { digestName, digestLink } = props.route.params;

    const isFocused = useIsFocused()

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        if (Platform.OS === 'ios') {
            navigation.addListener('gestureEnd', handleBackButton);
        }
        return () => {
            backHandler.remove();
            if (Platform.OS === 'ios') {
                navigation.removeListener('gestureEnd', handleBackButton);
            }
        };
    }, [isFocused]);

    const handleBackButton = () => {
        // navigation.goBack(null);
    }

    return (
        <AppContent>
            <CommonHeader />
            <Header title={digestName} onPressBack={() => navigation.goBack(null)} fromLink={true} />
            <WebViewLinkShow url={digestLink} />
        </AppContent>
    );
}