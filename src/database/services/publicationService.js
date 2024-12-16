import Realm from 'realm';
import { databaseOptions } from "../databaseOptions";
import { DIGEST_PUBLICATION_SCHEMA } from "../schemas/publicationSchema";

// insert publication list into local database
export const insertDigestPublicationListToLocalDB = digestPublicationList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deletingdigestPublicationList = realm.objects(DIGEST_PUBLICATION_SCHEMA);
            realm.delete(deletingdigestPublicationList);
            digestPublicationList.forEach(digestPublication => {
                realm.create(DIGEST_PUBLICATION_SCHEMA, digestPublication);
            });
            resolve(digestPublicationList);
        });

    }).catch((error) => reject(error));
});

// get publication list from local database
export const getDigestPublicationListFromLocalDB = (digest_slug) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let publicationList = realm.objects(DIGEST_PUBLICATION_SCHEMA);
        const digest_slug_publication_data = publicationList.filtered(`slug == "${digest_slug}"`);
        resolve(digest_slug_publication_data);
    }).catch((error) => reject(error));
});

// get all publications List from local Database
export const getAllDigestPublicationListFromLocalDB = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let digestPublicationList = realm.objects(DIGEST_PUBLICATION_SCHEMA);
        resolve(digestPublicationList);
    }).catch((error) => reject(error));
});

// delete article list from local database
export const deleteDigestPublicationListFromLocalDB = (digest_slug) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deleteDigestPublicationList = realm.objects(DIGEST_PUBLICATION_SCHEMA);
            const delete_digest_slug_publication_data = deleteDigestPublicationList.filtered(`slug == "${digest_slug}"`);
            realm.delete(delete_digest_slug_publication_data);
            resolve();
        });
    }).catch((error) => reject(error));
});

// delete article list from local database
export const updateReadStatusById = (digest_slug, gid) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deleteDigestPublicationList = realm.objects(DIGEST_PUBLICATION_SCHEMA);
            const delete_digest_slug_publication_data = deleteDigestPublicationList.filtered(`slug == "${digest_slug}"`);
            const digestData = delete_digest_slug_publication_data[0]; // Assuming you have only one DigestData object
            const publicationItem = digestData.publication.filtered(`gid == "${gid}"`)[0];

            if (publicationItem) {
                publicationItem.dateWiseReadStatus = true;
                resolve();
            }
            const digestNow = delete_digest_slug_publication_data[0]; // Check if all dateWiseReadStatus values are true
            const allRead = digestNow.publication.every(item => item.dateWiseReadStatus); // Update the readStatus based on the result
            digestNow.readStatus = allRead;
        });
    }).catch((error) => reject(error));
});


// update status based on notification
export const updateReadStatusByNotify = (digest_slug, gid) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deleteDigestPublicationList = realm.objects(DIGEST_PUBLICATION_SCHEMA);
            const delete_digest_slug_publication_data = deleteDigestPublicationList.filtered(`slug == "${digest_slug}"`);
            const digestData = delete_digest_slug_publication_data[0]; // Assuming you have only one DigestData object
            const publicationItem = digestData.publication.filtered(`gid == "${gid}"`)[0];

            if (publicationItem) {
                publicationItem.dateWiseReadStatus = false;
                resolve();
            }
            const digestNow = delete_digest_slug_publication_data[0]; // Check if all dateWiseReadStatus values are true
            const allRead = digestNow.publication.every(item => item.dateWiseReadStatus); // Update the readStatus based on the result

            digestNow.readStatus = allRead;

        });


    }).catch((error) => reject(error));
});

// delete date from the publication list 
export const deletePublicationDateItemFromDB = (digest_slug, gid) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deleteDigestPublicationList = realm.objects(DIGEST_PUBLICATION_SCHEMA);
            const delete_digest_slug_publication_data = deleteDigestPublicationList.filtered(`slug == "${digest_slug}"`);
            const digestData = delete_digest_slug_publication_data[0];
            const publicationItem = digestData.publication.filtered(`gid == "${gid}"`)[0];
            realm.delete(publicationItem);
            resolve();
        });
    }).catch((error) => reject(error));
});

export const insertPublicationDateItemToDB = (digest_slug, gid, date) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deleteDigestPublicationList = realm.objects(DIGEST_PUBLICATION_SCHEMA);
            const delete_digest_slug_publication_data = deleteDigestPublicationList.filtered(`slug == "${digest_slug}"`);
            if (delete_digest_slug_publication_data?.length != 0) {
                const digestData = delete_digest_slug_publication_data[0];
                const existingItemIndex = digestData.publication.findIndex(item => item.gid  === gid);

                if (existingItemIndex !== -1) {
                    digestData.publication[existingItemIndex].gid = gid;
                    digestData.publication[existingItemIndex].dateWiseReadStatus = false;
                } else {
                    const newPublicationItem = {
                        gid: gid,
                        date: date,
                        dateWiseReadStatus: false
                    };
                    // Add the new publication item to the digestData
                    digestData?.publication?.push(newPublicationItem);
                }

                const allRead = digestData?.publication?.every(item => item.dateWiseReadStatus); // Update the readStatus based on the result
                digestData.readStatus = allRead;
            }
            resolve();
        });
    }).catch((error) => reject(error));
});