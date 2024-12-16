import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Linking, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Keyboard, RefreshControl } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
// custom imports
import { AppContent, ArticleCardView, CommonHeader, CustomSnackbar, FeedbackModal, Header, InputText } from '../../../components';
import STRINGS from '../../../common/strings';
import { COLORS } from '../../../common/enums/colors';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { SEARCH_TERMS, retrieveData, storeData } from '../../../common/constants/AsyncStorageConst';
import CustomIcon from '../../../assets/CustomIcon';
import styles from '../../commonViewStyles';
import { searchFilter, sendFeedBackApi } from '../api/wallApi';
import WallStyleSheetFactory from '../wallStyleSheetFactory';
import ShareModal from '../../../components/Modals/ShareModal';
import { ArticleActions } from '../../../common/enums/ArticleActions';
import { ROUTE_KEYS, SCREEN_CLASS } from '../../../navigation/constants';
import { checkNetworkConnectivity } from '../../../common/utils/networkUtil';
import { bookmarkMySavedArticleList, removeBookmarkMySavedArticleList } from '../../savedList/api/mySavedListApi';
import { trackScreen } from '../../../common/utils/analyticsUtils';

export default function SearchPage(props) {
    const { navigation } = props;
    const { digestSlug, digestName } = props.route.params;
    const textInputRef = useRef(null);

    const STYLES = WallStyleSheetFactory.getStyles().SearchScreenStyles;

    const [typedData, setTypedData] = useState('');
    const [savedData, setSavedData] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [feedBackType, setFeedBackType] = useState({});
    const [feedbackModalVisible, setFeedBackModalVisible] = useState(false);
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [feedBackLoader, setFeedBackLoader] = useState(false);
    const [snackbarNoInternetVisible, setSnackbarNoInternetVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarFailVisible, setSnackbarFailVisible] = useState(false);
    const [snackbarFeedBackVisible, setSnackbarFeedBackVisible] = useState(false);
    const [snackBarAlreadyLikedDisliked, setSnackBarAlreadyLikedDisliked] = useState(false);
    const [snackbarRemoveBookmarkVisible, setSnackbarRemoveBookmarkVisible] = useState(false);
    // loader
    const [isRefreshing, setRefreshing] = useState(false);
    const [appArticleLoader, setAppArticleLoader] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    // pagination
    const [page, setPage] = useState(1);

    useEffect(() => {
        // Load data from AsyncStorage when component mounts
        loadDataFromAsyncStorage();
        
    }, []);

    useEffect(() => {
        textInputRef.current.focus();
    }, []);

    useEffect(() => {
        trackScreen(SCREEN_CLASS.SEARCH_LIST_PAGE,ROUTE_KEYS.SEARCH_LIST_PAGE)
        fetchSearchItems()
    }, [page])



    const saveDataToAsyncStorage = async () => {
        try {
            if (typedData.trim() !== '') {
                let updatedData = [...savedData];
                // Check if the search keyword is not already in the array
                if (!updatedData.includes(typedData) && typedData !== "") {
                    updatedData = [...savedData, typedData];
                    await AsyncStorage.setItem(SEARCH_TERMS, JSON.stringify(updatedData));
                    setSavedData(updatedData);
                }

                // Check if we have more than 10 items, if so, remove the first item
                if (updatedData.length > 10) {
                    updatedData.shift();
                    await AsyncStorage.setItem(SEARCH_TERMS, JSON.stringify(updatedData));
                    setSavedData(updatedData);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const loadDataFromAsyncStorage = async () => {
        try {
            const data = await AsyncStorage.getItem(SEARCH_TERMS);
            if (data !== null) {
                setSavedData(JSON.parse(data));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderRecentSearch = (item, index) => {
        return (
            <View key={index?.toString()} style={STYLES.listMainContainer}>
                <TouchableOpacity onPress={() => {
                    setTypedData(item);
                    onSearch();
                    onSearchIconPress(item);
                }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CustomIcon iconPackage={'AntDesign'} name="search1" size={convertHeight(12)} color={COLORS.secondary} />
                    <Text style={STYLES.searchText}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                    <AntDesign name="close" size={convertHeight(12)} color={COLORS.secondary} />
                </TouchableOpacity>
            </View>
        );
    };

    const handleRemoveItem = async (index) => {
        try {
            const updatedData = [...savedData];
            updatedData.splice(index, 1);
            await AsyncStorage.setItem(SEARCH_TERMS, JSON.stringify(updatedData));
            setSavedData(updatedData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchInputChange = (text) => {
        setTypedData(text);
        setHasSearched(false);
    };

    const handleSearchCloseInputChange = () => {
        setTypedData('');
        setHasSearched(false);
        setSearchData([]);
    };

    const onSearchIconPress = async (item) => {
        Keyboard.dismiss();
        onSearch();
        setAppArticleLoader(true);
        setRefreshing(true);
        let payload = {
            page: page,
            keyword_search: item ? item : typedData
        };

        if (digestSlug !== '') {
            payload.brief_slug = [digestSlug];
        }
        const response = await searchFilter(payload);
        setRefreshing(false);
        setSearchData(prevData => [...prevData, ...response]);
        if (response.length !== 0) {
            saveDataToAsyncStorage();
        }
        setAppArticleLoader(false);
        setHasSearched(true);

    };

    const fetchSearchItems = async (item) => {
        Keyboard.dismiss();
        setAppArticleLoader(true);
        setRefreshing(true);
        let payload = {
            page: page,
            keyword_search: item ? item : typedData
        };
        if (digestSlug !== '') {
            payload.brief_slug = [digestSlug];
        }
        const response = await searchFilter(payload);
        setRefreshing(false);
        setSearchData(prevData => [...prevData, ...response]);
        if (response.length !== 0) {
            saveDataToAsyncStorage();
        }
        setAppArticleLoader(false);

    };

    const onSearch = () => {
        setSearchData([]);
        setPage(1);
    }
    const onRefresh = () => {
        setRefreshing(true);
        setAppArticleLoader(true)
    };

    const handleLoadMore = async () => {
        setPage(prevPage => prevPage + 1); // Increment the page state
    };

    const renderNoSearchResults = () => {
        return (
            <View style={STYLES.noSearchResultContainer}>
                <Text style={styles.noSearchResultText}>{STRINGS.no_search_results}</Text>
                <Text style={styles.noSearchResultText}>{STRINGS.no_search_results_desc_1}</Text>
                <Text style={STYLES.noSearchResultDescText}>{STRINGS.no_search_results_desc_2}</Text>
            </View>
        );
    };

    const renderItem = ({ item, index }) => (
        <ArticleCardView
            tabname={ROUTE_KEYS.SEARCH_LIST_PAGE} index={index} item={item} navigation={navigation}
            onPressAction={(name, articleItemData) => onArticleListActions(name, articleItemData)} />
    );

    const onArticleListActions = async (name, articleItemData) => {
        snackBarStateChangeToFalse();
        const isConnected = await checkNetworkConnectivity();
        if (!isConnected) {
            setSnackbarNoInternetVisible(true);
            return;
        }
        if (name === ArticleActions.share) {
            setSnackbarNoInternetVisible(false);
            Linking.openURL(articleItemData.share);
        } else if (name === ArticleActions.upVote || name === ArticleActions.downVote) {
            setSnackBarAlreadyLikedDisliked(false);
            setSnackbarNoInternetVisible(false);
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
            if (articleItemData.bookmarked) {
                // Remove Bookmarking the article
                articleItemData.bookmarked = false;
                const response = await removeBookmarkMySavedArticleList(articleItemData);
                if (response === 200) {
                    setSnackbarRemoveBookmarkVisible(true);
                } else {
                    articleItemData.bookmarked = true;
                    setSnackbarFailVisible(true);
                }
            } else {
                // Bookmarking the article      
                articleItemData.bookmarked = true;
                const response = await bookmarkMySavedArticleList(articleItemData);
                if (response === 200) {
                    setSnackbarVisible(true);
                } else {
                    articleItemData.bookmarked = false;
                    setSnackbarFailVisible(true);
                }
            }
        }
    };

    const sendFeedBack = async (inputText, articleItemData) => {
        snackBarStateChangeToFalse();
        setSnackbarFeedBackVisible(false);
        setFeedBackLoader(true);
        let payload = {};
        if (feedBackType?.name === ArticleActions.upVote) {
            payload = { like: true, comment: inputText };
            articleItemData.liked = true;
        } else {
            payload = { like: false, comment: inputText };
            articleItemData.liked = false;
        }
        // Other payloads
        const digestSlug = feedBackType.itemData?.brief?.slug;
        const briefGid = feedBackType.itemData?.brief?.gid;
        const articleGid = feedBackType.itemData.gid;
        const response = await sendFeedBackApi(digestSlug, briefGid, articleGid, payload);
        if (response === 200) {
            setSnackbarFeedBackVisible(true);
        }
        setFeedBackLoader(false);
        setFeedBackModalVisible(false);
    };

    const hideSnackbar = (showAgain) => {
        setSnackbarVisible(showAgain);
    };

    const snackBarStateChangeToFalse = () => {
        setSnackbarVisible(false);
        setSnackbarRemoveBookmarkVisible(false);
        setSnackbarFeedBackVisible(false);
        setSnackbarNoInternetVisible(false);
        setSnackbarFailVisible(false);
        setSnackBarAlreadyLikedDisliked(false);
    }

    return (
        <AppContent>
            <CommonHeader />
            <Header title={digestName !== null && digestName !== undefined ? digestName : STRINGS.search_all_brief} onPressBack={() => navigation.goBack(null)} />
            <View style={{ margin: convertHeight(13) }}>
                <InputText
                    ref={textInputRef}
                    isEditable={true}
                    value={typedData}
                    onChangeInputText={(text) => handleSearchInputChange(text)}
                    onSearchCloseIconPress={() => handleSearchCloseInputChange()}
                    onSearchIconPress={() => onSearchIconPress()} />
            </View>

            {/* Recently Searched List UI */}
            {(typedData === '' && !hasSearched && searchData.length === 0) && (
                <ScrollView keyboardShouldPersistTaps={'always'}>
                    {savedData.map((item, index) => renderRecentSearch(item, index))}
                </ScrollView>
            )}

            {/* Article Loader */}
            {(typedData !== '' && searchData.length === 0 && appArticleLoader) && <View style={styles.mainContainer}>
                <ActivityIndicator size="large" color={COLORS.secondary} />
            </View>}

            {/* Result List UI */}
            {searchData.length > 0 && (
                <View style={{ flex: 1, paddingHorizontal: convertWidth(14) }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={searchData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={handleLoadMore}
                            />
                        }
                    />
                </View>
            )}

            {/* No Content UI */}
            {typedData !== '' && hasSearched && searchData.length === 0 && !isRefreshing && <View style={styles.mainContainer}>
                {renderNoSearchResults()}
            </View>}

            <CustomSnackbar
                visible={
                    snackbarFeedBackVisible || snackbarVisible || snackbarRemoveBookmarkVisible ||
                    snackbarNoInternetVisible || snackbarFailVisible || snackBarAlreadyLikedDisliked
                }
                message={
                    snackbarFeedBackVisible ? STRINGS.feedback_updated :
                        snackbarNoInternetVisible ? STRINGS.no_internet :
                            snackbarFailVisible ? STRINGS.something_went_wrong :
                                snackBarAlreadyLikedDisliked ? STRINGS.already_like_disliked : 
                                    snackbarVisible ? STRINGS.article_saved : 
                                        snackbarRemoveBookmarkVisible ? STRINGS.article_removed : STRINGS.no_internet
                } onHideSnackbar={hideSnackbar} />
            <ShareModal
                visible={shareModalVisible}
                article={feedBackType}
                closeModal={() => setShareModalVisible(false)} />
            <FeedbackModal
                visible={feedbackModalVisible}
                feedbackType={feedBackType}
                feedBackLoader={feedBackLoader}
                closeModal={() => setFeedBackModalVisible(false)}
                onDataReceived={sendFeedBack}
            />

        </AppContent>
    );
}