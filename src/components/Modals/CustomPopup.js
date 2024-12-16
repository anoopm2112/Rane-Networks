import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
// custom imports
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';
import { COLORS } from '../../common/enums/colors';

const CustomPopup = ({ title, message, visible, onClose, onConfirm }) => {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.modalBackground,
            alignItems: 'center',
            justifyContent: 'center',
        },
        popupBox: {
            width: '80%',
            backgroundColor: COLORS.grey,
            // borderRadius: convertHeight(5),
            padding: convertHeight(15),
            alignItems: 'left',
            justifyContent: 'center',
            borderWidth: 0.25,
            borderColor: COLORS.borderline
        },
        title: {
            fontSize: convertHeight(14),
            padding: convertHeight(5),
            textAlign: 'left',
            fontWeight: 'bold',
            color: COLORS.secondary,
        },
        message: {
            fontSize: convertHeight(12),
            textAlign: 'left',
            color: COLORS.secondary,
            padding: convertHeight(5)
        },
        closeButton: {
            width: '30%',
            padding: convertHeight(8),
            marginTop: convertHeight(7),
            alignItems: 'center',
            borderRadius: 3
        },
        closeText: {
            color: 'white',
            fontWeight: 'bold',
        },
    });

    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <View style={styles.container}>
                <View style={styles.popupBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
                        <TouchableOpacity style={[styles.closeButton, { backgroundColor: COLORS.secondary }]}
                            onPress={onClose}>
                            <Text style={[styles.closeText, { color: COLORS.black }]}>No</Text>
                        </TouchableOpacity>
                        <View style={{ width: convertWidth(10) }}></View>
                        <TouchableOpacity style={[styles.closeButton, { backgroundColor: COLORS.bottomBarActive }]}
                            onPress={onConfirm}>
                            <Text style={styles.closeText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomPopup;
