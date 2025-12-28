import { pushNotificationService } from '@/services/pushNotificationService';
import { handleNotificationRouting } from '@/utils/notificationRouting';
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// ============================================
// FCM Service - Firebase Cloud Messaging
// ============================================

class FCMService {
  private deviceToken: string | null = null;

  // ============================================
  // Permission Management
  // ============================================

  /**
   * Request notification permissions from the user
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const status = await messaging().requestPermission();
      const enabled = status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permissions granted');
      } else {
        console.log('Notification permissions denied');
      }

      return enabled;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Check if notifications are enabled
   */
  async hasPermissions(): Promise<boolean> {
    try {
      const status = await messaging().hasPermission();
      return status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL;
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }

  // ============================================
  // Token Management
  // ============================================

  /**
   * Get FCM token for this device
   */
  async getToken(): Promise<string | null> {
    try {

      const token  = await messaging().getToken();
      this.deviceToken = token;
      console.log('Push Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  /**
   * Get current stored token
   */
  getCurrentToken(): string | null {
    return this.deviceToken;
  }

  /**
   * Register device token with backend
   */
  async registerDevice(userId?: string): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) {
        console.error('No FCM token available for registration');
        return false;
      }

      await pushNotificationService.registerDevice({
        platform: Platform.OS as 'ios' | 'android',
        fcmToken: token,
        userId,
        meta: {
          model: Platform.OS === 'ios' ? 'iOS Device' : 'Android Device',
          version: Platform.Version.toString(),
          appVersion: '1.0.0', // You might want to get this from a version constant
        },
      });

      console.log('Device registered successfully with backend');
      return true;
    } catch (error) {
      console.error('Error registering device:', error);
      return false;
    }
  }

  /**
   * Handle token refresh
   */
  async onTokenRefresh(callback: (token: string) => void): Promise<() => void> {
    return messaging().onTokenRefresh((token) => {
      console.log('FCM Token refreshed:', token);
      this.deviceToken = token;
      callback(token);
    });
  }

  // ============================================
  // Message Handling
  // ============================================

  /**
   * Handle incoming FCM messages when app is in foreground
   */
  async onMessage(callback?: (message: any) => void): Promise<() => void> {
    return messaging().onMessage(async (remoteMessage) => {
      console.log('FCM Message received in foreground:', remoteMessage);

      // Display notification using Notifee
      await this.displayNotification(remoteMessage);

      // Call custom callback if provided
      if (callback) {
        callback(remoteMessage);
      }
    });
  }

  /**
   * Handle notification opened from background/quit state
   */
  async onNotificationOpenedApp(callback?: (message: any) => void): Promise<() => void> {
    return messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened from background:', remoteMessage);

      // Handle routing based on notification data
      if (remoteMessage.data) {
        handleNotificationRouting(remoteMessage as any);
      }

      // Call custom callback if provided
      if (callback) {
        callback(remoteMessage);
      }
    });
  }

  /**
   * Get initial notification that opened the app
   */
  async getInitialNotification(): Promise<any | null> {
    try {
      const remoteMessage = await messaging().getInitialNotification();
      if (remoteMessage) {
        console.log('App opened from notification:', remoteMessage);
        return remoteMessage;
      }
      return null;
    } catch (error) {
      console.error('Error getting initial notification:', error);
      return null;
    }
  }

  // ============================================
  // Notification Display
  // ============================================

  /**
   * Display notification using Notifee
   */
  private async displayNotification(remoteMessage: any): Promise<void> {
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
      console.error('Error displaying notification:', error);
    }
  }

  // ============================================
  // Background Message Handler
  // ============================================

  /**
   * Background message handler (must be registered at module level)
   */
  static backgroundMessageHandler = async (remoteMessage: any) => {
    console.log('FCM Message received in background:', remoteMessage);

    // Display notification
    try {
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
          sound: 'default',
        });
      }

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'WillFindIt',
        body: remoteMessage.notification?.body || 'You have a new notification',
        data: remoteMessage.data,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          sound: 'default',
        },
        ios: {
          sound: 'default',
          badgeCount: 1,
        },
      });
    } catch (error) {
      console.error('Error displaying background notification:', error);
    }
  };

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Subscribe to topic
   */
  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    }
  }

  /**
   * Unsubscribe from topic
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
    }
  }

  /**
   * Delete FCM token
   */
  async deleteToken(): Promise<void> {
    try {
      await messaging().deleteToken();
      this.deviceToken = null;
      console.log('FCM token deleted');
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  }
}

// Export singleton instance
export const fcmService = new FCMService();

// Export background message handler for registration
