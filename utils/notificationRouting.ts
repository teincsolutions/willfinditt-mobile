import { NotificationResponse } from "@/services/pushNotificationService";
import { router } from "expo-router";

// ============================================
// Notification Routing Configuration
// ============================================

export interface NotificationRoute {
  path: string;
  requiredParams: string[];
  fallbackPath?: string;
}

export const NOTIFICATION_ROUTES: Record<string, NotificationRoute> = {
  AD_INTERACTION: {
    path: "/ads/[adId]",
    requiredParams: ["adId"],
    fallbackPath: "/(drawers)/notifications",
  },
  CHAT_MESSAGE: {
    path: "/chats/[chatId]",
    requiredParams: ["chatId"],
    fallbackPath: "/(drawers)/messages",
  },
  SELLER_REVIEW: {
    path: "/account/reviews",
    requiredParams: [],
    fallbackPath: "/(drawers)/notifications",
  },
  AD_COMMENT: {
    path: "/ads/[adId]",
    requiredParams: ["adId"],
    fallbackPath: "/(drawers)/notifications",
  },
  PROMOTION: {
    path: "/(drawers)/notifications",
    requiredParams: [],
  },
  SYSTEM: {
    path: "/(drawers)/notifications",
    requiredParams: [],
  },
};

// ============================================
// Notification Routing Logic
// ============================================

export const handleNotificationRouting = (notification: NotificationResponse): void => {
  try {
    // Get the notification type from data, fallback to notification.type
    const notificationType = notification.data?.type || notification.type;
    
    // Get route configuration for notification type
    const routeConfig = NOTIFICATION_ROUTES[notificationType];

    if (!routeConfig) {
      console.warn(`No route configuration found for notification type: ${notificationType}`);
      // Fallback to notifications screen
      router.push("/(drawers)/notifications" as any);
      return;
    }

    // Check if all required parameters are present
    const missingParams: string[] = [];
    const params: Record<string, any> = {};

    for (const param of routeConfig.requiredParams) {
      if (notification.data && notification.data[param]) {
        params[param] = notification.data[param];
      } else {
        missingParams.push(param);
      }
    }

    if (missingParams.length > 0) {
      console.warn(
        `Missing required parameters for ${notificationType}: ${missingParams.join(", ")}`
      );
      // Use fallback path if available
      if (routeConfig.fallbackPath) {
        router.push(routeConfig.fallbackPath as any);
      } else {
        router.push("/(drawers)/notifications" as any);
      }
      return;
    }

    // Navigate to the target route
    if (routeConfig.requiredParams.length === 0) {
      // No params needed
      router.push(routeConfig.path as any);
    } else {
      // With params
      router.push({
        pathname: routeConfig.path as any,
        params,
      });
    }

  } catch (error) {
    console.error("Error handling notification routing:", error);
    // Fallback to notifications screen
    router.push("/(drawers)/notifications" as any);
  }
};

// ============================================
// Deferred Routing for App Launch
// ============================================

let pendingNotification: NotificationResponse | null = null;

export const setPendingNotification = (notification: NotificationResponse): void => {
  pendingNotification = notification;
};

export const processPendingNotification = (): void => {
  if (pendingNotification) {
    handleNotificationRouting(pendingNotification);
    pendingNotification = null;
  }
};

// ============================================
// Chat-Specific Routing Rules
// ============================================

export const shouldSkipChatNotification = (
  notification: NotificationResponse,
  currentChatId?: string
): boolean => {
  const notificationType = notification.data?.type || notification.type;
  if (notificationType !== "CHAT_MESSAGE") {
    return false;
  }

  // If user is currently viewing this chat, skip notification
  if (currentChatId && notification.data?.chatId === currentChatId) {
    return true;
  }

  return false;
};