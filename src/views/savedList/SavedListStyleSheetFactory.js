import { StyleSheet } from 'react-native';
import LatoRegular from '../../assets/fonts/Lato-Regular.ttf';
const { COLORS } = require("../../common/enums/colors");
const { convertWidth, convertHeight } = require("../../common/utils/dimentionUtils");

class MyStyles {
    static SavedListStyles = {
        container: {
            flex: 1,
            paddingHorizontal: convertWidth(14),
            paddingTop: convertHeight(5)
        },
        noSearchResultDescText: {
            fontSize: convertHeight(12),
            color: COLORS.secondary,
            fontFamily: LatoRegular,
            textAlign: 'center'
        }
    };
}

class SavedListStyleSheetFactory {
    static getStyles() {
        return StyleSheet.create({
            mySavedScreenStyles: MyStyles.SavedListStyles, // My Saved List Screen
        });
    }
}

export default SavedListStyleSheetFactory;