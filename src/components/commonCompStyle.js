import { StyleSheet } from 'react-native';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import { COLORS } from '../common/enums/colors';

const styles = StyleSheet.create({
    header: {
        height: convertHeight(40),
        paddingHorizontal: convertHeight(8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    raneCommonHeader: {
        height: convertHeight(40),
        padding: convertHeight(12),
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: convertHeight(12),
        fontWeight: '400',
        color: COLORS.secondary,
        fontFamily: 'Lato-Bold',
    },
    headerImageStyle: {
        width: convertWidth(90),
        resizeMode: 'contain',
    }
});

export default styles;