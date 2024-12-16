import React, { useEffect } from 'react';
// custom imports
import { AppContent, CommonHeader, Header, WebViewLinkShow } from '../../../components';
import { trackScreen } from '../../../common/utils/analyticsUtils';
import { SCREEN_CLASS } from '../../../navigation/constants';

export default function AboutLinkPage(props) {
    const { navigation } = props;
    const { digestName, digestLink } = props.route.params;

    useEffect(() => {
        trackScreen(SCREEN_CLASS.ABOUT_LINK_PAGE,digestLink)
    });

    return (
        <AppContent>
            <CommonHeader />
            <Header title={digestName} onPressBack={() => navigation.goBack(null)} fromLink={true} />
            <WebViewLinkShow url={digestLink} />
        </AppContent>
    );
}