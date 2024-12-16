import React, { forwardRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
// custom imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import { COLORS } from '../common/enums/colors';
import STRINGS from '../common/strings';
import CustomIcon from '../assets/CustomIcon';

const InputText = forwardRef((props, ref) => {
    const { isEditable = true, onChangeInputText, onSearchIconPress, value, onSearchCloseIconPress } = props;

    const STYLES = StyleSheet.create({
        searchcontainer: {
            flexDirection: 'row',
            borderWidth: 0.25,
            borderColor: COLORS.borderline,
            borderRadius: convertHeight(3),
            paddingLeft: convertWidth(5),
            height: convertHeight(35)
        },
        searchinput: {
            flex: 1,
            padding: convertHeight(6),
            color: COLORS.secondary,
        },
        searchiconWrapper: {
            justifyContent: 'center',
            alignItems: 'center',
            width: convertWidth(40),
            height: convertHeight(34.3),
            borderTopRightRadius: convertHeight(4),
            borderBottomRightRadius: convertHeight(4),
            borderTopWidth: 0.1,
            borderRightWidth: 0.2,
            borderBottomWidth: 0.2,
            borderColor: COLORS.borderline,
            backgroundColor: COLORS.grey
        },
        closeIconWrapper: {
            justifyContent: 'center',
            alignItems: 'center',
            width: convertWidth(40),
        }
    });

    return (
        <View style={STYLES.searchcontainer}>
            <TextInput
                ref={ref}
                style={STYLES.searchinput}
                underlineColorAndroid="transparent"
                placeholder={STRINGS.search}
                placeholderTextColor={COLORS.searchText}
                editable={isEditable}
                onChangeText={(text) => onChangeInputText(text)}
                autoFocus={true}
                onSubmitEditing={onSearchIconPress}
                value={value}
                onPressIn={() => isEditable ? {} : onSearchIconPress()}
            />
            {value &&
                <TouchableOpacity activeOpacity={0.8} style={STYLES.closeIconWrapper} onPress={() => onSearchCloseIconPress()}>
                    <CustomIcon iconPackage={'AntDesign'} name="close" size={convertHeight(14)} color={COLORS.secondary} />
                </TouchableOpacity>
            }
            <TouchableOpacity activeOpacity={0.8} style={STYLES.searchiconWrapper} onPress={() => onSearchIconPress()}>
                <CustomIcon iconPackage={'AntDesign'} name="search1" size={convertHeight(14)} color={COLORS.secondary} />
            </TouchableOpacity>
        </View>
    );
});

export default InputText;