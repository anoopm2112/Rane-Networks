import 'react-native-get-random-values';
import querystring from 'query-string';
import { CODE, GET_LOGIN_URL, OPENID, REALMS } from '../config';

const { v4: uuidv4 } = require('uuid');

export const getLoginURL = (config) => {
    const { redirectUri, clientId, kcIdpHint, keycloak_url, realm } = config;
    const responseType = CODE;
    const state = uuidv4();
    const scope = OPENID;
    let queryUrlStringify = querystring.stringify({scope, kc_idp_hint: kcIdpHint, redirect_uri: redirectUri, client_id: clientId, response_type: responseType, state })
    
    const slash = keycloak_url.endsWith('/') ? '' : '/';
    const realm_url = `${keycloak_url + slash}${REALMS}${encodeURIComponent(realm)}`;
    
    const url = `${realm_url}${GET_LOGIN_URL}${queryUrlStringify}`;
    return { url, state };
};