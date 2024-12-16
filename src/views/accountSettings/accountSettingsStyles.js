import { StyleSheet } from 'react-native';
import { COLORS } from '../../common/enums/colors';
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';

class MyStyles {
    static AboutUsStyles = {
        profileContainer: {
            borderColor: COLORS.borderline,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        profileText: {
            fontSize: 14,
            color: COLORS.secondary,
            padding: 12,
            fontFamily: 'Lato-Regular'
        },
        subLinkContainer: {
            borderColor: COLORS.borderline,
            backgroundColor: COLORS.grey,
            borderWidth: 0.25,
            borderRadius: 8,
            marginTop: convertHeight(8)
        }
    };

    static accountScreenStyles = {
        mainContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.primary,
            paddingVertical: convertHeight(10)
        },
        container: {
            backgroundColor: COLORS.grey,
            borderWidth: 0.25,
            borderColor: COLORS.borderline,
            borderRadius: 5
        },
        headingText: {
            fontSize: 13,
            fontWeight: 'bold',
            color: COLORS.secondary
        },
        briefSettingsHeaderText: {
            fontSize: 14,
            color: COLORS.secondary,
            padding: 12,
            fontFamily: 'Lato-Bold'
        },
        logoutContainer: {
            backgroundColor: COLORS.grey,
            borderWidth: 0.25,
            borderColor: COLORS.borderline,
            borderRadius: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        profileContainer: {
            borderColor: COLORS.borderline,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        profileText: {
            fontSize: 14,
            color: COLORS.secondary,
            padding: 12,
            fontFamily: 'Lato-Regular'
        },
        BriefRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: COLORS.iconBorder,
        },
        BriefColumn: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: convertHeight(7),
            paddingHorizontal: 5,
            fontSize: 13,
            color: COLORS.secondary
        },
        BriefCardContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderColor: COLORS.borderline,
            backgroundColor: COLORS.primary,
            flexDirection: 'row',
            borderColor: COLORS.iconBorder,
        },
        BriefCardColumn: {
            paddingVertical: 10,
        },
        BriefTitleTextContainer: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
        },
        switch: {
            transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
        },
        socialIconContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        round: {
            width: convertHeight(40),
            height: convertHeight(40),
            borderRadius: convertHeight(40),
            backgroundColor: COLORS.secondary,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: convertWidth(12)
        },
        icon: {
            width: convertHeight(35),
            height: convertHeight(35),
        },
        versionText: {
            fontSize: 14,
            color: COLORS.secondary,
            fontFamily: 'Lato-Regular'
        }
    };
}

class AccountSettingsStyleSheetFactory {
    static getStyles() {
        return StyleSheet.create({
            accountScreenStyles: MyStyles.accountScreenStyles, // My Account Settings Screen
            aboutUsStyles: MyStyles.AboutUsStyles // About Us Screen
        });
    }
}

export default AccountSettingsStyleSheetFactory;
