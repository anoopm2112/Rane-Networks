import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Linking, RefreshControl } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// custom imports
import { getMySavedArticleList, removeBookmarkMySavedArticleList } from '../api/mySavedListApi';
import { ArticleCardView, CustomSnackbar, FeedbackModal } from '../../../components';
import { convertHeight, convertWidth } from '../../../common/utils/dimentionUtils';
import { ROUTE_KEYS, SCREEN_CLASS } from '../../../navigation/constants';
import STRINGS from '../../../common/strings';
import styles from '../../commonViewStyles';
import { COLORS } from '../../../common/enums/colors';
import { ArticleActions } from '../../../common/enums/ArticleActions';
import SavedListStyleSheetFactory from '../SavedListStyleSheetFactory';
import ShareModal from '../../../components/Modals/ShareModal';
import { sendFeedBackApi } from '../../wall/api/wallApi';
import { checkNetworkConnectivity } from '../../../common/utils/networkUtil';
import { removeMySavedArticleListFromLocalDB, saveArticleListToMySavedListLocalDB } from '../../../database/services/mysavedService';
import { SCREEN_CONFIG_CHECK, storeData } from '../../../common/constants/AsyncStorageConst';
import { trackButtonClick, trackScreen } from '../../../common/utils/analyticsUtils';

export default function SavedArticlesListPage(props) {
  const { navigation } = props;
  const isFocused = useIsFocused();
  const [mySavedArticleData, setMySavedArticleData] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarFeedBackVisible, setSnackbarFeedBackVisible] = useState(false);
  const [appArticleLoader, setAppArticleLoader] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [feedBackType, setFeedBackType] = useState({});
  const [feedbackModalVisible, setFeedBackModalVisible] = useState(false);
  const [feedBackLoader, setFeedBackLoader] = useState(false);
  const [snackbarNoInternetVisible, setSnackbarNoInternetVisible] = useState(false);
  const [snackbarFailVisible, setSnackbarFailVisible] = useState(false);
  const [snackBarAlreadyLikedDisliked, setSnackBarAlreadyLikedDisliked] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const STYLES = SavedListStyleSheetFactory.getStyles().mySavedScreenStyles;

  useEffect(() => {
    mySavedArticleListAPI();
    trackScreen(SCREEN_CLASS.MY_SAVED_ARTICLE_LIST_PAGE,ROUTE_KEYS.MY_SAVED_ARTICLE_LIST_PAGE)
  }, [isFocused]);

  async function mySavedArticleListAPI() {
    await AsyncStorage.setItem(SCREEN_CONFIG_CHECK, JSON.stringify(ROUTE_KEYS.MY_SAVED_LIST_PAGE));
    setAppArticleLoader(true);
    let response = await getMySavedArticleList();
    // const reverseData = response?.slice().reverse();
    const isConnected = await checkNetworkConnectivity();
    if (isConnected) {
      setSnackbarNoInternetVisible(false);
      await removeMySavedArticleListFromLocalDB();
      await saveArticleListToMySavedListLocalDB(response);
    } else {
      setSnackbarNoInternetVisible(true);
    }
    setMySavedArticleData(response);
    setAppArticleLoader(false);
  }

  const renderItem = ({ item, index }) => (
    <ArticleCardView
      tabname={ROUTE_KEYS.MY_SAVED_ARTICLE_LIST_PAGE} index={index} item={item} navigation={navigation}
      bookmarkLoader={loadingBookmark}
      onPressAction={(name, articleItemData) => onArticleListActions(name, articleItemData)} />
  );

  const onArticleListActions = async (name, articleItemData) => {


    trackButtonClick(name)
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
      setSnackbarNoInternetVisible(false);
      setSnackbarVisible(false);
      setSnackbarFailVisible(false);
      setLoadingBookmark(true);
      const response = await removeBookmarkMySavedArticleList(articleItemData);
      if (response === 200) {
        setSnackbarVisible(true);
      } else {
        setSnackbarFailVisible(true);
      }
      setLoadingBookmark(false);
      await mySavedArticleListAPI();
    }
  };

  const hideSnackbar = (showAgain) => {
    setSnackbarVisible(showAgain);
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

  const renderNoSearchResults = () => {
    return (
      <View style={STYLES.noSearchResultContainer}>
        <Text style={styles.noSearchResultText}>{STRINGS.no_article_to_list}</Text>
      </View>
    );
  };

  const snackBarStateChangeToFalse = () => {
    setSnackbarVisible(false);
    setSnackbarFeedBackVisible(false);
    setSnackbarNoInternetVisible(false);
    setSnackbarFailVisible(false);
    setSnackBarAlreadyLikedDisliked(false);
  }

  return (
    <>
      <View style={STYLES.container}>
        {/* {appArticleLoader ?
          <View style={styles.mainContainer}>
            <ActivityIndicator size="large" color={COLORS.secondary} />
          </View>
          : */}
          {mySavedArticleData?.length === 0 ?
            <View style={styles.mainContainer}>
              {renderNoSearchResults()}
            </View>
            :
            <FlatList
              showsVerticalScrollIndicator={false}
              data={mySavedArticleData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              onScroll={(e) => {
                if (appArticleLoader) {
                  e.preventDefault();
                }
              }}
              refreshControl={
                <RefreshControl
                  refreshing={appArticleLoader}
                  onRefresh={() => mySavedArticleListAPI()}
                />
              }
            />
        }
      </View>
      <CustomSnackbar
        visible={
          snackbarFeedBackVisible || snackbarVisible ||
          snackbarNoInternetVisible || snackbarFailVisible || snackBarAlreadyLikedDisliked
        }
        message={
          snackbarFeedBackVisible ? STRINGS.feedback_updated :
            snackbarNoInternetVisible ? STRINGS.no_internet :
              snackbarFailVisible ? STRINGS.article_removed_fail :
                snackBarAlreadyLikedDisliked ? STRINGS.already_like_disliked : STRINGS.article_removed
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
    </>
  );
}