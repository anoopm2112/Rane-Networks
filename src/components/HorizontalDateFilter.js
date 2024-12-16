import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// custom imports
import { COLORS } from '../common/enums/colors';
import CustomIcon from '../assets/CustomIcon';
import styles from '../views/commonViewStyles';

const HorizontalDateFilter = ({ item, isSelected, onSelect, index }) => {
    const dateNameParts = item.date.split(' ');
    const monthName = dateNameParts[0];
    const dateNumber = dateNameParts.slice(1).join(' ');
    const monthOnly = dateNumber.split(' ')[0];

    return (
        <TouchableOpacity onPress={() => onSelect(item.date)}>
            <View
                style={[styles.hcard, { backgroundColor: isSelected ? COLORS.notify : COLORS.transparent }]}>
                {item.dateWiseReadStatus === false &&
                    <View style={styles.notifyIconContainerTwo}>
                        <CustomIcon iconPackage={'MaterialIcons'} name="fiber-manual-record" size={12} color={COLORS.notify} />
                    </View>}
                <Text style={styles.cardtext}>{monthName}</Text>
                {dateNumber && <Text style={styles.cardtext}>{monthOnly}</Text>}
            </View>
        </TouchableOpacity>
    );
};

export default HorizontalDateFilter;

