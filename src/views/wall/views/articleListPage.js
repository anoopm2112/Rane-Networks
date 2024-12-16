import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, Text, BackHandler, FlatList, RefreshControl, TouchableOpacity, ScrollView, ActivityIndicator, Linking, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// custom Imports
import { AppContent, ArticleCardView, BottomSheet, CommonHeader, CustomSnackbar, DatePickerFilter, FeedbackModal, Header, HorizontalDateFilter, InputText } from '../../../components';
import { getArticleList, getArticleListFilter, sendFeedBackApi } from '../api/wallApi';
import styles from '../../commonViewStyles';
import { COLORS } from '../../../common/enums/colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import CustomIcon from '../../../assets/CustomIcon';
import { ROUTE_KEYS, SCREEN_CLASS } from '../../../navigation/constants';
import { bottomSheetList } from '../../../common/constants/AppConstants';
import { checkNetworkConnectivity } from '../../../common/utils/networkUtil';
import { deleteArticleListFromLocalDB, insertArticleListToLocalDB } from '../../../database/services/articleService';
import ShareModal from '../../../components/Modals/ShareModal';
import STRINGS from '../../../common/strings';
import { bookmarkMySavedArticleList, bookmarkMySavedBriefList, removeBookmarkMySavedArticleList, removeBookmarkMySavedBriefList } from '../../savedList/api/mySavedListApi';
import { ArticleActions } from '../../../common/enums/ArticleActions';
import WallStyleSheetFactory from '../wallStyleSheetFactory';
import { deletePublicationDateItemFromDB, getDigestPublicationListFromLocalDB, updateReadStatusById } from '../../../database/services/publicationService';
import { getMonthDateYearFormat } from '../../../common/utils/dateUtils';
import { AppLinks } from '../../../common/enums/AppLinks';
import { NOTIFY_DEVICE_TOKEN, SAVED_DEFAULT_BRIEF, SCREEN_CONFIG_CHECK } from '../../../common/constants/AsyncStorageConst';
import { trackButtonClick, trackScreen, trackSelected } from '../../../common/utils/analyticsUtils';

export default function ArticleListPage(props) {
    const { navigation } = props;
    const { digestName, digestSlug, screenProp, briefDataGid } = props.route.params;
    const refRBSheet = useRef();
    const scrollViewRef = useRef(null);
    const isFocused = useIsFocused();

    const STYLES = WallStyleSheetFactory.getStyles().ArticleScreenStyles;

    // State Handlers
    const [dateData, setDateData] = useState([]);
    const [articleData, setArticleData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(dateData?.length - 1);
    const [modalVisible, setModalVisible] = useState(false);
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [feedbackModalVisible, setFeedBackModalVisible] = useState(false);
    const [feedBackType, setFeedBackType] = useState({});
    const [shareType, setSharedDataType] = useState({});
    const [headerDate, setHeaderDate] = useState(false);
    const [appLoader, setAppLoader] = useState(false);
    const [appArticleLoader, setAppArticleLoader] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [responseData, setResponseData] = useState(false);
    const [datePickerData, setDatePickerData] = useState([]);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarArticleBookMarkRemoveVisible, setSnackbarArticleBookMarkRemoveVisibleVisible] = useState(false);
    const [snackbarBriefVisible, setSnackbarBriefVisible] = useState(false);
    const [snackbarBriefBookMarkRemoveVisible, setSnackbarBriefBookMarkRemoveVisible] = useState(false);
    const [snackbarArticleBookMarkRemoveFailedVisible, setSnackbarArticleBookMarkRemoveFailedVisible] = useState(false);
    const [snackbarNoInternetVisible, setSnackbarNoInternetVisible] = useState(false);
    const [snackbarFeedBackVisible, setSnackbarFeedBackVisible] = useState(false);
    const [feedBackLoader, setFeedBackLoader] = useState(false);
    const [bottomListData, setBottomListData] = useState(bottomSheetList);
    const [filterIdentify, setFilterIdentify] = useState(false);
    const [snackbarShareVisible, setSnackbarShareVisible] = useState(false);
    const [snackBarAlreadyLikedDisliked, setSnackBarAlreadyLikedDisliked] = useState(false);
    const [snackbarErrorStatus, setSnackbarErrorStatus] = useState(false);
    const [selectedBrief, setSelectedBrief] = useState('');
    const [briefArticleResponseData, setBriefArticleResponseData] = useState([]);
    const [loadingBookmark, setLoadingBookmark] = useState(false);

    useEffect(() => {
        articleListAPI();
        setFilterIdentify(false);
        trackScreen(SCREEN_CLASS.ARTICLE_LIST_PAGE, ROUTE_KEYS.ARTICLE_LIST_PAGE);
        trackSelected(digestName);
    }, [digestSlug]);

    useEffect(() => {
        fetchArticlelistData();
    }, [isFocused]);

    const fetchArticlelistData = async () => {
        var screen_config_value = await AsyncStorage.getItem(SCREEN_CONFIG_CHECK);
        const screen_config = JSON.parse(screen_config_value);
        if (screen_config === ROUTE_KEYS.MY_SAVED_LIST_PAGE) {
            articleListAPI();
            setFilterIdentify(false);
            await AsyncStorage.setItem(SCREEN_CONFIG_CHECK, JSON.stringify(ROUTE_KEYS.ARTICLE_LIST_PAGE));
        }
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        if (Platform.OS === 'ios') {
            navigation.addListener('gestureEnd', handleBackButton);
        }
        return () => {
            backHandler.remove();
            if (Platform.OS === 'ios') {
                navigation.removeListener('gestureEnd', handleBackButton);
            }
        };
    }, []);

    const handleBackButton = async () => {
        if (screenProp) {
            navigation.goBack(null)
        } else {
            navigation.navigate(ROUTE_KEYS.DIGEST_LIST_PAGE);
        }
    };

    async function articleListAPI() {
        setAppLoader(true);
        await AsyncStorage.removeItem(SAVED_DEFAULT_BRIEF);
        let response
        if (briefDataGid) {
            response = await getArticleListFilter(digestSlug, briefDataGid);
            setSelectedItem(briefDataGid);
        } else {
            response = await getArticleList(digestSlug);
        }
        setResponseData(response);
        if (response.length !== 0) {
            setSelectedBrief(response?.gid);
            if (response?.bookmarked) {
                const updatedList = bottomListData.map(item => {
                    if (item.id === 1) {
                        return { ...item, bookmark: true };
                    }
                    return item;
                });
                setBottomListData(updatedList);
            } else {
                const updatedList = bottomListData.map(item => {
                    if (item.id === 1) {
                        return { ...item, bookmark: false };
                    }
                    return item;
                });
                setBottomListData(updatedList);
            }     
            let publicationData = await getDigestPublicationListFromLocalDB(digestSlug);
            updateDateSliderData(response, publicationData, false);
            const isConnected = await checkNetworkConnectivity();
            if (isConnected) {
                setSnackbarNoInternetVisible(false);
                // await deleteArticleListFromLocalDB(digestSlug);
                await insertArticleListToLocalDB(response);
            } else {
                setSnackbarNoInternetVisible(true);
            }
        }

        if (response.length !== 0) {
            // const dateSlider = response?.date_option?.slider.reverse();
            const articleDate = response?.article;
            const datePicker = response?.date_option?.picker;

            // let index = -1; // Initialize with -1 to indicate not found

            // for (let i = 0; i < dateSlider?.length; i++) {
            //     if (dateSlider[i].selected === true) {
            //         index = i; // Set the index when the item is found
            //         break; // Exit the loop once the item is found (optional)
            //     }
            // }

            // const selectedDate = dateSlider[index]?.date;
            // const selectedDateGid = dateSlider[index]?.gid;
            // if (index !== -1) {
            //     setSelectedItem(selectedDateGid);
            //     setHeaderDate(selectedDate);
            // }
            // setDateData(dateSlider);
            setArticleData(articleDate);
            setDatePickerData(datePicker);
        } else {
            setDateData(response);
            setArticleData(response);
        }
        setAppLoader(false);
    }

    async function updateDateSliderData(articleJson, publicationJson, isReversed) {
        const publicationMap = new Map();
        publicationJson.forEach(item => {
            if (item.publication) {
                item.publication.forEach(pub => {
                    const gid = pub.gid;
                    publicationMap.set(gid, pub.dateWiseReadStatus);
                });
            }
        });

        articleJson?.date_option?.slider?.forEach(sliderDate => {
            const dateWiseReadStatus = publicationMap.get(sliderDate.gid);
            if (dateWiseReadStatus !== undefined) {
                if (sliderDate.selected !== undefined && sliderDate.selected === true) {
                    sliderDate.dateWiseReadStatus = true;
                    updateReadStatusSelected(digestSlug, sliderDate.gid);
                } else {
                    sliderDate.dateWiseReadStatus = dateWiseReadStatus;
                }
            }
        });


        try {
            //deletebthe date from the publication, which is not present in the date slider
            const extraItemsInPublication = publicationJson[0].publication.filter(
                item1 => !articleJson?.date_option?.slider?.some(item2 => item2?.gid === item1?.gid)

            )
            extraItemsInPublication?.forEach(publicationItem => {

                const givenDate = new Date(publicationItem.date);
                // Get the current date
                const currentDate = new Date();
                // Check if the given date is not the current date
                const isNotCurrentDate =
                    givenDate.getFullYear() !== currentDate.getFullYear() ||
                    givenDate.getMonth() !== currentDate.getMonth() ||
                    givenDate.getDate() !== currentDate.getDate();
                console.log('date', givenDate.getTime())
                console.log('date', currentDate.getTime())

                if (isNotCurrentDate) {
                    deletePublicationDateItemFromDB(digestSlug, publicationItem?.gid)
                } else {
                    console.log('The given date is the current date.');
                }

            })
        } catch (error) {
            console.log('ERROR', error)
        }

        let dateSlider = null;

        if (isReversed) {
            dateSlider = articleJson?.date_option?.slider;
            setDateData(dateSlider);
        } else {
            dateSlider = articleJson?.date_option?.slider?.reverse();
            let index = -1; // Initialize with -1 to indicate not found

            for (let i = 0; i < dateSlider?.length; i++) {
                if (dateSlider[i].selected === true) {
                    index = i; // Set the index when the item is found
                    break; // Exit the loop once the item is found (optional)
                }
            }

            const selectedDate = dateSlider?.[index]?.date;
            const selectedDateGid = dateSlider?.[index]?.gid;
            if (index !== -1) {
                setSelectedItem(selectedDateGid);
                setHeaderDate(selectedDate);
            }
            setDateData(dateSlider);
        }
    }

    const updateReadStatusSelected = async (digestSlug, gid) => {
        await updateReadStatusById(digestSlug, gid);
    };

    const onRefresh = () => {
        setRefreshing(true);
        articleListAPI();
        setRefreshing(false);
    };

    const renderItem = ({ item, index }) => (
        <ArticleCardView
            index={index} item={item}
            onPressAction={(name, articleItemData, item) => onArtcleListActions(name, articleItemData, item)}
            briefData={{ digestBriefName: digestName, digestBriefSlug: digestSlug }}
            bookmarkLoader={loadingBookmark}
            navigation={navigation} />
    );

    const onArtcleListActions = async (name, articleItemData) => {
        snackBarStateChangeToFalse();
        const isConnected = await checkNetworkConnectivity();
        if (!isConnected) {
            setSnackbarNoInternetVisible(true);
            return;
        }

        if (name === ArticleActions.share) {
            Linking.openURL(articleItemData.share);
        } else if (name === ArticleActions.upVote || name === ArticleActions.downVote) {
            setSnackBarAlreadyLikedDisliked(false);
            if (articleItemData?.liked === null) {
                setFeedBackModalVisible(true);
                let feebackType = {
                    name: name,
                    itemData: articleItemData
                };
                setFeedBackType(feebackType);
            } else {
                setSnackBarAlreadyLikedDisliked(true);
            }
        } else if (name === ArticleActions.bookmark) {
            setSnackbarArticleBookMarkRemoveVisibleVisible(false);
            setSnackbarVisible(false);
            setSnackbarErrorStatus(false);
            const formattedDate = await getMonthDateYearFormat();
            let brief = {
                name: responseData?.name,
                slug: responseData?.slug,
                gid: selectedBrief,
                // date: formattedDate,
            };
            if (articleItemData.bookmarked) {
                setLoadingBookmark(true);
                // Remove Bookmarking the article
                articleItemData.brief = brief;
                articleItemData.bookmarked = false;
                const response = await removeBookmarkMySavedArticleList(articleItemData);
                if (response === 200) {
                    setSnackbarArticleBookMarkRemoveVisibleVisible(true);
                } else {
                    articleItemData.bookmarked = true;
                    setSnackbarErrorStatus(true);
                }
                setLoadingBookmark(false);
            } else {
                setLoadingBookmark(true);
                // Bookmarking the article
                articleItemData.id = responseData?.gid;
                articleItemData.brief = brief;
                articleItemData.bookmarked = true;
                const response = await bookmarkMySavedArticleList(articleItemData);
                if (response === 200) {
                    setSnackbarVisible(true);
                } else {
                    articleItemData.bookmarked = false;
                    setSnackbarErrorStatus(true);
                }
                setLoadingBookmark(false);
            }

        }
    };

    const onPressItem = async (name, actionName, item) => {
        snackBarStateChangeToFalse();
        trackButtonClick(actionName)
        const isConnected = await checkNetworkConnectivity();
        if (!isConnected) {
            refRBSheet.current.close();
            setSnackbarNoInternetVisible(true);
            return;
        }

        if (actionName === ArticleActions.share) {
            let shareType = {
                slug: responseData.slug,
                gid: selectedBrief
            };
            setSharedDataType(shareType);
            setSnackbarShareVisible(false);
            refRBSheet.current.close();
            setTimeout(() => (
                setShareModalVisible(true)
            ), 500);
        } else if (actionName === ArticleActions.save) {
            setSnackbarBriefBookMarkRemoveVisible(false);
            setSnackbarBriefVisible(false);
            if (item?.bookmark) {
                const updatedList = bottomListData.map(item => {
                    if (item.id === 1) {
                        return { ...item, bookmark: false };
                    }
                    return item;
                });
                setBottomListData(updatedList);
                let payload = {
                    name: digestName,
                    slug: digestSlug,
                    gid: selectedBrief
                };
                const response = await removeBookmarkMySavedBriefList(payload);
                refRBSheet.current.close();
                if (response === 200) {
                    setSnackbarBriefBookMarkRemoveVisible(true);
                } else {
                    const updatedList = bottomListData.map(item => {
                        if (item.id === 1) {
                            return { ...item, bookmark: true };
                        }
                        return item;
                    });
                    setBottomListData(updatedList);
                    setSnackbarErrorStatus(true);
                }

            } else {
                const formattedDate = await getMonthDateYearFormat();
                let payload = {
                    id: responseData?.gid,
                    name: digestName,
                    slug: digestSlug,
                    date: formattedDate,
                    brief_gid: selectedBrief,
                    bookmarked: true,
                    tailor: responseData?.tailor,
                    web: responseData?.web
                };
                const updatedList = bottomListData.map(item => {
                    if (item.id === 1) {
                        return { ...item, bookmark: true };
                    }
                    return item;
                });
                setBottomListData(updatedList);
                const response = await bookmarkMySavedBriefList(payload);
                // await insertArticleListToLocalDB(briefArticleResponseData);
                refRBSheet.current.close();
                if (response?.status === 200) {
                    setSnackbarBriefVisible(true);
                } else {
                    const updatedList = bottomListData.map(item => {
                        if (item.id === 1) {
                            return { ...item, bookmark: false };
                        }
                        return item;
                    });
                    setBottomListData(updatedList);
                    setSnackbarErrorStatus(true);
                }
            }
        } else if (actionName === ArticleActions.upgrade) {
            navigation.navigate(ROUTE_KEYS.SOURCES_PAGE, {
                digestName: responseData?.name, digestLink: responseData?.upgrade,
                digestBriefName: digestName, digestBriefSlug: digestSlug
            });
            refRBSheet.current.close();
        } else if (actionName === ArticleActions.viewOnWeb) {
            navigation.navigate(ROUTE_KEYS.SOURCES_PAGE, {
                digestName: responseData?.name, digestLink: responseData?.web,
                digestBriefName: digestName, digestBriefSlug: digestSlug
            });
            refRBSheet.current.close();
        }
    };

    const handleItemSelect = async (gid, selectedDate, index) => {
        const isConnected = await checkNetworkConnectivity();
        if (!isConnected) {
            setSnackbarNoInternetVisible(true);
            return;
        }

        updateReadStatus(digestSlug, gid);
        setArticleData([]);
        setAppArticleLoader(true);
        setSelectedItem(gid);
        setHeaderDate(selectedDate);
        let response = await getArticleListFilter(digestSlug, gid);
        setBriefArticleResponseData(response);
        setArticleData(response?.article);
        setSelectedBrief(response?.gid)
        setAppArticleLoader(false);

        if (response?.bookmarked) {
            const updatedList = bottomListData.map(item => {
                if (item.id === 1) {
                    return { ...item, bookmark: true };
                }
                return item;
            });
            setBottomListData(updatedList);
        } else {
            const updatedList = bottomListData.map(item => {
                if (item.id === 1) {
                    return { ...item, bookmark: false };
                }
                return item;
            });
            setBottomListData(updatedList);
        }

        datePickerData.forEach(item => {
            if (item.gid === gid) {
                item.selected = true;
            } else {
                delete item.selected;
            }
        });

        setDatePickerData(datePickerData);
    };

    async function updateReadStatus(digestSlug, gid) {
        await updateReadStatusById(digestSlug, gid);
        let publicationData = await getDigestPublicationListFromLocalDB(digestSlug);
        updateDateSliderData(responseData, publicationData, true, gid);
    }

    const hideSnackbar = (showAgain) => {
        setSnackbarVisible(showAgain);
        setSnackbarBriefVisible(showAgain);
        setSnackbarNoInternetVisible(showAgain);
        setSnackbarBriefBookMarkRemoveVisible(showAgain);
        setSnackbarArticleBookMarkRemoveFailedVisible(showAgain);
        setSnackbarArticleBookMarkRemoveVisibleVisible(showAgain);
        setSnackbarFeedBackVisible(showAgain);
        setSnackbarShareVisible(showAgain);
        setSnackBarAlreadyLikedDisliked(showAgain);
        setSnackbarErrorStatus(showAgain);
    };

    const onSearch = async () => {
        const isConnected = await checkNetworkConnectivity();
        if (isConnected) {
            navigation.navigate(ROUTE_KEYS.SEARCH_LIST_PAGE, { digestSlug: digestSlug, digestName: digestName });
            setSnackbarNoInternetVisible(false);
        } else {
            setSnackbarNoInternetVisible(true);
        }
    };

    const onDatePickerClick = async () => {
        const isConnected = await checkNetworkConnectivity();
        if (isConnected) {
            setModalVisible(true);
            setSnackbarNoInternetVisible(false);
        } else {
            setSnackbarNoInternetVisible(true);
        }
    };

    const sendFeedBack = async (inputText, articleItemData) => {
        setSnackbarFeedBackVisible(false);
        setSnackbarErrorStatus(false);
        setFeedBackLoader(true);
        let payload = {};
        if (feedBackType?.name === ArticleActions.upVote) {
            payload = { like: true, comment: inputText };
            articleItemData.liked = true;
        } else {
            payload = { like: false, comment: inputText };
            articleItemData.liked = false;
        }
        const response = await sendFeedBackApi(digestSlug, selectedBrief, feedBackType.itemData.gid, payload);
        setFeedBackLoader(false);
        setFeedBackModalVisible(false);
        if (response === 200) {
            setSnackbarFeedBackVisible(true);
        } else {
            articleItemData.liked = null;
            setSnackbarErrorStatus(true);
        }
    };

    const snackBarStateChangeToFalse = () => {
        setSnackbarVisible(false);
        setSnackbarArticleBookMarkRemoveVisibleVisible(false);
        setSnackbarBriefVisible(false);
        setSnackbarBriefBookMarkRemoveVisible(false);
        setSnackbarArticleBookMarkRemoveFailedVisible(false);
        setSnackbarNoInternetVisible(false);
        setSnackbarFeedBackVisible(false);
        setSnackbarShareVisible(false);
        setSnackBarAlreadyLikedDisliked(false);
        setSnackbarErrorStatus(false);
    }

    return (
        <AppContent>
            <CommonHeader />
            <Header title={digestName} onPressBack={() => handleBackButton()}
                dateShow={headerDate} menuBar={true} onPressMore={() => !appLoader && refRBSheet.current.open()} />
            <View style={{ flexDirection: 'row', marginHorizontal: convertHeight(13), marginTop: convertHeight(5) }}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => onSearch()} style={{ flex: 1 }}>
                    <InputText isEditable={false} onSearchIconPress={() => onSearch()} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { onDatePickerClick(); }}
                    style={[styles.searchiconWrapper, { backgroundColor: filterIdentify ? COLORS.notify : COLORS.grey, marginLeft: convertWidth(5), borderRadius: convertHeight(3) }]}>
                    <CustomIcon iconPackage={'MaterialCommunityIcons'} name="calendar-range" size={16} color={COLORS.secondary} />
                </TouchableOpacity>
            </View>
            {appLoader ?
                <View style={styles.mainContainer}>
                    <ActivityIndicator size="large" color={COLORS.secondary} />
                </View>
                :
                responseData?.length === 0 ?
                    <View style={styles.mainContainer}>
                        <Text style={styles.noSearchResultText}>{STRINGS.no_search_results}</Text>
                    </View>
                    :
                    <>
                        <View style={{ height: convertHeight(75) }}>
                            <ScrollView
                                ref={scrollViewRef}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ padding: convertWidth(12) }}
                                onContentSizeChange={() => scrollViewRef?.current.scrollToEnd({ animated: true })}
                                style={{ flex: 1 }}>
                                {dateData.map((item, index) => (
                                    <HorizontalDateFilter
                                        key={index} item={item}
                                        isSelected={item.gid === selectedItem}
                                        onSelect={() => {
                                            setFilterIdentify(false);
                                            handleItemSelect(item.gid, item.date, index)
                                        }} />
                                ))}
                            </ScrollView>
                        </View>
                        {appArticleLoader ?
                            <View style={styles.mainContainer}>
                                <ActivityIndicator size="large" color={COLORS.secondary} />
                            </View>
                            :
                            articleData?.length === 0 || briefArticleResponseData === undefined ?
                                <View style={styles.mainContainer}>
                                    <Text style={styles.noSearchResultText}>{STRINGS.no_search_results}</Text>
                                </View>
                                :
                                <View style={STYLES.container}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={articleData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={renderItem}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={refreshing}
                                                onRefresh={onRefresh}
                                            />
                                        }
                                    />
                                    <BottomSheet refRBSheet={refRBSheet} bottomList={bottomListData} onPressAction={(name, actionName, item) => onPressItem(name, actionName, item)} />
                                </View>
                        }
                    </>
            }
            <DatePickerFilter
                visible={modalVisible}
                pickerData={datePickerData}
                closeModal={() => setModalVisible(false)}
                onDateSelected={({ gid, year }) => {
                    setFilterIdentify(true);
                    handleItemSelect(gid, year)
                }
                } />
            <ShareModal
                visible={shareModalVisible}
                article={shareType}
                errorShowSnackBar={(showSnackBar) => setSnackbarErrorStatus(showSnackBar)}
                showSnackBar={(showSnackBar) => setSnackbarShareVisible(showSnackBar)}
                closeModal={() => setShareModalVisible(false)}
            />
            <FeedbackModal
                visible={feedbackModalVisible}
                feedbackType={feedBackType}
                feedBackLoader={feedBackLoader}
                closeModal={() => setFeedBackModalVisible(false)}
                onDataReceived={sendFeedBack}
            />
            <CustomSnackbar
                visible={
                    snackbarVisible || snackbarArticleBookMarkRemoveVisible ||
                    snackbarBriefVisible || snackbarBriefBookMarkRemoveVisible ||
                    snackbarFeedBackVisible || snackbarNoInternetVisible ||
                    snackBarAlreadyLikedDisliked || snackbarErrorStatus || snackbarShareVisible}
                message={
                    snackbarVisible ? STRINGS.article_saved :
                        snackbarArticleBookMarkRemoveVisible ? STRINGS.article_removed :
                            snackbarShareVisible ? STRINGS.share_via_email :
                                snackbarBriefVisible ? STRINGS.brief_saved :
                                    snackbarBriefBookMarkRemoveVisible ? STRINGS.brief_removed :
                                        snackbarFeedBackVisible ? STRINGS.feedback_updated :
                                            snackbarArticleBookMarkRemoveFailedVisible ? STRINGS.brief_removed_fail.replace('{{value}}', 'article') :
                                                snackBarAlreadyLikedDisliked ? STRINGS.already_like_disliked :
                                                    snackbarErrorStatus ? STRINGS.something_went_wrong : STRINGS.no_internet_article}
                onHideSnackbar={hideSnackbar} />
        </AppContent>
    );
}