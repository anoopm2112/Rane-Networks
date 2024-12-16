import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';
// custom imports
import { COLORS } from '../../common/enums/colors';

const AppLoadingModal = ({ visible }) => {
    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <View style={styles.modalContainer}>
                <ActivityIndicator size="large" color={COLORS.secondary} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default AppLoadingModal;
