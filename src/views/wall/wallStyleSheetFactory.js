import { StyleSheet } from 'react-native';
const { COLORS } = require("../../common/enums/colors");
const { convertWidth, convertHeight } = require("../../common/utils/dimentionUtils");


class MyStyles {
    static ArticlePage = {
        container: {
            flex: 1,
            paddingHorizontal: convertWidth(14),
        },
        searchContainerArticle: {
            marginHorizontal: convertHeight(13),
            marginTop: convertHeight(8),
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        calendar: {
            borderWidth: 1,
            borderRadius: 4,
            borderColor: 'gray',
            backgroundColor: COLORS.grey,
            width: convertHeight(240),
            height: convertHeight(258)
        },
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)'
        },
    };

    static SourcePage = {
        IndicatorStyle: {
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        },
        errorText: {
            color: COLORS.secondary,
            fontFamily: 'Lato-Bold',
            fontSize: convertHeight(15)
        }
    };

    static SearchPage = {
        listMainContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: convertWidth(30),
            paddingVertical: convertHeight(8),
            alignItems: 'center'
        },
        searchText: {
            color: COLORS.secondary,
            paddingLeft: convertWidth(10),
            fontSize: convertHeight(11),
            fontWeight: '300',
            width: convertWidth(260)
        },
        recentHeading: {
            color: COLORS.secondary,
            paddingLeft: convertWidth(30),
            paddingVertical: convertHeight(10),
            fontSize: convertHeight(12),
            fontWeight: '400'
        },
        noSearchResultContainer: {
            paddingTop: convertHeight(80),
            justifyContent: 'center',
            alignItems: 'center',
        },
        noSearchResultDescText: {
            fontSize: convertHeight(12),
            color: COLORS.secondary,
            fontFamily: 'Lato-Regular',
            textAlign: 'center'
        }
    };
}

class WallStyleSheetFactory {
    static getStyles() {
        return StyleSheet.create({
            ArticleScreenStyles: MyStyles.ArticlePage, // Article Screen
            SourceScreenStyles: MyStyles.SourcePage, // Source Screen
            SearchScreenStyles: MyStyles.SearchPage, // Search Screen
        });
    }
}

export default WallStyleSheetFactory;