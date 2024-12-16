import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
// custom imports
import { AppContent, CommonHeader, Header, WebViewLinkShow } from '../../../components';
import STRINGS from '../../../common/strings';
import { convertWidth } from '../../../common/utils/dimentionUtils';
import { AppLinks } from '../../../common/enums/AppLinks';
import { aboutUsDetails } from '../../accountSettings/api/accountSettingsApi';
import { COLORS } from '../../../common/enums/colors';
import WallStyleSheetFactory from '../../wall/wallStyleSheetFactory';
import { trackScreen } from '../../../common/utils/analyticsUtils';
import { ROUTE_KEYS, SCREEN_CLASS } from '../../../navigation/constants';

export default function Contact() {
    const STYLES = WallStyleSheetFactory.getStyles().SourceScreenStyles;
    const isNetInfo = useNetInfo();

    const [appLoader, setAppLoader] = useState(false);
    const [contactLinkData, setContactLinkData] = useState([]);

    useEffect(() => {
        getContactUsLinkAPI();
        trackScreen(SCREEN_CLASS.CONTACT_RANE,ROUTE_KEYS.CONTACT_RANE);
    }, [isNetInfo]);

    async function getContactUsLinkAPI() {
        setAppLoader(true);
        let payload = { resource: ["link"] }
        let response = await aboutUsDetails(payload);
        const responseData = response?.link?.contact;
        setContactLinkData(responseData);
        setAppLoader(false);
    }

    return (
        <AppContent>
            <CommonHeader />
            <View style={{ marginHorizontal: convertWidth(4) }}>
                <Header title={contactLinkData?.label} />
            </View>
            {appLoader ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color={COLORS.secondary} size="large" style={STYLES.IndicatorStyle} />
                </View>
                :
                <WebViewLinkShow url={contactLinkData?.href} />
            }
        </AppContent>
    );
}