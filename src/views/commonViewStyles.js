import { StyleSheet } from 'react-native';
//custom imports
import { COLORS } from '../common/enums/colors';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary
    },
    welcomeContainer: {
        padding: convertWidth(13),
    },
    nameContainer: {
        padding: convertWidth(8)
    },
    welcomeText: {
        margin:convertHeight(4),
        color: COLORS.highlitedtext,
        fontSize: convertHeight(12),
        fontFamily: 'Lato-Regular'
    },
    welcomeTextHeader: {
        fontWeight: '400',
        color: COLORS.secondary,
        fontSize: convertHeight(26),
        lineHeight: convertHeight(32),
        fontFamily: 'Lato-Regular'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerImageStyle: {
        height: convertHeight(50),
        width: convertWidth(150)
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: convertHeight(12),
        borderWidth: 0.25,
        borderColor: COLORS.borderline,
        borderRadius: 4,
        justifyContent: 'space-between',
        marginHorizontal: convertWidth(16),
        marginVertical: convertHeight(8),
        backgroundColor: COLORS.darkblue,
    },
    cardtext: {
        color: COLORS.secondary,
        fontSize: convertHeight(12),
        fontFamily: 'Lato-Bold'
    },
    notifyIconContainer: {
        position: 'absolute',
        right: -10,
        top: -9
    },
    // search
    searchiconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: convertWidth(40),
        borderTopRightRadius: convertHeight(3),
        borderBottomRightRadius: convertHeight(3),
        backgroundColor: COLORS.grey
    },
    // Article Screen Horizontal Date
    notifyIconContainerTwo: {
        position: 'absolute',
        right:-2,
        top: -2
    },
    hcard: {
        width: convertWidth(50),
        height: convertHeight(50),
        backgroundColor: COLORS.transparent,
        marginHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.25,
        borderColor: COLORS.borderline,
        borderRadius: 5,
        marginBottom: convertHeight(25)
    },
    flatListContainer: {
        paddingHorizontal: 10
    },
    noSearchResultText: {
        fontSize: convertHeight(14),
        // fontWeight: 'bold',
        color: COLORS.secondary,
        textAlign: 'center'
        // padding: convertHeight(5),
    },
});

export default styles;