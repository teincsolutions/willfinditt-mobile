import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// ============================================
// FCM Background Message Handler
// ============================================

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);

  try {
    // Create notification channel for Android
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    }

    // Display notification
    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'WillFindIt',
      body: remoteMessage.notification?.body || 'You have a new notification',
      data: remoteMessage.data,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        style: remoteMessage.notification?.image ? {
          type: AndroidStyle.BIGPICTURE,
          picture: remoteMessage.notification.image,
        } : undefined,
      },
      ios: {
        sound: 'default',
        badgeCount: 1,
      },
    });
  } catch (error) {
    console.error('Error handling background message:', error);
  }
});