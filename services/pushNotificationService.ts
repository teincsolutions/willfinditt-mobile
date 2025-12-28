import axios from "axios";
import Constants from "expo-constants";

// ============================================
// One Night Notify API Service
// ============================================

// Get secure API key from expo-constants (embedded at build time)
const getSecureApiKey = () => {
  const config = Constants.expoConfig?.extra || {};
  return config.ONE_NIGHT_NOTIFY_API_KEY || "";
};

// Create axios instance for one-night-notify API
const oneNightNotifyApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ONE_NIGHT_NOTIFY_URL || "https://api.example.com",
  headers: {
    "X-API-Key": getSecureApiKey(),
    "Content-Type": "application/json",
  },
});

// ============================================
// Types
// ============================================

export interface DeviceRegistrationRequest {
  platform: "ios" | "android";
  fcmToken: string;
  userId?: string;
  meta?: {
    model?: string;
    version?: string;
    appVersion?: string;
  };
}

export interface DeviceRegistrationResponse {
  id: string;
  userId?: string;
  platform: "ios" | "android";
  fcmToken: string;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface TokenRefreshRequest {
  oldToken: string;
  newToken: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  image?: string;
  clickAction?: string;
}

export interface TopicNotificationRequest {
  topic: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  image?: string;
  clickAction?: string;
}

export interface PersonalNotificationRequest {
  userIds: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  image?: string;
  clickAction?: string;
}

export interface NotificationResponse {
  id: string;
  targetId: string;
  type: "personal" | "topic";
  title: string;
  body: string;
  data?: Record<string, any>;
  createdAt: string;
  read: boolean;
  deliveredAt?: string;
}

export interface NotificationsResponse {
  data: NotificationResponse[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface UserStatusRequest {
  userId: string;
}

export interface UserStatusResponse {
  userId: string;
  status: "online" | "offline" | "paused";
  lastStatusChange: string;
  queuedNotificationsCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ============================================
// Device Management
// ============================================

export const registerDevice = async (
  request: DeviceRegistrationRequest
): Promise<DeviceRegistrationResponse> => {
  const { data } = await oneNightNotifyApi.post<DeviceRegistrationResponse>(
    "/v1/devices/register",
    request
  );
  return data;
};

export const refreshDeviceToken = async (
  request: TokenRefreshRequest
): Promise<DeviceRegistrationResponse> => {
  const { data } = await oneNightNotifyApi.put<DeviceRegistrationResponse>(
    "/v1/devices/tokens/refresh",
    request
  );
  return data;
};

// ============================================
// Notification Management
// ============================================

export const sendTopicNotification = async (
  request: TopicNotificationRequest
): Promise<{ notificationId: string; fcmResponse: any }> => {
  const { data } = await oneNightNotifyApi.post<{ notificationId: string; fcmResponse: any }>(
    "/v1/notifications/topic",
    request
  );
  return data;
};

export const sendPersonalNotification = async (
  request: PersonalNotificationRequest
): Promise<{ notificationId: string; fcmResponses: any[]; queuedForUsers: string[]; deliveredToUsers: string[] }> => {
  const { data } = await oneNightNotifyApi.post<{
    notificationId: string;
    fcmResponses: any[];
    queuedForUsers: string[];
    deliveredToUsers: string[];
  }>("/v1/notifications/personal", request);
  return data;
};

export const getNotifications = async (
  userId: string,
  params: { limit?: number; offset?: number } = {}
): Promise<NotificationsResponse> => {
  const { data } = await oneNightNotifyApi.get<NotificationsResponse>("/v1/notifications", {
    params: { userId, ...params },
  });
  return data;
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
): Promise<{ id: string; notificationId: string; userId: string; read: boolean; deliveredAt: string }> => {
  const { data } = await oneNightNotifyApi.patch<{
    id: string;
    notificationId: string;
    userId: string;
    read: boolean;
    deliveredAt: string;
  }>(`/v1/notifications/${notificationId}/mark-read`, { userId });
  return data;
};

// ============================================
// User Status Management
// ============================================

export const setUserOnline = async (
  request: UserStatusRequest
): Promise<UserStatusResponse & { queuedNotificationsDelivered: number }> => {
  const { data } = await oneNightNotifyApi.post<UserStatusResponse & { queuedNotificationsDelivered: number }>(
    "/v1/notifications/user-status/online",
    request
  );
  return data;
};

export const setUserOffline = async (
  request: UserStatusRequest
): Promise<UserStatusResponse> => {
  const { data } = await oneNightNotifyApi.post<UserStatusResponse>(
    "/v1/notifications/user-status/offline",
    request
  );
  return data;
};

export const pauseUserNotifications = async (
  request: UserStatusRequest
): Promise<UserStatusResponse> => {
  const { data } = await oneNightNotifyApi.post<UserStatusResponse>(
    "/v1/notifications/user-status/pause",
    request
  );
  return data;
};

export const resumeUserNotifications = async (
  request: UserStatusRequest
): Promise<UserStatusResponse & { queuedNotificationsDelivered: number }> => {
  const { data } = await oneNightNotifyApi.post<UserStatusResponse & { queuedNotificationsDelivered: number }>(
    "/v1/notifications/user-status/resume",
    request
  );
  return data;
};

export const getUserStatus = async (
  userId: string
): Promise<UserStatusResponse> => {
  const { data } = await oneNightNotifyApi.get<UserStatusResponse>(
    `/v1/notifications/user-status/${userId}`
  );
  return data;
};

// ============================================
// Sync Notifications (for resuming app)
// ============================================

export const syncNotifications = async (
  userId: string,
  lastSyncTimestamp?: string
): Promise<NotificationsResponse> => {
  const { data } = await oneNightNotifyApi.post<NotificationsResponse>("/v1/notifications/sync", {
    userId,
    lastSyncTimestamp,
  });
  return data;
};

// ============================================
// Service Object (for compatibility)
// ============================================

export const pushNotificationService = {
  registerDevice,
  refreshDeviceToken,
  sendTopicNotification,
  sendPersonalNotification,
  getNotifications,
  markNotificationAsRead,
  setUserOnline,
  setUserOffline,
  pauseUserNotifications,
  resumeUserNotifications,
  syncNotifications,
};