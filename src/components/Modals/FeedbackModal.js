import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform
} from 'react-native';
// custom imports
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';
import { COLORS } from '../../common/enums/colors';
import CustomIcon from '../../assets/CustomIcon';
import STRINGS from '../../common/strings';
import { ArticleActions } from '../../common/enums/ArticleActions';

const FeedbackModal = ({ visible, closeModal, feedbackType, onDataReceived, feedBackLoader }) => {
    const textInputRef = useRef(null);

    const [inputText, setInputText] = useState('');
    const [keyboardAware, setKeyboardAware] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            setKeyboardAware(true);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardAware(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const STYLES = StyleSheet.create({
        mainContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: keyboardAware ? convertHeight(10) : convertHeight(50),
            paddingHorizontal: convertWidth(14),
            backgroundColor: COLORS.modalBackground
        },
        container: {
            backgroundColor: COLORS.snackBarBg,
            borderRadius: 8,
            borderWidth: 0.25,
            borderColor: COLORS.borderline,
        },
        topContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomColor: COLORS.borderline,
            borderBottomWidth: 0.25,
            paddingHorizontal: convertWidth(15),
            paddingTop: convertHeight(7),
            paddingBottom: convertHeight(12),
        },
        textInputContainer: {
            padding: convertWidth(15),
        },
        inputText: {
            flex: 1,
            padding: convertHeight(6),
            color: COLORS.black,
            height: convertHeight(64)
        },
        btnContainer: {
            alignSelf: 'flex-end',
            backgroundColor: COLORS.bottomBarActive,
            borderRadius: 8,
            paddingHorizontal: convertWidth(32),
            paddingVertical: convertHeight(9),
            marginHorizontal: convertHeight(14),
            marginBottom: convertHeight(10),
            flexDirection: 'row',
            alignItems: 'center'
        },
        plusIconWrapper: {
            justifyContent: 'center',
            alignItems: 'center',
            width: convertWidth(40),
            borderTopRightRadius: convertHeight(3),
            borderBottomRightRadius: convertHeight(3),
            backgroundColor: COLORS.grey,
        },
        listItemContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: COLORS.grey,
            padding: convertHeight(7),
            borderRadius: convertHeight(50),
            marginBottom: convertWidth(5),
            marginRight: convertWidth(5),
            width: convertWidth(148),
            elevation: 5,
        },
        feedbackTypeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: convertWidth(15),
            paddingHorizontal: convertWidth(15),
        }
    });

    const sendFeedBack = () => {
        onDataReceived(inputText, feedbackType?.itemData);
        setInputText('');
    };

    const clearInput = () => {
        setInputText('');
        closeModal();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}
            onShow={() => textInputRef.current.focus()}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <View style={STYLES.mainContainer}>
                    <View style={STYLES.container}>
                        <View style={STYLES.feedbackTypeContainer}>
                            <Text style={{ color: COLORS.secondary, fontSize: convertHeight(13), fontFamily: 'Lato-Bold' }}>{feedbackType?.name === ArticleActions.upVote ? STRINGS.like_article : STRINGS.unlike_article}</Text>
                            <TouchableOpacity onPress={clearInput}>
                                <CustomIcon iconPackage={'MaterialIcons'} name={'close'} size={convertHeight(13)} color={COLORS.secondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={STYLES.topContainer}>
                            <Text style={{ color: COLORS.secondary, fontSize: convertHeight(13), fontFamily: 'Lato-Regular' }}>
                                {feedbackType?.itemData?.title}
                            </Text>
                        </View>

                        <View style={STYLES.textInputContainer}>
                            <Text style={{ color: COLORS.secondary, fontFamily: 'Lato-Regular', paddingBottom: convertHeight(3) }}>{STRINGS.feedback}</Text>
                            <View style={{ borderRadius: convertHeight(3), backgroundColor: COLORS.secondary, flexDirection: 'row' }}>
                                <TextInput
                                    ref={textInputRef}
                                    style={STYLES.inputText}
                                    value={inputText}
                                    maxLength={200}
                                    textAlignVertical="top"
                                    placeholder='Type your feedbacks here'
                                    placeholderTextColor={COLORS.placeHolder}
                                    onChangeText={setInputText}
                                    multiline={true}
                                    autoFocus={true}
                                />
                            </View>
                            <Text style={{ color: COLORS.secondary, textAlign: 'right', fontSize: convertHeight(10) }}>({inputText.length}/200)</Text>
                        </View>

                        <TouchableOpacity style={STYLES.btnContainer} onPress={sendFeedBack}>
                            <Text style={{ color: COLORS.secondary, fontFamily: 'Lato-Bold', paddingRight: convertWidth(5) }}>{STRINGS.submit}</Text>
                            {feedBackLoader ?
                                <ActivityIndicator size={'small'} color={COLORS.secondary} />
                                :
                                <CustomIcon iconPackage={'MaterialIcons'} name={feedbackType?.name === ArticleActions.upVote ? 'thumb-up' : 'thumb-down'} size={convertHeight(13)} color={COLORS.secondary} />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default FeedbackModal;