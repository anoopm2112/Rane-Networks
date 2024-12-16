import Realm from "realm";
import { databaseOptions } from "../databaseOptions";

const { DIGEST_LIST_SCHEMA } = require("../schemas/digestSchema");

// insert digest List into local Database
export const insertDigestListToLocalDB = digestList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            for (const digest of digestList) {
                realm.create(DIGEST_LIST_SCHEMA, digest);
            }
            resolve(digestList);
        });
    }).catch((error) => reject(error));
});

// get digest List from local Database
export const getDigestListFromLocalDB = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let digestList = realm.objects(DIGEST_LIST_SCHEMA);
        resolve(digestList);
    }).catch((error) => reject(error));
});

// delete Digest List from local Database
export const deleteDigestListFromLocalDB = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deletingAllDigestList = realm.objects(DIGEST_LIST_SCHEMA);
            realm.delete(deletingAllDigestList);
            resolve();
        });
    }).catch((error) => reject(error));
});

export default new Realm(databaseOptions);