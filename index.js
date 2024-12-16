/**
 * @format
 */
import { AppRegistry, Linking } from 'react-native';
import App from './src';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging'
import { onDisplayNotification } from './src/common/utils/firebaseUtils';
import notifee, { EventType } from '@notifee/react-native';
import { insertPublicationDateItemToDB } from './src/database/services/publicationService';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    const messageData = JSON.parse(JSON.stringify(remoteMessage));
    // notifee.deleteChannel('push_channel');
    onDisplayNotification(messageData);
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    const { slug, gid, name } = detail?.notification?.data;
    if (type === EventType.PRESS) {
        const date = new Date().toISOString().slice(0, 10);
        await insertPublicationDateItemToDB(slug, gid, date);
        Linking.openURL(`ranenetwork://myWallTab/articleListPage/${name}/${slug}/${gid}`);
        await notifee.cancelNotification(notification.id);
    }
});

AppRegistry.registerComponent(appName, () => App);
