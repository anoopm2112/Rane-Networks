import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// Custom Imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import { COLORS } from '../common/enums/colors';
import CustomIcon from '../assets/CustomIcon';

const CustomSnackbar = ({ visible, message, onHideSnackbar, internetToast }) => {
    const animation = useRef(new Animated.Value(0)).current;

    const showSnackbar = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const hideSnackbar = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => onHideSnackbar(false));
    };

    useEffect(() => {
        if (visible) {
            showSnackbar();
            const timer = setTimeout(() => {
                hideSnackbar();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0],
    });

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            alignItems: 'center'
        },
        mainView: {
            backgroundColor: COLORS.snackBarBg,
            padding: convertHeight(8),
            width: '91%',
            transform: [{ translateY }],
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: convertHeight(10),
            borderRadius: 8
        },
        textStyle: {
            color: COLORS.secondary,
            paddingLeft: convertWidth(10),
            fontFamily: 'Lato-Regular',
            // textTransform: 'uppercase',
            // fontWeight: 'bold',
            fontSize: convertHeight(10),
            width: convertWidth(270)
        }
    });

    return (
        <View style={styles.container}>
            {visible && (
                <Animated.View style={styles.mainView}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {internetToast ?
                            <CustomIcon iconPackage={'MaterialIcons'} name="wifi-off" size={convertHeight(15)} color={COLORS.secondary} />
                            :
                            <CustomIcon iconPackage={'AntDesign'} name="checkcircle" size={convertHeight(15)} color={COLORS.secondary} />
                        }
                        <Text style={styles.textStyle}>{message}</Text>
                    </View>
                    <TouchableOpacity onPress={() => hideSnackbar()}>
                        <MaterialIcons name="close" size={convertHeight(17)} color={COLORS.secondary} />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

export default CustomSnackbar;
