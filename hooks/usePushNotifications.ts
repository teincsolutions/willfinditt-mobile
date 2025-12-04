import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  registerPushToken,
  getMyPushTokens,
  deletePushToken,
  updatePushToken,
} from "@/services/notificationService";
import { useAuthStore } from "./useAuth";
import { useAppToast } from "./useToast";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushToken {
  id: string;
  userId: string;
  token: string;
  platform: "ios" | "android" | "web";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Hook for managing push notification registration
export const usePushNotifications = () => {
  const { user, isLoggedIn } = useAuthStore();
  const toast = useAppToast();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [pushTokens, setPushTokens] = useState<PushToken[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  // Register device for push notifications
  const registerDeviceForPushNotifications = async () => {
    if (!user || !isLoggedIn) return;

    try {
      // Check permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Push notification permission not granted");
        toast.showWarning(
          "Permission needed",
          "Push notification permission is required"
        );
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      console.log("Getting Expo push token...");
      const token = await Notifications.getExpoPushTokenAsync();
      console.log(
        "Expo push token obtained:",
        token.data.substring(0, 50) + "..."
      );
      setExpoPushToken(token.data);

      // Check if we already have this token registered
      console.log("Checking existing tokens...");
      const existingTokens = await getMyPushTokens();
      const existingToken = existingTokens.find(
        (t: PushToken) => t.token === token.data
      );

      if (existingToken) {
        console.log(
          "Existing token found, activating if needed:",
          existingToken.isActive
        );
        // Token already exists, just activate it if it's inactive
        if (!existingToken.isActive) {
          await updatePushToken(existingToken.id, true);
          console.log("Push token activated");
        }
      } else {
        console.log("Registering new push token with API...");
        // Register new token
        setIsRegistering(true);
        await registerPushToken(
          user.id,
          token.data,
          Platform.OS as "ios" | "android" | "web"
        );
        console.log("Push token registered successfully");
      }

      setPushTokens(await getMyPushTokens());
      setIsRegistering(false);
    } catch (error) {
      console.error("Failed to register push token:", error);
      toast.showError(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to register device for push notifications"
      );
      setIsRegistering(false);
    }
  };

  // Unregister device from push notifications
  const unregisterDeviceForPushNotifications = async () => {
    if (!user || pushTokens.length === 0) return;

    try {
      for (const tokenData of pushTokens) {
        if (tokenData.isActive) {
          await updatePushToken(tokenData.id, false);
        }
      }

      setPushTokens(await getMyPushTokens());
      console.log("Push token deactivated");
    } catch (error) {
      console.error("Failed to unregister push token:", error);
      toast.showError(
        "Error",
        "Failed to unregister device from push notifications"
      );
    }
  };

  // Get push token for current device
  const getCurrentDeviceToken = (): string | null => {
    return expoPushToken;
  };

  // Handle notification tapped
  const handleNotificationTapped = (
    notification: Notifications.Notification
  ) => {
    const data = notification.request.content.data;

    // Handle different notification types and navigate to appropriate screens
    switch (data?.type) {
      case "CHAT_MESSAGE":
        // Navigate to chat screen
        break;
      case "AD_INTERACTION":
        // Navigate to ad details
        break;
      case "PROMOTION":
        // Navigate to promotion details
        break;
      default:
        // Navigate to notifications screen
        break;
    }
  };

  // Set up notification listeners
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    // Delay registration to avoid immediate Firebase conflicts
    const timer = setTimeout(() => {
      registerDeviceForPushNotifications();
    }, 2000); // 2 second delay

    // Set up notification listeners
    const notificationReceivedListener =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    const notificationResponseReceivedListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
        handleNotificationTapped(response.notification);
      });

    return () => {
      clearTimeout(timer);
      notificationReceivedListener?.remove();
      notificationResponseReceivedListener?.remove();
    };
  }, [isLoggedIn, user?.id]);

  // Cleanup when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      // Deactivate tokens when logging out
      unregisterDeviceForPushNotifications().catch(console.error);
      setExpoPushToken(null);
    }
  }, [isLoggedIn]);

  return {
    expoPushToken,
    pushTokens,
    isRegistering,
    getCurrentDeviceToken,
    registerDevice: registerDeviceForPushNotifications,
    unregisterDevice: unregisterDeviceForPushNotifications,
    handleNotificationTapped,
  };
};

// Hook for managing deep links from notifications
export const useNotificationDeepLinks = () => {
  const [initialUrl, setInitialUrl] = useState<string | null>(null);

  useEffect(() => {
    // Handle deep links from notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        if (data?.url) {
          // Handle deep link URL
          setInitialUrl(data.url as string);
        }
      }
    );

    return () => subscription.remove();
  }, []);

  return { initialUrl };
};
