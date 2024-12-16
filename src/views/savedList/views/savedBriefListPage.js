import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// custom imports
import { getMySavedBriefList, removeBookmarkMySavedBriefList } from '../api/mySavedListApi';
import { BriefCardView, CustomSnackbar } from '../../../components';
import styles from '../../commonViewStyles';
import { COLORS } from '../../../common/enums/colors';
import STRINGS from '../../../common/strings';
import SavedListStyleSheetFactory from '../SavedListStyleSheetFactory';
import { ROUTE_KEYS, SCREEN_CLASS } from '../../../navigation/constants';
import { AppLinks } from '../../../common/enums/AppLinks';
import { checkNetworkConnectivity } from '../../../common/utils/networkUtil';
import ShareModal from '../../../components/Modals/ShareModal';
import { removeMySavedBriefListFromLocalDB, saveBriefListToMySavedListLocalDB } from '../../../database/services/mysavedService';
import { NOTIFY_DEVICE_TOKEN, SCREEN_CONFIG_CHECK, storeData } from '../../../common/constants/AsyncStorageConst';
import { trackButtonClick, trackScreen } from '../../../common/utils/analyticsUtils';

export default function SavedBriefListPage(props) {
  const { navigation } = props;
  const isFocused = useIsFocused();
  const [mySavedBriefData, setMySavedBriefData] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [appBriefLoader, setAppBriefLoader] = useState(false);
  const [snackbarNoInternetVisible, setSnackbarNoInternetVisible] = useState(false);
  const [shareBriefData, setShareBriefData] = useState(false);
  const [snackbarShareVisible, setSnackbarShareVisible] = useState(false);
  const [snackbarErrorStatus, setSnackbarErrorStatus] = useState(false);

  const STYLES = SavedListStyleSheetFactory.getStyles().mySavedScreenStyles;

  useEffect(() => {
    mySavedBriefListAPI();
    trackScreen(SCREEN_CLASS.MY_SAVED_BRIEF_LIST_PAGE,ROUTE_KEYS.MY_SAVED_BRIEF_LIST_PAGE)
  }, [isFocused]);

  async function mySavedBriefListAPI() {
    await AsyncStorage.setItem(SCREEN_CONFIG_CHECK, JSON.stringify(ROUTE_KEYS.MY_SAVED_LIST_PAGE));
    setAppBriefLoader(true);
    let response = await getMySavedBriefList();
    // const reverseData = response?.slice().reverse();
    setMySavedBriefData(response);
    const isConnected = await checkNetworkConnectivity();
    if (isConnected) {
      setSnackbarNoInternetVisible(false);
      await removeMySavedBriefListFromLocalDB();
      await saveBriefListToMySavedListLocalDB(response);
    } else {
      setSnackbarNoInternetVisible(true);
    }
    setAppBriefLoader(false);
  }

  const renderItem = ({ item, index }) => (
    <BriefCardView index={index} item={item}
      onRemoveAction={(item) => onRemoveAction(item)}
      onShareAction={(item) => onShareAction(item)}
      onViewWeb={(item) => onWebViewHandler(ROUTE_KEYS.MY_SAVED_LINK_PAGE, { digestName: item.name, digestLink: item?.web, screenProp: ROUTE_KEYS.MY_SAVED_BRIEF_LIST_PAGE })}
      onItemClickAction={() => onWebViewHandler(ROUTE_KEYS.ARTICLE_LIST_PAGE, { digestName: item.name, digestSlug: item.slug, screenProp: ROUTE_KEYS.MY_SAVED_BRIEF_LIST_PAGE, briefDataGid: item.gid })} />
  );

  const onRemoveAction = async (item) => {

    trackButtonClick(STRINGS.unsave)
    snackBarStateChangeToFalse();
    setSnackbarNoInternetVisible(false);
    setSnackbarVisible(false);
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
      setSnackbarNoInternetVisible(true);
      return;
    }
    const response = await removeBookmarkMySavedBriefList(item);
    if (response === 200) {
      setSnackbarVisible(true);
    } else {
      setSnackbarErrorStatus(true);
    }
    await mySavedBriefListAPI();
  };

  const onShareAction = async (item) => {
    trackButtonClick(STRINGS.share)
    snackBarStateChangeToFalse();
    setSnackbarNoInternetVisible(false);
    setShareModalVisible(false);
    setSnackbarShareVisible(false);
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
      setSnackbarNoInternetVisible(true);
      return;
    }
    setShareBriefData(item);
    setShareModalVisible(true);
  };

  const onWebViewHandler = async (route_path, route_params) => {
    trackButtonClick(STRINGS.viewonweb)
    snackBarStateChangeToFalse();
    setSnackbarNoInternetVisible(false);
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected && route_path !== ROUTE_KEYS.ARTICLE_LIST_PAGE) {
      setSnackbarNoInternetVisible(true);
    } else {
      navigation.navigate(route_path, route_params);
    }
  };

  const renderNoSearchResults = () => {
    return (
      <View style={STYLES.noSearchResultContainer}>
        <Text style={styles.noSearchResultText}>{STRINGS.no_brief_to_list}</Text>
      </View>
    );
  };

  const hideSnackbar = (showAgain) => {
    setSnackbarVisible(showAgain);
  };

  const snackBarStateChangeToFalse = () => {
    setSnackbarVisible(false);
    setSnackbarNoInternetVisible(false);
    setShareBriefData(false);
    setSnackbarShareVisible(false);
    setSnackbarErrorStatus(false);
  }

  return (
    <>
      <View style={STYLES.container}>
        {appBriefLoader ?
          <View style={styles.mainContainer}>
            <ActivityIndicator size="large" color={COLORS.secondary} />
          </View>
          :
          mySavedBriefData?.length === 0 ?
            <View style={styles.mainContainer}>
              {renderNoSearchResults()}
            </View>
            :
            <FlatList
              showsVerticalScrollIndicator={false}
              data={mySavedBriefData}
              keyExtractor={(item, index) => index.toString()} 
              renderItem={renderItem}
              onScroll={(e) => {
                if (appBriefLoader) {
                  e.preventDefault();
                }
              }}
              refreshControl={
                <RefreshControl
                  refreshing={appBriefLoader}
                  onRefresh={() => mySavedBriefListAPI()}
                />
              }
            />
        }
      </View>
      <CustomSnackbar
        visible={
          snackbarVisible || snackbarNoInternetVisible || snackbarShareVisible ||
          snackbarErrorStatus
        }
        message={
          snackbarNoInternetVisible ? STRINGS.no_internet :
            snackbarShareVisible ? STRINGS.share_via_email : 
              snackbarErrorStatus ? STRINGS.something_went_wrong : STRINGS.brief_removed}
        onHideSnackbar={hideSnackbar} />
      <ShareModal
        visible={shareModalVisible}
        article={shareBriefData}
        errorShowSnackBar={(showSnackBar) => setSnackbarErrorStatus(showSnackBar)}
        showSnackBar={(showSnackBar) => setSnackbarShareVisible(showSnackBar)}
        closeModal={() => setShareModalVisible(false)} />
    </>
  );
}