import Realm from 'realm';
import { databaseOptions } from "../databaseOptions";
import { MY_SAVED_ARTICLE_LIST_SCHEMA, MY_SAVED_ARTICLE_SCHEMA, MY_SAVED_BRIEF_LIST_SCHEMA } from "../schemas/mysavedSchema";

//================================= ARTICLE ======================================//

// Save Article into My Saved List local Database
export const saveArticleListToMySavedListLocalDB = articleList => new Promise((resolve, reject) => {
    // Realm.open(databaseOptions).then(realm => {
    //     realm.write(() => {
    //         realm.create(MY_SAVED_ARTICLE_SCHEMA, articleList);
    //         resolve(articleList);
    //     });
    // }).catch((error) => reject(error));
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            for (const article of articleList) {
                realm.create(MY_SAVED_ARTICLE_SCHEMA, article);
            }
            resolve(articleList);
        });
    }).catch((error) => reject(error));
});

// Get Saved Article from My Saved List local Database
export const getMySavedArticleListFromLocalDB = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let articleList = realm.objects(MY_SAVED_ARTICLE_SCHEMA);
        resolve(articleList);
    }).catch((error) => reject(error));
});

// Remove Saved Article from My Saved List local Database
export const removeMySavedArticleListFromLocalDB = articleListId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            // let deletingArticleList = realm.objectForPrimaryKey(MY_SAVED_ARTICLE_SCHEMA, articleListId);
            let deletingArticleList = realm.objects(MY_SAVED_ARTICLE_SCHEMA);
            realm.delete(deletingArticleList);
            resolve();
        });
    }).catch((error) => reject(error));
});

//================================= BRIEF ======================================//

// Save Brief into My Saved List local Database
export const saveBriefListToMySavedListLocalDB = briefList => new Promise((resolve, reject) => {
    // Realm.open(databaseOptions).then(realm => {
    //     realm.write(() => {
    //         realm.create(MY_SAVED_BRIEF_LIST_SCHEMA, briefList);
    //         resolve(briefList);
    //     });
    // }).catch((error) => reject(error));
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            for (const brief of briefList) {
                realm.create(MY_SAVED_BRIEF_LIST_SCHEMA, brief);
            }
            resolve(briefList);
        });
    }).catch((error) => reject(error));
});

// Get Saved Brief from My Saved List local Database
export const getMySavedBriefListFromLocalDB = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let briefList = realm.objects(MY_SAVED_BRIEF_LIST_SCHEMA);
        resolve(briefList);
    }).catch((error) => reject(error));
});

// Remove Saved Brief from My Saved List local Database
export const removeMySavedBriefListFromLocalDB = briefListId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            // let deletingBriefList = realm.objectForPrimaryKey(MY_SAVED_BRIEF_LIST_SCHEMA, briefListId);
            let deletingBriefList = realm.objects(MY_SAVED_BRIEF_LIST_SCHEMA);
            realm.delete(deletingBriefList);
            resolve();
        });
    }).catch((error) => reject(error));
});