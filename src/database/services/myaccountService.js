import Realm from "realm";
import { databaseOptions } from "../databaseOptions";

const { MY_ACCOUNT_BRIEF_LIST_SCHEMA, MY_ACCOUNT_SETTINGS_DATA_SCHEMA } = require("../schemas/myaccountSchema");

// insert my account List into local Database
export const insertMyAccountBriefListToLocalDB = myAccountBriefList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            for (const brief of myAccountBriefList) {
                realm.create(MY_ACCOUNT_BRIEF_LIST_SCHEMA, brief);
            }
            resolve(myAccountBriefList);
        });
    }).catch((error) => reject(error));
});

// get my account List from local Database
export const getMyAccountBriefListFromLocalDB = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let myAccountBriefList = realm.objects(MY_ACCOUNT_BRIEF_LIST_SCHEMA);
        resolve(myAccountBriefList);
    }).catch((error) => reject(error));
});

// delete my account List from local Database
export const deleteMyAccountBriefListFromLocalDB = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deletingAllMyAccountBriefList = realm.objects(MY_ACCOUNT_BRIEF_LIST_SCHEMA);
            realm.delete(deletingAllMyAccountBriefList);
            resolve();
        });
    }).catch((error) => reject(error));
});

//============================= USER DATA =================================//

// insert my account settings data into local Database
export const insertMyAccountSettingsDataToLocalDB = myAccountSettingsData => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            // for (const settingsData of myAccountSettingsData) {
                realm.create(MY_ACCOUNT_SETTINGS_DATA_SCHEMA, myAccountSettingsData);
            // }
            resolve(myAccountSettingsData);
        });
    }).catch((error) => reject(error));
});

// delete my account settings data from local Database
export const deleteMyAccountSettingsDataFromLocalDB = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deletingAllMyAccountSettingsData = realm.objects(MY_ACCOUNT_SETTINGS_DATA_SCHEMA);
            realm.delete(deletingAllMyAccountSettingsData);
            resolve();
        });
    }).catch((error) => reject(error));
});

// get my account settings data from local Database
export const getMyAccountSettingsDataFromLocalDB = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let myAccountSettingsData = realm.objects(MY_ACCOUNT_SETTINGS_DATA_SCHEMA);
        resolve(myAccountSettingsData);
    }).catch((error) => reject(error));
});

export default new Realm(databaseOptions);