import Realm from 'realm';
import { databaseOptions } from "../databaseOptions";
import { DIGEST_ARTICLE_SCHEMA } from "../schemas/articleSchema";

// insert article list into local database
export const insertArticleListToLocalDB = articleList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            // avoid duplication
            let allArticleList = realm.objects(DIGEST_ARTICLE_SCHEMA);  
            const existingItem = allArticleList.find(item => item.gid === articleList.gid);
            if (!existingItem) {
                realm.create(DIGEST_ARTICLE_SCHEMA, articleList);
                resolve(articleList);
            } else {
                resolve(allArticleList);
            }
        });
    }).catch((error) => reject(error));
});

// get article list from local database
export const getArticleListFromLocalDB = (digest_slug, selectedDate) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let articleList = realm.objects(DIGEST_ARTICLE_SCHEMA);
        let digest_slug_article_data;
        if (selectedDate) {
            digest_slug_article_data = articleList.find(item => item.slug === digest_slug && item.gid === selectedDate);
        } else {
            const briefArray = articleList.filtered(`slug == "${digest_slug}"`);
            let lastObjectArray = briefArray.length > 0 ? [briefArray[briefArray.length - 1]] : [];
            digest_slug_article_data = lastObjectArray;
        }
        resolve(digest_slug_article_data);
    }).catch((error) => reject(error));
});

// delete article list from local database
export const deleteArticleListFromLocalDB = (digest_slug) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deleteArticleList = realm.objects(DIGEST_ARTICLE_SCHEMA);
            const delete_digest_slug_article_data = deleteArticleList.filtered(`slug == "${digest_slug}"`);
            realm.delete(delete_digest_slug_article_data);
            resolve();
        });
    }).catch((error) => reject(error));
});
