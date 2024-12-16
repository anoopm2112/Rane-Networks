import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
// custom imports
import { COLORS } from '../common/enums/colors';
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import CustomIcon from '../assets/CustomIcon';

const BottomSheet = ({ refRBSheet, bottomList, onPressAction }) => {

    const Styles = StyleSheet.create({
        buttonContainer: {
            padding: convertHeight(12.5),
            borderBottomColor: COLORS.bottomSheetBorder,
            borderWidth: 0.25,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.bottomSheetBackground
        },
        buttonText: {
            fontFamily: 'Lato-Regular',
            fontSize: convertHeight(12.9),
            color: COLORS.secondary,
            paddingLeft: convertWidth(8)
        }
    });

    return (
        <RBSheet height={Platform.OS === 'ios' ? convertHeight(180) : convertHeight(160)} ref={refRBSheet} closeOnDragDown={false}
            customStyles={{
                container: {
                    backgroundColor: COLORS.darkblue,
                    borderTopRightRadius: 8,
                    borderTopLeftRadius: 8,
                    borderTopColor: COLORS.bottomSheetBorder,
                    borderWidth: 0.5
                }
            }}>
            {bottomList?.map((item) => {
                return (
                    <TouchableOpacity key={item.id} onPress={() => onPressAction(item.name, item.actionName, item)} style={Styles.buttonContainer}>
                        {item.id === 1 ? (
                            <CustomIcon iconPackage={'FontAwesome'} name={item.bookmark ? 'bookmark' : 'bookmark-o'} size={convertHeight(12.9)} color={COLORS.secondary} />
                        ) : item.id === 2 ? (
                            <CustomIcon iconPackage={'FontAwesome5'} name={item.iconName} size={convertHeight(12.9)} color={COLORS.secondary} />
                        ) : item.id === 3 ? (
                            <CustomIcon iconPackage={'Feather'} name={item.iconName} size={convertHeight(12.9)} color={COLORS.secondary} />
                        ) : (
                            <CustomIcon iconPackage={'MaterialCommunityIcons'} name={item.iconName} size={convertHeight(12.9)} color={COLORS.secondary} />
                        )}

                        {item.id === 1 ? (
                            <Text style={Styles.buttonText}>{item.bookmark ? 'Unsave' : 'Save'}</Text>
                        ) : (
                            <Text style={Styles.buttonText}>{item.name}</Text>
                        )}
                    </TouchableOpacity> 
                );
            })}
        </RBSheet>
    );
};

export default BottomSheet;
