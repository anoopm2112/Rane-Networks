import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
// custom imports
import WebView from 'react-native-webview';
import { COLORS } from '../common/enums/colors';
import WallStyleSheetFactory from '../views/wall/wallStyleSheetFactory';

export default function WebViewLinkShow(props) {
    const { url } = props;
    const STYLES = WallStyleSheetFactory.getStyles().SourceScreenStyles;

    const [error, setError] = useState(false);

    const handleWebViewError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        if (nativeEvent.code === -6) {
            setError(true);
        }
    };

    const IndicatorLoadingView = () => {
        return (
            <ActivityIndicator color={COLORS.secondary} size="large" style={STYLES.IndicatorStyle} />
        );
    };

    const isValidUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(url);

    return (
        <View style={{ flex: 1 }}>
            {(error || !isValidUrl) ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={STYLES.errorText}>Oops! Webpage not available</Text>
                </View>
            ) : (
                <WebView
                    style={{ backgroundColor: COLORS.primary }}
                    source={{ uri: url }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    renderLoading={IndicatorLoadingView}
                    startInLoadingState={true}
                    onError={handleWebViewError}
                />
            )}
        </View>
    );
}