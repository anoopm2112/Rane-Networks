import DeviceInfo from 'react-native-device-info';
import { insertPublicationDateItemToDB } from '../../database/services/publicationService';

export const trimTrailingWhitespace = (word) => {
    return word?.replace(/\s+$/, '');
}

export const createPayloadForRegisterDevice = async () => {

    // Device information
    const model = await DeviceInfo.getModel();
    const make = await DeviceInfo.getManufacturer();
    const model_version = await DeviceInfo.getDeviceId();
    const platform = await DeviceInfo.getSystemName();
    const platform_version = await DeviceInfo.getSystemVersion();
    const version = await DeviceInfo.getVersion();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const optionalDeviceInfo = {}; // Optional fields like mac-address, carrier information, etc.

    const payload = {
        application_info: {
            version,
        },
        device_info: {
            model, make, model_version, platform, platform_version,
            ...optionalDeviceInfo
        },
        timezone,
    };

    return payload;
};

export const updateLocalDB = async (dataFromAPI, dataInLocalDB) => {
    for (const apiItem of dataFromAPI) {
        const localItem = dataInLocalDB.find(dbItem => dbItem.slug === apiItem.slug);

        if (localItem) {
            for (const apiPub of apiItem.publication) {
                const localPub = localItem.publication.find(dbPub => dbPub.gid === apiPub.gid);
                if (!localPub) {
                    await insertPublicationDateItemToDB(apiItem.slug, apiPub.gid, apiPub.date);
                }
            }
        }
    }
}