import messaging from '@react-native-firebase/messaging';
import { Alert, Platform, PermissionsAndroid, Linking, AppState } from 'react-native';
import notifee, { TriggerType, EventType, AndroidGroupAlertBehavior, AndroidStyle, AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NOTIFY_DEVICE_TOKEN } from '../constants/AsyncStorageConst';
import navigationService from '../../navigation/navigationService';
import { ROUTE_KEYS } from '../../navigation/constants';
import { insertPublicationDateItemToDB } from '../../database/services/publicationService';
import { COLORS } from '../enums/colors';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) { getFcmToken(); }
};

export const getFcmToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log(token);
    await AsyncStorage.setItem(NOTIFY_DEVICE_TOKEN, JSON.stringify(token));
  } catch (error) {
    console.log("error in creating token");
  }
};

export async function onDisplayNotification(remoteMessage) {
  await notifee.requestPermission();

  const { title, body } = remoteMessage.notification;
  const { slug, gid, name, alertTime } = remoteMessage.data;
  // custom add
  const date = new Date().toISOString().slice(0, 10);
  const newTriggerTime = Date.now() + 1000;
  const groupSlugId = slug.toLowerCase().replace(/\s+/g, '');
  const trigger = { type: TriggerType.TIMESTAMP, timestamp: newTriggerTime };

  // Get existing notifications
  const existingNotifications = await notifee.getDisplayedNotifications();
  const uniqueChannelIds = new Set();

  // Remove duplicated slug object
  const filteredNotifications = existingNotifications.filter((notification) => {
    const channelId = notification.notification?.android?.channelId;
    const hasLines = notification.notification?.android?.style?.lines?.length > 0;

    if (channelId && hasLines && !uniqueChannelIds.has(channelId)) {
      uniqueChannelIds.add(channelId);
      return true;
    }

    return false;
  });

  // Find the notification with the same slug
  const existingNotification =
    filteredNotifications.find((notification) => notification.notification.android.channelId === groupSlugId);

  if (existingNotification) {
    // Notification with the same slug already exists
    const updatedNotification = {
      ...existingNotification.notification,
      android: {
        ...existingNotification.notification.android,
        style: {
          ...existingNotification.notification.android.style,
          lines: [
            ...existingNotification?.notification?.android?.style?.lines,
            body
          ],
        },
      },
    };

    if (AppState.currentState === 'active') {
      const triggerNotification = notifee.createTriggerNotification(updatedNotification, trigger);
      await notifee.displayNotification(triggerNotification);
    }
  } else {
    await notifee.createChannel({ id: groupSlugId, name: 'Default Channel' });
    // Create a new notification
    const notification = {
      title: title,
      body: body,
      data: { slug: slug, gid: gid, name: name, alertTime: alertTime },
      android: {
        channelId: groupSlugId,
        smallIcon: 'ic_notification',
        color: COLORS.systemBar,
        group: groupSlugId,
        groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
        style: {
          type: AndroidStyle.INBOX,
          lines: [body],
        },
        priority: AndroidImportance.HIGH
      },
    };

    if (AppState.currentState === 'active') {
      const triggerNotification = notifee.createTriggerNotification(notification, trigger);
      await notifee.displayNotification(triggerNotification);
    }
  }

  await insertPublicationDateItemToDB(slug, gid, date);
};

export const onForeGroundEvent = () => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    const { slug, gid, name } = detail?.notification?.data;
    switch (type) {
      case EventType.DISMISSED:
        break;
      case EventType.PRESS:
        Linking.openURL(`ranenetwork://myWallTab/articleListPage/${name}/${slug}/${gid}`);
        break;
    }
  });
};

export const checkBatteryOptimization = async () => {
  const batteryOptimizationEnabled = await notifee.isBatteryOptimizationEnabled();
  if (batteryOptimizationEnabled) {
    Alert.alert(
      'Restrictions Detected',
      'To ensure notifications are delivered, please disable battery optimization for the app.',
      [
        { text: 'OK, open settings', onPress: async () => await notifee.openBatteryOptimizationSettings() },
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      ],
      { cancelable: false }
    );
  }
};

export const notificationListner = async () => {

  const unsubscribe = messaging().onMessage(async remoteMessage => {
    const messageData = JSON.parse(JSON.stringify(remoteMessage));
    onDisplayNotification(messageData);
  });

  messaging().onNotificationOpenedApp(async remoteMessage => {
    if (remoteMessage) {
      const { slug, gid, name } = remoteMessage?.data;
      const date = new Date().toISOString().slice(0, 10);
      await insertPublicationDateItemToDB(slug, gid, date);
      Linking.openURL(`ranenetwork://myWallTab/articleListPage/${name}/${slug}/${gid}`);
      console.log('Notification caused app to open from background state:', remoteMessage);
    }
  });

  messaging().getInitialNotification(async remoteMessage => {
    try {
      const messageData = JSON.parse(JSON.stringify(remoteMessage));
      onDisplayNotification(messageData)
        .then(remoteMessages => {
          if (remoteMessages) {
            console.log('Notification caused app to open from index quit state:', remoteMessages.notification);
          }
        });
    } catch (error) {
      console.error('Error handling initial notification:', error);
    }
  });
  return unsubscribe
};

export const bootstrap = async () => {
  const initialNotification = await notifee.getInitialNotification();
  if (initialNotification) {
    const { name, slug, gid } = initialNotification?.notification?.data;
    const date = new Date().toISOString().slice(0, 10);
    await insertPublicationDateItemToDB(slug, gid, date);
    setTimeout(() => {
      Linking.openURL(`ranenetwork://myWallTab/articleListPage/${name}/${slug}/${gid}`);
    }, 1200)
  }
};

export const checkApplicationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    } catch (error) {
      console.log(error);
    }
  }
};