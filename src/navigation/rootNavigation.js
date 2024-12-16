import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import jwtDecode from 'jwt-decode';
// Custom Imports
import MainNavigator from './mainAppNavigator';
import AuthNavigator from './authNavigator';
import { Context as AuthContext } from '../context/AuthContext';
import { COLORS } from '../common/enums/colors';
import navigationService from './navigationService';
import { ROUTE_KEYS } from './constants';
import { ACCESS_TOKEN, REFRESH_TOKEN, retrieveData, storeData } from '../common/constants/AsyncStorageConst';
import { refreshToken } from '../views/auth/api/authApi';
import { keycloak_CLIENT_ID } from '../common/config';

export default function rootNavigation() {
  const { state } = useContext(AuthContext);

  const linking = {
    prefixes: ['ranenetwork://'],
    config: {
      initialRouteName: ROUTE_KEYS.MY_WALL_TAB,
      screens: {
        myWallTab: {
          path: ROUTE_KEYS.MY_WALL_TAB,
          screens: {
            articleListPage: {
              path: `${ROUTE_KEYS.ARTICLE_LIST_PAGE}/:digestName/:digestSlug/:briefDataGid`,
              parse: {
                digestName: (digestName) => decodeURIComponent(digestName), // Decode if needed
                digestSlug: (digestSlug) => decodeURIComponent(digestSlug), // Decode if needed
                briefDataGid: (briefDataGid) => decodeURIComponent(briefDataGid), // Decode if needed
              },
            }
          },
        }
      }
    }
  };

  let REFRESH_THRESHOLD = 60;
  let diff;
  let setTimerId = null;
  let userToken = state?.userToken ? state?.userToken : null;

  useEffect(() => {
    const fetchRefreshFun = async () => {

      const refreshTokenData = await retrieveData(REFRESH_TOKEN);
      const accessTokenData = await retrieveData(ACCESS_TOKEN);

      if (accessTokenData) {
        const decodedToken = jwtDecode(accessTokenData);
        const expirationTime = decodedToken?.exp;

        setTimerId = setInterval(async () => {
          const now = Math.floor(Date.now() / 1000);
          diff = expirationTime - now;
          if (diff <= REFRESH_THRESHOLD) {
            clearInterval(setTimerId);
            const data = {
              refresh_token: refreshTokenData,
              grant_type: 'refresh_token',
              client_id: keycloak_CLIENT_ID,
            };
            const responsRefreshData = await refreshToken(data);
            if (responsRefreshData?.data?.access_token) {
              storeData(ACCESS_TOKEN, responsRefreshData?.data?.access_token);
              storeData(REFRESH_TOKEN, responsRefreshData?.data?.refresh_token);
              await fetchRefreshFun();
            }
          }
        }, 1000);
      }
    }

    fetchRefreshFun()
    return () => {
      clearInterval(setTimerId);
      diff
    }
  }, [userToken]);

  return (
    <NavigationContainer theme={{ colors: { background: COLORS.primary } }} linking={linking}
      ref={(ref) => navigationService.setTopLevelNavigator(ref)}>
      {state?.userToken == "" ? <AuthNavigator /> : <MainNavigator />}
    </NavigationContainer>
  );
}