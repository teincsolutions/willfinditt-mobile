import { pushNotificationService } from '@/services/pushNotificationService';
import { mmkvStorage } from '@/utils/mmkvStorage';
import { setPendingNotification } from '@/utils/notificationRouting';
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// ============================================
// FCM Service - Firebase Cloud Messaging
// ============================================

class FCMService {
  private deviceToken: string | null = null;
  private readonly TOKEN_KEY = 'fcm_token';

  // ============================================
  // Permission Management
  // ============================================

  /**
   * Request notification permissions from the user
   */
  async requestPermissions(): Promise<boolean> {
    try {
      // For Android 13+ (API level 33+), use notifee to request permissions
      if (Platform.OS === 'android') {
        const settings = await notifee.requestPermission();
        const enabled = settings.authorizationStatus >= 1; // AUTHORIZED or PROVISIONAL
        
        if (enabled) {
          console.log('Android notification permissions granted');
        } else {
          console.log('Android notification permissions denied');
        }
        
        return enabled;
      }
      
      // For iOS, use Firebase messaging
      const status = await messaging().requestPermission();
      const enabled = status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('iOS notification permissions granted');
      } else {
        console.log('iOS notification permissions denied');
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
      if (Platform.OS === 'android') {
        const settings = await notifee.getNotificationSettings();
        return settings.authorizationStatus >= 1; // AUTHORIZED or PROVISIONAL
      }
      
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
      // Check if we have a cached token first
      const cachedToken = mmkvStorage.getItem(this.TOKEN_KEY);
      if (cachedToken) {
        this.deviceToken = cachedToken;
        console.log('Using cached FCM token');
        return cachedToken;
      }

      // Get fresh token from Firebase
      const token = await messaging().getToken();
      this.deviceToken = token;
      // Cache the token
      mmkvStorage.setItem(this.TOKEN_KEY, token);
      console.log('Retrieved and cached new FCM token');
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
      console.log("fcmService.registerDevice: Getting FCM token for userId:", userId);
      const token = await this.getToken();
      if (!token) {
        console.error('fcmService.registerDevice: No FCM token available for registration');
        return false;
      }

      console.log("fcmService.registerDevice: Registering device with backend, token:", token.substring(0, 10) + "...");
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

      console.log('fcmService.registerDevice: Device registered successfully with backend');
      return true;
    } catch (error) {
      console.log('fcmService.registerDevice: Error registering device:', error);
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
      // Update cached token
      mmkvStorage.setItem(this.TOKEN_KEY, token);
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
    return messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log('Notification opened from background:', remoteMessage);

      // Clear the app badge when notification is opened
      await this.clearBadge();

      // Set pending notification for routing after app is ready
      if (remoteMessage.data) {
        setPendingNotification(remoteMessage as any);
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
        // Clear the app badge when app is opened from notification
        await this.clearBadge();
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
  // Badge Management
  // ============================================

  /**
   * Clear the app icon badge count
   */
  async clearBadge(): Promise<void> {
    try {
      await notifee.setBadgeCount(0);
      console.log('App badge cleared');
    } catch (error) {
      console.error('Error clearing app badge:', error);
    }
  }

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
   * Logout device from push notifications
   */
  async logoutDevice(): Promise<boolean> {
    try {
      const token = this.getCurrentToken();
      if (!token) {
        console.error('No FCM token available for logout');
        return false;
      }

      await pushNotificationService.logoutDevice({
        fcmToken: token,
      });

      // Delete the token locally
      await messaging().deleteToken();
      this.deviceToken = null;
      // Clear cached token
      mmkvStorage.removeItem(this.TOKEN_KEY);

      console.log('Device logged out successfully');
      return true;
    } catch (error) {
      console.error('Error logging out device:', error);
      return false;
    }
  }
}

// Export singleton instance
export const fcmService = new FCMService();

// Export background message handler for registration
