// ----------------- Dev keycloak credentials ------------------ //
const keycloak_DEV_URL = 'https://key-test.ranenetwork.com/';
const keycloak_DEV_REALM = 'DEV-RANE';
const keycloak_DEV_CLIENT_ID = 'mobile-enterprise';
const keycloak_DEV_REDIRECT_URI = 'ranenetwork://Homepage';
// ## Api Urls
const API_BASE_DEV_URL = 'https://mobile-test.ranenetwork.com';
const SUB_DEV_URL = '/public-api/v1/';
const GET_LOGIN_DEV_URL = '/protocol/openid-connect/auth?';
const DEV_REALMS = 'realms/';
const DEV_CODE = 'code';
const DEV_OPENID = 'openid';

// ----------------- Stage keycloak credentials -----------------//
const keycloak_STAGE_URL = 'https://login-test.ranenetwork.com';
const keycloak_STAGE_REALM = 'STAG-RANE';
const keycloak_STAGE_CLIENT_ID = 'test-mobile-enterprise';
const keycloak_STAGE_REDIRECT_URI = 'ranenetwork://Homepage';
// ## Api Urls
const API_BASE_STAGE_URL = 'https://mobile-test.ranenetwork.com';
const SUB_STAGE_URL = '/public-api/v1/';
const GET_LOGIN_STAGE_URL = '/protocol/openid-connect/auth?';
const STAGE_REALMS = 'realms/';
const STAGE_CODE = 'code';
const STAGE_OPENID = 'openid';

// ----------------- Prod keycloak credentials -----------------//
const keycloak_PROD_URL = 'https://login.ranenetwork.com';
const keycloak_PROD_REALM = 'PROD-RANE';
const keycloak_PROD_CLIENT_ID = 'mobile-enterprise';
const keycloak_PROD_REDIRECT_URI = 'ranenetwork://Homepage';
// ## Api Urls
const API_BASE_PROD_URL = 'https://mobile.ranenetwork.com';
const SUB_PROD_URL = '/public-api/v1/';
const GET_LOGIN_PROD_URL = '/protocol/openid-connect/auth?';
const PROD_REALMS = 'realms/';
const PROD_CODE = 'code';
const PROD_OPENID = 'openid';

// Keycloak Configurations
let keycloak_URL;
let keycloak_REALM;
let keycloak_CLIENT_ID;
let keycloak_REDIRECT_URI;

// API URL's
let API_BASE_URL;
let SUB_URL;
let GET_LOGIN_URL;
let REALMS;
let CODE;
let OPENID;

const environment = 'stage'; // dev || stage || prod

switch (environment) {
    case 'dev':
        keycloak_URL = keycloak_DEV_URL;
        keycloak_REALM = keycloak_DEV_REALM;
        keycloak_CLIENT_ID = keycloak_DEV_CLIENT_ID;
        keycloak_REDIRECT_URI = keycloak_DEV_REDIRECT_URI;
        // Api Urls
        API_BASE_URL = API_BASE_DEV_URL;
        SUB_URL = SUB_DEV_URL;
        GET_LOGIN_URL = GET_LOGIN_DEV_URL;
        REALMS = DEV_REALMS;
        CODE = DEV_CODE;
        OPENID = DEV_OPENID;
        break;

    case 'stage':
        keycloak_URL = keycloak_STAGE_URL;
        keycloak_REALM = keycloak_STAGE_REALM;
        keycloak_CLIENT_ID = keycloak_STAGE_CLIENT_ID;
        keycloak_REDIRECT_URI = keycloak_STAGE_REDIRECT_URI;
        // Api Urls
        API_BASE_URL = API_BASE_STAGE_URL;
        SUB_URL = SUB_STAGE_URL;
        GET_LOGIN_URL = GET_LOGIN_STAGE_URL;
        REALMS = STAGE_REALMS;
        CODE = STAGE_CODE;
        OPENID = STAGE_OPENID;
        break;

    case 'prod':
        keycloak_URL = keycloak_PROD_URL;
        keycloak_REALM = keycloak_PROD_REALM;
        keycloak_CLIENT_ID = keycloak_PROD_CLIENT_ID;
        keycloak_REDIRECT_URI = keycloak_PROD_REDIRECT_URI;
        // Api Urls
        API_BASE_URL = API_BASE_PROD_URL;
        SUB_URL = SUB_PROD_URL;
        GET_LOGIN_URL = GET_LOGIN_PROD_URL;
        REALMS = PROD_REALMS;
        CODE = PROD_CODE;
        OPENID = PROD_OPENID;
        break;

    default:
        throw new Error(`Invalid environment: ${environment}`);
}

const config = {
    keycloak_url: keycloak_URL,
    realm: keycloak_REALM,
    clientId: keycloak_CLIENT_ID,
    redirectUri: keycloak_REDIRECT_URI,
    appsiteUri: keycloak_URL,
};

export {
    keycloak_URL, keycloak_REALM, keycloak_CLIENT_ID, API_BASE_URL, SUB_URL, keycloak_REDIRECT_URI,
    config, GET_LOGIN_URL, REALMS, CODE, OPENID
};
