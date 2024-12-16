import React from 'react';
import { SafeAreaView, ImageBackground, StyleSheet, StatusBar } from 'react-native';
// custom imports
import AssetIconsPack from '../assets/IconProvide';
import { COLORS } from '../common/enums/colors';

export default function AppContent({ children }) {

    const STYLES = StyleSheet.create({
        background: {
            width: '100%', 
            height: '100%'
        },
    });

    return (
        <SafeAreaView>
            <StatusBar backgroundColor={COLORS.systemBar} barStyle={'light-content'} />
            <ImageBackground style={STYLES.background} 
                source={AssetIconsPack.icons.app_background}>
                {children}
            </ImageBackground>
        </SafeAreaView>
    );
}