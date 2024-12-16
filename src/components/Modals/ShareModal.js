import React, { useState, useRef, useEffect } from 'react';
import { 
    View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform 
} from 'react-native';
// custom imports
import { convertHeight, convertWidth } from '../../common/utils/dimentionUtils';
import { COLORS } from '../../common/enums/colors';
import CustomIcon from '../../assets/CustomIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NOTIFY_DEVICE_TOKEN } from '../../common/constants/AsyncStorageConst';
import { shareViaEmail } from '../../views/wall/api/wallApi';

const ShareModal = ({ visible, closeModal, article, showSnackBar, errorShowSnackBar }) => {
    const textInputRef = useRef(null);

    const [items, setItems] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [keyboardAware, setKeyboardAware] = useState(false);
    const [shareLoader, setShareLoader] = useState(false);

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

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // email validation regex pattern

    const handleAddItem = () => {
        if (inputText.trim() === '') {
            setIsValid(false);
        } else if (!emailRegex.test(inputText.trim())) {
            setIsValid(false);
        } else {
            setIsValid(true);
            setItems(prevItems => [...prevItems, inputText.trim()]);
            setInputText('');
        }
    };

    const renderItem = ({ item }) => (
        <View style={STYLES.listItemContainer}>
            <Text numberOfLines={1} style={{ color: COLORS.secondary, fontFamily: 'Lato-Regular', fontSize: convertHeight(9), width: convertWidth(115) }}>{item}</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(item)}>
                <CustomIcon iconPackage={'MaterialIcons'} name={'close'} size={convertHeight(13)} color={COLORS.secondary} />
            </TouchableOpacity>
        </View>
    );

    const handleRemoveItem = (item) => {
        setItems(prevItems => prevItems.filter(prevItem => prevItem !== item));
    };

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
            paddingBottom: convertHeight(8),
            borderBottomColor: COLORS.borderline,
            borderBottomWidth: 0.25,
            padding: convertWidth(15),
        },
        textInputContainer: {
            paddingTop: convertWidth(20),
            padding: convertWidth(15),
        },
        inputText: {
            flex: 1,
            padding: convertHeight(6),
            color: COLORS.black,
            height: convertHeight(34)
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
        }
    });

    const sendEmail = async () => {
        setShareLoader(true);
        const deviceToken = await AsyncStorage.getItem(NOTIFY_DEVICE_TOKEN);
        // Convert array of items to a comma-separated string
        if (items && items.length > 0) {
            let payload = {
                email: items
            };
            const response = await shareViaEmail(article.slug, article.gid, payload);
            if (response === 200) {
                showSnackBar(true);
            } else {
                errorShowSnackBar(true);
            }
            clearInput()
        } else {
            if (inputText.trim() === '') {
                setIsValid(false);
            } else if (!emailRegex.test(inputText.trim())) {
                setIsValid(false);
            } else {
                setIsValid(true);
                if (items) {
                    let payload = {
                        email: [inputText.trim()]
                    };
                    const response = await shareViaEmail(article.slug, article.gid, payload);
                    if (response === 200) {
                        showSnackBar(true);
                    } else {
                        errorShowSnackBar(true);
                    }
                }
                clearInput()
            }
        }
        setShareLoader(false);
    };


    const clearInput = () => {
        setInputText('');
        setIsValid(true);
        setItems([]);
        closeModal();
    };

    return (
        <Modal visible={visible} animationType="none" transparent={true}
            onShow={() => textInputRef.current.focus()}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <View style={STYLES.mainContainer}>
                    <View style={STYLES.container}>
                        <View style={STYLES.topContainer}>
                            <Text style={{ color: COLORS.secondary, fontSize: convertHeight(13), fontFamily: 'Lato-Regular' }}>Share</Text>
                            <TouchableOpacity onPress={clearInput}>
                                <CustomIcon iconPackage={'MaterialIcons'} name={'close'} size={convertHeight(13)} color={COLORS.secondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={STYLES.textInputContainer}>
                            <Text style={{ color: COLORS.secondary, fontFamily: 'Lato-Regular', paddingBottom: convertHeight(3) }}>Email Address</Text>
                            <View style={{ flexDirection: 'row', borderRadius: convertHeight(3), backgroundColor: COLORS.secondary }}>
                                <TextInput style={STYLES.inputText}
                                    ref={textInputRef}
                                    value={inputText}
                                    onChangeText={(text) => {
                                        setInputText(text);
                                        setIsValid(true);
                                    }}
                                />
                                <TouchableOpacity style={STYLES.plusIconWrapper} onPress={handleAddItem}>
                                    <CustomIcon iconPackage={'MaterialIcons'} name={'add'} size={convertHeight(13)} color={COLORS.secondary} />
                                </TouchableOpacity>
                            </View>
                            {isValid ? null : <Text style={{ color: 'red' }}>Please enter valid email</Text>}
                        </View>

                        <FlatList keyboardShouldPersistTaps={'always'}
                            data={items}
                            style={{ marginHorizontal: convertWidth(14), marginBottom: convertWidth(7) }}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                        />

                        <TouchableOpacity style={STYLES.btnContainer} onPress={() => sendEmail()}>
                            <Text style={{ color: COLORS.secondary, fontFamily: 'Lato-Bold', paddingRight: shareLoader ? convertWidth(5) : convertWidth(0) }}>Share</Text>
                            {shareLoader && <ActivityIndicator size={'small'} color={COLORS.secondary} />}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default ShareModal;