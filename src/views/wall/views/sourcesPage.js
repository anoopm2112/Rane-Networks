import React, { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
// custom imports
import { AppContent, CommonHeader, Header, WebViewLinkShow } from '../../../components';
import { ROUTE_KEYS, SCREEN_CLASS } from '../../../navigation/constants';
import { trackScreen } from '../../../common/utils/analyticsUtils';

export default function SourcesPage(props) {
    const { navigation } = props;
    const { digestName, digestLink, digestBriefName, digestBriefSlug, screenProps, tabname } = props.route.params;

    useEffect(() => {
        trackScreen(SCREEN_CLASS.SOURCES_PAGE,digestLink)
    }, [])

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
    }, []);

    const handleBackButton = async () => {
        if (tabname === ROUTE_KEYS.SEARCH_LIST_PAGE) {
            navigation.navigate(ROUTE_KEYS.SEARCH_LIST_PAGE, { digestName: digestBriefName, digestSlug: digestBriefSlug })
        } else {
            navigation.navigate(ROUTE_KEYS.ARTICLE_LIST_PAGE, { digestName: digestBriefName, digestSlug: digestBriefSlug, screenProps: ROUTE_KEYS.SOURCES_PAGE });
        }
    };

    return (
        <AppContent>
            <CommonHeader />
            <Header title={digestName} onPressBack={() => navigation.goBack(null)} fromLink={true} />
            <WebViewLinkShow url={digestLink} />
        </AppContent>
    );
}