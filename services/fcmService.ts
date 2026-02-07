import { pushNotificationService } from "@/services/pushNotificationService";
import { mmkvStorage } from "@/utils/mmkvStorage";
import { setPendingNotification } from "@/utils/notificationRouting";
import notifee, {
  AndroidImportance,
  AndroidStyle,
} from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";

// ============================================
// FCM Service - Firebase Cloud Messaging
// ============================================

class FCMService {
  private deviceToken: string | null = null;
  private readonly TOKEN_KEY = "fcm_token";

  // ============================================
  // Permission Management
  // ============================================

  /**
   * Request notification permissions from the user
   */
  async requestPermissions(): Promise<boolean> {
    try {
      // For Android 13+ (API level 33+), use notifee to request permissions
      if (Platform.OS === "android") {
        const settings = await notifee.requestPermission();
        const enabled = settings.authorizationStatus >= 1; // AUTHORIZED or PROVISIONAL

        if (enabled) {
          console.log("Android notification permissions granted");
        } else {
          console.log("Android notification permissions denied");
        }

        return enabled;
      }

      // For iOS, use Firebase messaging
      const status = await messaging().requestPermission();
      const enabled =
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("iOS notification permissions granted");
      } else {
        console.log("iOS notification permissions denied");
      }

      return enabled;
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  /**
   * Check if notifications are enabled
   */
  async hasPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === "android") {
        const settings = await notifee.getNotificationSettings();
        return settings.authorizationStatus >= 1; // AUTHORIZED or PROVISIONAL
      }

      const status = await messaging().hasPermission();
      return (
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.error("Error checking notification permissions:", error);
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
        console.log("✅ Using cached FCM token");
        console.log(
          "Cached token preview:",
          cachedToken.substring(0, 20) + "...",
        );
        return cachedToken;
      }

      // Get fresh token from Firebase
      // For iOS, register device for remote messages first if needed
      if (Platform.OS === "ios") {
        try {
          if (!messaging().isDeviceRegisteredForRemoteMessages) {
            console.log("📱 Registering iOS device for remote messages...");
            await messaging().registerDeviceForRemoteMessages();
            console.log(
              "✅ iOS device registered for remote messages successfully!",
            );
          } else {
            console.log("✅ iOS device already registered for remote messages");
          }
        } catch (regError: any) {
          // Handle specific entitlement errors
          if (
            regError?.code === "messaging/unknown" &&
            regError?.message?.includes("aps-environment")
          ) {
            console.warn(
              "⚠️ Cannot register for push notifications: Missing iOS entitlements.\n" +
                "This build doesn't have push notification capabilities configured.\n" +
                "Run a new EAS build to include the updated entitlements from app.json.",
            );
            return null; // Return early - no point trying to get token
          }
          console.warn("iOS device registration warning:", regError);
          // Continue anyway for other errors
        }
      }

      const token = await messaging().getToken();

      this.deviceToken = token;
      // Cache the token
      mmkvStorage.setItem(this.TOKEN_KEY, token);
      console.log("✅ FCM Token obtained successfully!");
      console.log("FCM Token:", token);
      console.log("Token preview:", token.substring(0, 20) + "...");
      return token;
    } catch (error: any) {
      // Provide helpful error messages
      if (
        error?.code === "messaging/unknown" &&
        error?.message?.includes("aps-environment")
      ) {
        console.warn(
          "⚠️ Push notifications not available: Missing iOS entitlements.\n" +
            "This is expected on iOS Simulator or if the app doesn't have push notification capabilities configured.\n" +
            "For physical devices, rebuild the app with 'eas build' to include the updated entitlements.",
        );
      } else if (error?.code === "messaging/unregistered") {
        console.warn(
          "⚠️ Push notifications not available: Device not registered for remote messages.\n" +
            "This usually means the build is missing push notification entitlements.\n" +
            "Rebuild the app with 'eas build' to include the updated entitlements from app.json.",
        );
      } else {
        console.error("Error getting push token:", error);
      }
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
      console.log(
        "🔔 fcmService.registerDevice: Starting registration for userId:",
        userId || "(anonymous)",
      );
      const token = await this.getToken();
      console.log(
        "🔔 fcmService.registerDevice: getToken returned:",
        token ? `${token.substring(0, 20)}...` : "null",
      );

      if (!token) {
        console.warn(
          "⚠️ fcmService.registerDevice: No FCM token available for registration (this is expected if entitlements are missing)",
        );
        return false;
      }

      console.log(
        "🔔 fcmService.registerDevice: Calling backend API to register device...",
      );
      const response = await pushNotificationService.registerDevice({
        platform: Platform.OS as "ios" | "android",
        fcmToken: token,
        userId,
        meta: {
          model: Platform.OS === "ios" ? "iOS Device" : "Android Device",
          version: Platform.Version.toString(),
          appVersion: "1.0.0", // You might want to get this from a version constant
        },
      });

      console.log("✅ Device registered successfully with backend!");
      console.log("🔔 Registration response:", response);
      console.log("🔔 Registration details:", {
        platform: Platform.OS,
        userId: userId || "(no user - anonymous registration)",
        tokenPreview: token.substring(0, 20) + "...",
        timestamp: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error(
        "❌ fcmService.registerDevice: Error registering device:",
        error,
      );
      return false;
    }
  }

  /**
   * Handle token refresh
   */
  async onTokenRefresh(callback: (token: string) => void): Promise<() => void> {
    return messaging().onTokenRefresh((token) => {
      console.log("FCM Token refreshed:", token);
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
      console.log("FCM Message received in foreground:", remoteMessage);

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
  async onNotificationOpenedApp(
    callback?: (message: any) => void,
  ): Promise<() => void> {
    return messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log("Notification opened from background:", remoteMessage);

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
        console.log("App opened from notification:", remoteMessage);
        // Clear the app badge when app is opened from notification
        await this.clearBadge();
        return remoteMessage;
      }
      return null;
    } catch (error) {
      console.error("Error getting initial notification:", error);
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
      if (Platform.OS === "android") {
        await notifee.createChannel({
          id: "default",
          name: "Default Channel",
          importance: AndroidImportance.HIGH,
          sound: "default",
        });
      }

      // Display notification
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || "WillFindIt",
        body: remoteMessage.notification?.body || "You have a new notification",
        data: remoteMessage.data,
        android: {
          channelId: "default",
          importance: AndroidImportance.HIGH,
          sound: "default",
          style: remoteMessage.notification?.image
            ? {
                type: AndroidStyle.BIGPICTURE,
                picture: remoteMessage.notification.image,
              }
            : undefined,
        },
        ios: {
          sound: "default",
          badgeCount: 1,
        },
      });
    } catch (error) {
      console.error("Error displaying notification:", error);
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
      console.log("App badge cleared");
    } catch (error) {
      console.error("Error clearing app badge:", error);
    }
  }

  /**
   * Background message handler (must be registered at module level)
   */
  static backgroundMessageHandler = async (remoteMessage: any) => {
    console.log("FCM Message received in background:", remoteMessage);

    // Display notification
    try {
      if (Platform.OS === "android") {
        await notifee.createChannel({
          id: "default",
          name: "Default Channel",
          importance: AndroidImportance.HIGH,
          sound: "default",
        });
      }

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || "WillFindIt",
        body: remoteMessage.notification?.body || "You have a new notification",
        data: remoteMessage.data,
        android: {
          channelId: "default",
          importance: AndroidImportance.HIGH,
          sound: "default",
        },
        ios: {
          sound: "default",
          badgeCount: 1,
        },
      });
    } catch (error) {
      console.error("Error displaying background notification:", error);
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
        console.error("No FCM token available for logout");
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

      console.log("Device logged out successfully");
      return true;
    } catch (error) {
      console.error("Error logging out device:", error);
      return false;
    }
  }
}

// Export singleton instance
export const fcmService = new FCMService();

// Export background message handler for registration
