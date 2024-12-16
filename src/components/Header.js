import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// custom imports
import styles from './commonCompStyle';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import { COLORS } from '../common/enums/colors';
import CustomIcon from '../assets/CustomIcon';

const Header = ({ title, onPressBack, onPressMore, dateShow, menuBar, fromLink }) => {


    const STYLES = StyleSheet.create({
        backButtonContainer: {
            height: convertHeight(25),
            width: convertHeight(25),
            justifyContent: 'center',
            alignItems: 'center'
        },
        dateText: {
            color: COLORS.secondary,
            fontFamily: 'Lato-Regular',
            fontSize: 12,
            // paddingTop: convertHeight(2)
        },
        line: {
            marginLeft: convertWidth(8),
            marginRight: convertWidth(8),
            height: convertHeight(12),
            width: 0.8,
            backgroundColor: COLORS.borderline
        }
    });

    return (
        <SafeAreaView>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {onPressBack && (
                            <TouchableOpacity style={STYLES.backButtonContainer} onPress={onPressBack}>
                                <MaterialIcons name="arrow-back-ios" size={convertHeight(14)} color={COLORS.secondary} />
                            </TouchableOpacity>
                        )}
                        <Text numberOfLines={1} style={[styles.title, {width: dateShow ? convertWidth(212) : '90%'}]}>{title}</Text>
                    </View>
                    {dateShow &&
                        <>
                            <View style={STYLES.line} />
                            <Text style={STYLES.dateText}>{dateShow}</Text>
                        </>}
                </View>
                {(dateShow && menuBar) &&
                    <TouchableOpacity onPress={onPressMore}>
                        <CustomIcon iconPackage={'Feather'} name="more-vertical" size={convertHeight(19)} color={COLORS.secondary} />
                    </TouchableOpacity>}
            </View>
        </SafeAreaView>
    );
};

export default Header;
