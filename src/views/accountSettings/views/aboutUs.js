import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
// Custom Imports
import { AppContent, CommonHeader, Header } from '../../../components';
import STRINGS from '../../../common/strings';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import AccountSettingsStyleSheetFactory from '../accountSettingsStyles';
import { ROUTE_KEYS, SCREEN_CLASS } from '../../../navigation/constants';
import { trackScreen } from '../../../common/utils/analyticsUtils';

export default function AboutUs(props) {
    const { navigation } = props;
    const { sourceData } = props.route.params;
    const STYLES = AccountSettingsStyleSheetFactory.getStyles().aboutUsStyles;

    useEffect(() =>{
       trackScreen(SCREEN_CLASS.ABOUT_US,ROUTE_KEYS.ABOUT_US)
    })

    const renderItemData = (item, index) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate(ROUTE_KEYS.ABOUT_LINK_PAGE, { digestName: item.label, digestLink: item.href })}
                key={index.toString()} style={STYLES.subLinkContainer}>
                <Text style={[STYLES.profileText, { fontFamily: 'Lato-Bold' }]}>{item.label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <AppContent>
            <CommonHeader />
            <Header title={STRINGS.about_us} onPressBack={() => navigation.goBack(null)} />
            <View style={{ marginHorizontal: convertWidth(15), marginTop: convertHeight(5) }}>
                <TouchableOpacity onPress={() => { Linking.openURL(`mailto:${sourceData?.email}`) }} style={[STYLES.profileContainer, { borderTopRightRadius: 5, borderTopLeftRadius: 5, borderWidth: 0.25 }]}>
                    <Text style={[STYLES.profileText, { fontFamily: 'Lato-Bold' }]}>Email Address:</Text>
                    <Text numberOfLines={1} style={[STYLES.profileText, { flex: 1, textAlign: 'right' }]}>{sourceData?.email}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Linking.openURL(`tel:${sourceData?.phone}`); }} style={[STYLES.profileContainer, { borderRightWidth: 0.25, borderLeftWidth: 0.25 }]}>
                    <Text style={[STYLES.profileText, { fontFamily: 'Lato-Bold' }]}>Phone Number:</Text>
                    <Text numberOfLines={1} style={[STYLES.profileText, { flex: 1, textAlign: 'right' }]}>{sourceData?.phone}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Linking.openURL(sourceData?.website) }} style={[STYLES.profileContainer, { borderBottomRightRadius: 5, borderBottomLeftRadius: 5, borderWidth: 0.25 }]}>
                    <Text style={[STYLES.profileText, { fontFamily: 'Lato-Bold' }]}>Website:</Text>
                    <Text numberOfLines={1} style={[STYLES.profileText, { flex: 1, textAlign: 'right' }]}>{sourceData?.website}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: convertWidth(15), marginVertical: convertHeight(4) }}>
                {sourceData?.link?.map((item, index) => renderItemData(item, index))}
            </View>
        </AppContent>
    );
}