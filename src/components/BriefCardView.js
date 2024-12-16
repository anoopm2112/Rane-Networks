import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// custom imports
import { COLORS } from '../common/enums/colors';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import CustomIcon from '../assets/CustomIcon';

export default function BriefCardView(props) {
    const { onRemoveAction, onItemClickAction, index, item, onViewWeb, onShareAction } = props;
    const { name, date } = item;

    const styles = StyleSheet.create({
        cardContainer: {
            flexDirection: 'row',
            borderWidth: 0.25,
            borderColor: COLORS.borderline,
            borderRadius: 8,
            backgroundColor: COLORS.grey,
            marginBottom: convertHeight(12)
        },
        leftSide: {
            flex: 1,
            paddingHorizontal: convertHeight(8),
            paddingVertical: convertHeight(12)
        },
        mainText: {
            fontSize: convertHeight(12),
            fontFamily: 'Lato-Bold',
            color: COLORS.secondary,
        },
        subText: {
            fontSize: convertHeight(7),
            color: COLORS.secondary,
            fontFamily: 'Lato-Light',
            paddingTop: convertHeight(3)
        },
        rightSide: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        iconContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            width: convertWidth(50),
        },
        iconBorder: {
            height: '100%',
            width: 0.25,
            backgroundColor: COLORS.borderline
        },
        iconText: {
            fontSize: convertHeight(8),
            width: convertWidth(35),
            paddingTop: convertHeight(3),
            textAlign: 'center',
            color: COLORS.secondary
        }
    });

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => onItemClickAction(item)}>
            <View style={styles.leftSide}>
                <Text style={styles.mainText}>{name}</Text>
                <Text style={styles.subText}>{date}</Text>
            </View>
            <View style={styles.rightSide}>
                <View style={styles.iconBorder} />
                <View style={styles.iconBorder} />
                <TouchableOpacity style={styles.iconContainer} onPress={() => onRemoveAction(item)}>
                    <CustomIcon iconPackage={'FontAwesome'} name={'bookmark'} size={convertHeight(10)} color={COLORS.secondary} />
                    <Text style={styles.iconText}>Unsave</Text>
                </TouchableOpacity>
                <View style={styles.iconBorder} />
                <View style={styles.iconBorder} />
                <TouchableOpacity style={styles.iconContainer} onPress={() => onShareAction(item)}>
                    <CustomIcon iconPackage={'FontAwesome5'} name={'share-alt'} size={convertHeight(10)} color={COLORS.secondary} />
                    <Text style={styles.iconText}>Share</Text>
                </TouchableOpacity>
                <View style={styles.iconBorder} />
                <View style={styles.iconBorder} />
                <TouchableOpacity style={styles.iconContainer} onPress={() => onViewWeb(item)}>
                    <CustomIcon iconPackage={'MaterialCommunityIcons'} name={'web'} size={convertHeight(10)} color={COLORS.secondary} />
                    <Text style={styles.iconText}>View on web</Text>
                </TouchableOpacity>
                <View style={styles.iconBorder} />
            </View>
        </TouchableOpacity>
    );
}