import { fcmService } from "@/services/fcmService";
import {
    getDeviceNotificationsHistory,
    getNotificationsHistory,
    getUserNotificationStatus,
    logoutDevice,
    markDeviceNotificationAsRead,
    markDeviceNotificationsAsReadBulk,
    markNotificationAsRead,
    markNotificationsAsReadBulk,
    pauseUserNotifications,
    resumeUserNotifications,
    syncNotifications,
} from "@/services/pushNotificationService";
import { setPendingNotification } from "@/utils/notificationRouting";
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
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
        error.message ||
          error.response?.data?.message ||
          "Failed to register device"
      );
    },
  });
};

export const useLogoutDevice = () => {
  return useMutation({
    mutationFn: logoutDevice,
    onSuccess: (data) => {
      console.log("Device logged out:", data);
      toast.success("Device logged out successfully");
    },
    onError: (error: any) => {
      console.error("Device logout failed:", error);
      toast.error(error.response?.data?.message || "Failed to logout device");
    },
  });
};

// ============================================
// FCM Initialization Hook
// ============================================

export const useFCMInitialization = (userId?: string, onRegistered?: () => void) => {
  const hasInitialized = useRef(false);
  const previousUserId = useRef<string | undefined>(null);

  useEffect(() => {
    console.log("useFCMInitialization: Starting FCM initialization for userId:", userId);

    let unsubscribeOnMessage: (() => void) | undefined;
    let unsubscribeOnNotificationOpened: (() => void) | undefined;
    let unsubscribeOnTokenRefresh: (() => void) | undefined;

    const initializeFCM = async () => {
      try {
        console.log("useFCMInitialization: Starting FCM initialization");
        
        // Create notification channel early for Android
        if (Platform.OS === 'android') {
          const notifee = require('@notifee/react-native').default;
          const { AndroidImportance } = require('@notifee/react-native');
          await notifee.createChannel({
            id: 'default',
            name: 'Default Notifications',
            importance: AndroidImportance.HIGH,
            sound: 'default',
          });
          console.log("useFCMInitialization: Android notification channel created");
        }
        
        console.log("useFCMInitialization: Requesting permissions");
        // Request permissions
        const hasPermissions = await fcmService.hasPermissions();
        if (!hasPermissions) {
          const granted = await fcmService.requestPermissions();
          if (!granted) {
            console.log("useFCMInitialization: Notification permissions not granted");
            // Still register device even without permissions (for when user enables later)
            console.log("useFCMInitialization: Registering device without permissions");
          }
        }

        console.log("useFCMInitialization: Registering device with userId:", userId || "(no user - initial registration)");
        // Register device with FCM token (with or without userId)
        // This will register device immediately on app launch
        // When user logs in, this will be called again with userId to update the device
        await fcmService.registerDevice(userId);

        console.log("useFCMInitialization: Device registered, calling onRegistered callback");
        if (onRegistered) {
          onRegistered();
        }

        // Only set up message handlers once
        if (!hasInitialized.current) {
          console.log("useFCMInitialization: Setting up message handlers for the first time");
          hasInitialized.current = true;

          // Clear app badge when app becomes active
          await fcmService.clearBadge();

          // Set up message handlers
          unsubscribeOnMessage = await fcmService.onMessage();
          unsubscribeOnNotificationOpened =
            await fcmService.onNotificationOpenedApp();

          // Handle token refresh
          unsubscribeOnTokenRefresh = await fcmService.onTokenRefresh(
            async (token) => {
              console.log("useFCMInitialization: Token refreshed, re-registering device");
              await fcmService.registerDevice(userId);
            }
          );

          // Check for initial notification
          const initialNotification = await fcmService.getInitialNotification();
          if (initialNotification) {
            console.log("useFCMInitialization: Initial notification found, setting pending");
            // Set pending notification for routing after app is ready
            setPendingNotification(initialNotification as any);
          }
        }

        console.log("useFCMInitialization: FCM initialization completed");
      } catch (error) {
        console.error("useFCMInitialization: Error initializing FCM:", error);
      }
    };

    // Only run initialization if this is the first time or userId has changed
    if (!hasInitialized.current || previousUserId.current !== userId) {
      previousUserId.current = userId;
      initializeFCM();
    }

    // Cleanup function
    return () => {
      if (unsubscribeOnMessage) unsubscribeOnMessage();
      if (unsubscribeOnNotificationOpened) unsubscribeOnNotificationOpened();
      if (unsubscribeOnTokenRefresh) unsubscribeOnTokenRefresh();
    };
  }, [userId, onRegistered]);
};

// ============================================
// Notification History Hooks
// ============================================

export const usePushNotifications = (
  userId: string,
  params: { page?: number; limit?: number } = {}
) => {
  return useInfiniteQuery({
    queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATIONS(userId, params),
    queryFn: ({ pageParam = 1 }) =>
      getNotificationsHistory(userId, { ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const { meta } = lastPage;
      if (meta.hasNext) {
        return meta.page + 1;
      }
      return undefined;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useDevicePushNotifications = (
  deviceToken: string,
  params: { page?: number; limit?: number } = {}
) => {
  return useInfiniteQuery({
    queryKey: PUSH_NOTIFICATION_QUERY_KEYS.DEVICE_PUSH_NOTIFICATIONS(
      deviceToken,
      params
    ),
    queryFn: async ({ pageParam = 1 }) =>
      await getDeviceNotificationsHistory(deviceToken, {
        ...params,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const { meta } = lastPage;
      if (meta.hasNext) {
        return meta.page + 1;
      }
      return undefined;
    },
    enabled: !!deviceToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useMarkPushNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, targetId }: { userId: string; targetId: string }) =>
      markNotificationAsRead(userId, targetId),
    onSuccess: (data, variables) => {
      // Invalidate push notifications list
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATIONS(
          variables.userId
        ),
      });
      toast.success("Notification marked as read");
    },
    onError: (error: any) => {
      console.error("Mark notification read failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    },
  });
};

export const useMarkPushNotificationsReadBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      targetIds,
    }: {
      userId: string;
      targetIds: string[];
    }) => markNotificationsAsReadBulk(userId, targetIds),
    onSuccess: (
      data: { markedAsRead: number; targetIds: string[] },
      variables
    ) => {
      // Invalidate push notifications list
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATIONS(
          variables.userId
        ),
      });
      toast.success(`${data.markedAsRead} notifications marked as read`);
    },
    onError: (error: any) => {
      console.error("Bulk mark notifications read failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to mark notifications as read"
      );
    },
  });
};

export const useMarkDevicePushNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fcmToken,
      targetId,
    }: {
      fcmToken: string;
      targetId: string;
    }) => markDeviceNotificationAsRead(fcmToken, targetId),
    onSuccess: (data, variables) => {
      // Invalidate device push notifications list
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.DEVICE_PUSH_NOTIFICATIONS(
          variables.fcmToken
        ),
      });
      toast.success("Notification marked as read");
    },
    onError: (error: any) => {
      console.error("Mark device notification read failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    },
  });
};

export const useMarkDevicePushNotificationsReadBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fcmToken,
      targetIds,
    }: {
      fcmToken: string;
      targetIds: string[];
    }) => markDeviceNotificationsAsReadBulk(fcmToken, targetIds),
    onSuccess: (
      data: { markedAsRead: number; targetIds: string[] },
      variables
    ) => {
      // Invalidate device push notifications list
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.DEVICE_PUSH_NOTIFICATIONS(
          variables.fcmToken
        ),
      });
      toast.success(`${data.markedAsRead} notifications marked as read`);
    },
    onError: (error: any) => {
      console.error("Bulk mark device notifications read failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to mark notifications as read"
      );
    },
  });
};

// ============================================
// Combined Notification Hook
// ============================================

export const useNotificationsWithAutoMark = (
  userId?: string,
  deviceToken?: string,
  params: { page?: number; limit?: number } = {}
) => {
  const userQuery = usePushNotifications(userId || "", params);
  const deviceQuery = useDevicePushNotifications(deviceToken || "", params);

  return userId ? userQuery : deviceQuery;
};

// ============================================
// User Status Hooks
// ============================================

export const usePauseUserNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      durationMinutes,
    }: {
      userId: string;
      durationMinutes?: number;
    }) => pauseUserNotifications(userId, { durationMinutes }),
    onSuccess: (data: { pausedUntil: string }, variables) => {
      // Invalidate user status
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATION_USER_STATUS(
          variables.userId
        ),
      });
      console.log(
        `User ${variables.userId} notifications paused until ${data.pausedUntil}`
      );
      toast.success("Notifications paused successfully");
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
    mutationFn: ({ userId }: { userId: string }) =>
      resumeUserNotifications(userId),
    onSuccess: (data, variables) => {
      // Invalidate user status
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATION_USER_STATUS(
          variables.userId
        ),
      });
      console.log(`User ${variables.userId} notifications resumed`);
      toast.success("Notifications resumed successfully");
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
    queryKey:
      PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATION_USER_STATUS(userId),
    queryFn: () => getUserNotificationStatus(userId),
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
    mutationFn: ({
      userId,
      lastSyncTimestamp,
    }: {
      userId: string;
      lastSyncTimestamp?: string;
    }) => {
      console.log("useSyncPushNotifications: Starting sync for userId:", userId, "lastSyncTimestamp:", lastSyncTimestamp);
      return syncNotifications(userId, lastSyncTimestamp);
    },
    onSuccess: (data: { data: any[]; meta: any }, variables) => {
      // Invalidate push notifications list
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATIONS(
          variables.userId
        ),
      });
      console.log(
        `useSyncPushNotifications: Synced ${data.data.length} notifications for user ${variables.userId}`
      );
    },
    onError: (error: any) => {
      console.error("useSyncPushNotifications: Sync notifications failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to sync notifications"
      );
    },
  });
};
