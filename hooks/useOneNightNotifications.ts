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
import { handleNotificationRouting } from "@/utils/notificationRouting";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
            console.log("Notification permissions not granted");
            return;
          }
        }

        // Register device with FCM token
        await fcmService.registerDevice(userId);

        // Set up message handlers
        unsubscribeOnMessage = await fcmService.onMessage();
        unsubscribeOnNotificationOpened =
          await fcmService.onNotificationOpenedApp();

        // Handle token refresh
        unsubscribeOnTokenRefresh = await fcmService.onTokenRefresh(
          async (token) => {
            console.log("Token refreshed, re-registering device");
            await fcmService.registerDevice(userId);
          }
        );

        // Check for initial notification
        const initialNotification = await fcmService.getInitialNotification();
        if (initialNotification) {
          // Handle initial notification routing after a short delay to ensure app is ready
          setTimeout(() => {
            handleNotificationRouting(initialNotification as any);
          }, 1000);
        }
      } catch (error) {
        console.error("Error initializing FCM:", error);
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
  const notificationsQuery = userId
    ? usePushNotifications(userId, params)
    : useDevicePushNotifications(deviceToken || "", params);

  return notificationsQuery;
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
    }) => syncNotifications(userId, lastSyncTimestamp),
    onSuccess: (data: { data: any[]; meta: any }, variables) => {
      // Invalidate push notifications list
      queryClient.invalidateQueries({
        queryKey: PUSH_NOTIFICATION_QUERY_KEYS.PUSH_NOTIFICATIONS(
          variables.userId
        ),
      });
      console.log(
        `Synced ${data.data.length} notifications for user ${variables.userId}`
      );
    },
    onError: (error: any) => {
      console.error("Sync notifications failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to sync notifications"
      );
    },
  });
};
