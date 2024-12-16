import React from 'react';
import { View, Image } from 'react-native';
// custom imports
import styles from './commonCompStyle';
import AssetIconsPack from '../assets/IconProvide';

const CommonHeader = () => {
    return (
        <View style={styles.raneCommonHeader}>
            <Image style={styles.headerImageStyle} 
                source={AssetIconsPack.icons.app_logo} />
        </View>
    );
};

export default CommonHeader;

