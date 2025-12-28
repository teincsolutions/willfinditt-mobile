import { fcmService } from "@/services/fcmService";
import {
    getNotifications,
    getUserStatus,
    markNotificationAsRead,
    pauseUserNotifications,
    refreshDeviceToken,
    resumeUserNotifications,
    setUserOffline,
    setUserOnline,
    syncNotifications
} from "@/services/pushNotificationService";
import { handleNotificationRouting } from "@/utils/notificationRouting";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner-native";
import { PUSH_NOTIFICATION_QUERY_KEYS } from "./queryKeys";

// ============================================
// Device Registration Hooks
// ============================================

// ============================================
// Device Registration Hooks
// ============================================

export const useRegisterDevice = (userId?: string) => {
  return useMutation({
    mutationFn: async () => {
      // First get FCM token and register with backend
      const success = await fcmService.registerDevice(userId);
      if (!success) {
        throw new Error("Failed to register FCM device");
      }
      return { success: true };
    },
    onSuccess: (data) => {
      toast.success("Device registered for push notifications");
    },
    onError: (error: any) => {
      console.error("Device registration failed:", error);
      toast.error(
        error.message || error.response?.data?.message || "Failed to register device"
      );
    },
  });
};

export const useRefreshDeviceToken = () => {
  return useMutation({
    mutationFn: refreshDeviceToken,
    onSuccess: (data) => {
      console.log("Device token refreshed:", data);
    },
    onError: (error: any) => {
      console.error("Token refresh failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to refresh device token"
      );
    },
  });
};

// ============================================
// FCM Initialization Hook
// ============================================

export const useFCMInitialization = (userId?: string) => {
  useEffect(() => {
    let unsubscribeOnMessage: (() => void) | undefined;
    let unsubscribeOnNotificationOpened: (() => void) | undefined;
    let unsubscribeOnTokenRefresh: (() => void) | undefined;

    const initializeFCM = async () => {
      try {
        // Request permissions
        const hasPermissions = await fcmService.hasPermissions();
        if (!hasPermissions) {
          const granted = await fcmService.requestPermissions();
          if (!granted) {
            console.log('Notification permissions not granted');
            return;
          }
        }

        // Register device with FCM token
        await fcmService.registerDevice(userId);

        // Set up message handlers
        unsubscribeOnMessage = await fcmService.onMessage();
        unsubscribeOnNotificationOpened = await fcmService.onNotificationOpenedApp();

        // Handle token refresh
        unsubscribeOnTokenRefresh = await fcmService.onTokenRefresh(async (token) => {
          console.log('Token refreshed, re-registering device');
          await fcmService.registerDevice(userId);
        });

        // Check for initial notification
        const initialNotification = await fcmService.getInitialNotification();
        if (initialNotification) {
          // Handle initial notification routing after a short delay to ensure app is ready
          setTimeout(() => {
            handleNotificationRouting(initialNotification as any);
          }, 1000);
        }

      } catch (error) {
        console.error('Error initializing FCM:', error);
      }
    };

    initializeFCM();

    // Cleanup function
    return () => {
      if (unsubscribeOnMessage) unsubscribeOnMessage();
      if (unsubscribeOnNotificationOpened) unsubscribeOnNotificationOpened();
      if (unsubscribeOnTokenRefresh) unsubscribeOnTokenRefresh();
    };
  }, [userId]);
};

// ============================================
// Notification History Hooks
// ============================================

export const usePushNotifications = (
  userId: string,
  params: { limit?: number; offset?: number } = {}
) => {
  return useQuery({
    queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATIONS(userId, params),
    queryFn: () => getNotifications(userId, params),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMarkPushNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ notificationId, userId }: { notificationId: string; userId: string }) =>
      markNotificationAsRead(notificationId, userId),
    onSuccess: (data, variables) => {
      // Invalidate push notifications list
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATIONS(variables.userId),
      });
    },
    onError: (error: any) => {
      console.error("Mark notification read failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    },
  });
};

// ============================================
// User Status Hooks
// ============================================

export const useSetUserOnline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setUserOnline,
    onSuccess: (data, variables) => {
      // Invalidate user status
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATION_USER_STATUS(variables.userId),
      });
      console.log(`User ${variables.userId} set to online, ${data.queuedNotificationsDelivered} queued notifications delivered`);
    },
    onError: (error: any) => {
      console.error("Set user online failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to set user online"
      );
    },
  });
};

export const useSetUserOffline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setUserOffline,
    onSuccess: (data, variables) => {
      // Invalidate user status
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATION_USER_STATUS(variables.userId),
      });
      console.log(`User ${variables.userId} set to offline`);
    },
    onError: (error: any) => {
      console.error("Set user offline failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to set user offline"
      );
    },
  });
};

export const usePauseUserNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pauseUserNotifications,
    onSuccess: (data, variables) => {
      // Invalidate user status
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATION_USER_STATUS(variables.userId),
      });
      console.log(`User ${variables.userId} notifications paused`);
    },
    onError: (error: any) => {
      console.error("Pause user notifications failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to pause notifications"
      );
    },
  });
};

export const useResumeUserNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resumeUserNotifications,
    onSuccess: (data, variables) => {
      // Invalidate user status
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATION_USER_STATUS(variables.userId),
      });
      console.log(`User ${variables.userId} notifications resumed, ${data.queuedNotificationsDelivered} queued notifications delivered`);
    },
    onError: (error: any) => {
      console.error("Resume user notifications failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to resume notifications"
      );
    },
  });
};

export const useUserNotificationStatus = (userId: string) => {
  return useQuery({
    queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATION_USER_STATUS(userId),
    queryFn: () => getUserStatus(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// ============================================
// Sync Notifications Hook
// ============================================

export const useSyncPushNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, lastSyncTimestamp }: { userId: string; lastSyncTimestamp?: string }) =>
      syncNotifications(userId, lastSyncTimestamp),
    onSuccess: (data, variables) => {
      // Invalidate push notifications list
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATIONS(variables.userId),
      });
      console.log(`Synced ${data.total} notifications for user ${variables.userId}`);
    },
    onError: (error: any) => {
      console.error("Sync notifications failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to sync notifications"
      );
    },
  });
};