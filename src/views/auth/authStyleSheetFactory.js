import { StyleSheet, Platform } from 'react-native';
const { COLORS } = require("../../common/enums/colors");
const { convertWidth, convertHeight } = require("../../common/utils/dimentionUtils");

class MyStyles {
    static LoginPage = {
        container: {
            flex: 1,
            backgroundColor: COLORS.primary,
        },
        webview: {
            flex: 1,
            backgroundColor: COLORS.primary
        },
        IndicatorStyle: {
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        },
        noInternetContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        noInternetText: {
            color: COLORS.secondary,
            marginVertical: convertHeight(8),
            fontSize: convertHeight(13),
            fontFamily: 'Lato-Bold'
        },
        no_internet_Icon: {
            height: convertHeight(70),
            width: convertHeight(70)
        },
        checkConnectionText: {
            color: COLORS.secondary,
            marginBottom: convertHeight(14),
            fontSize: convertHeight(10),
            fontFamily: 'Lato-Regular'
        },
        okBtnContainer: {
            backgroundColor: COLORS.bottomBarActive,
            height: convertHeight(30),
            width: convertWidth(80),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5
        },
        background: {
            height: '100%',
            width: '100%'
        },
        backButtonContainer: {
            height: convertHeight(40),
            width: convertHeight(40),
            marginTop: Platform.OS === 'ios' ? convertHeight(40) : convertHeight(5),
            marginLeft: convertWidth(15),
            marginBottom: convertHeight(5),
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
        }
    };
}

class AuthStyleSheetFactory {
    static getStyles() {
        return StyleSheet.create({
            authScreenStyles: MyStyles.LoginPage, // Auth Screen
        });
    }
}

export default AuthStyleSheetFactory;