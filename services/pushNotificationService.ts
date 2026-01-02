import axios from "axios";
import Constants from "expo-constants";

// ============================================
// One Night Notify API Service
// See docs/one-night-notify.md for complete API documentation
// ============================================

// Get secure API key from expo-constants (embedded at build time)
const getSecureApiKey = () => {
  const config = Constants.expoConfig?.extra || {};
  const apiKey = config.ONE_NIGHT_NOTIFY_API_KEY || "";

  console.log("Config one-night key: ", apiKey);
  return apiKey;
};

// Create axios instance for one-night-notify API
const oneNightNotifyApi = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_ONE_NIGHT_NOTIFY_URL || "https://api.example.com",
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

export interface DeviceLogoutRequest {
  fcmToken: string;
}

export interface DeviceLogoutResponse {
  id: string;
  userId?: string;
  platform: "ios" | "android";
  fcmToken: string;
  isActive: boolean;
  loggedOutAt: string;
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
  id: string; // targetId
  targetId: string;
  type: "personal" | "topic";
  title: string;
  body: string;
  data?: Record<string, any>;
  createdAt: string;
  read: boolean;
  deliveredAt?: string;
}

export interface NotificationsHistoryResponse {
  data: NotificationResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserStatusRequest {
  durationMinutes?: number; // For pause endpoint
}

export interface UserStatusResponse {
  userId: string;
  lastSeenAt: string;
  pausedUntil: string | null;
  isPaused: boolean;
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

export const logoutDevice = async (
  request: DeviceLogoutRequest
): Promise<DeviceLogoutResponse> => {
  const { data } = await oneNightNotifyApi.post<DeviceLogoutResponse>(
    "/v1/devices/logout",
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
  const { data } = await oneNightNotifyApi.post<{
    notificationId: string;
    fcmResponse: any;
  }>("/v1/notifications/topic", request);
  return data;
};

export const sendPersonalNotification = async (
  request: PersonalNotificationRequest
): Promise<{
  notificationId: string;
  fcmResponses: any[];
  queuedForUsers: string[];
  deliveredToUsers: string[];
}> => {
  const { data } = await oneNightNotifyApi.post<{
    notificationId: string;
    fcmResponses: any[];
    queuedForUsers: string[];
    deliveredToUsers: string[];
  }>("/v1/notifications/personal", request);
  return data;
};

export const getNotificationsHistory = async (
  userId: string,
  params: { page?: number; limit?: number } = {}
): Promise<NotificationsHistoryResponse> => {
  const { data } = await oneNightNotifyApi.get<NotificationsHistoryResponse>(
    `/v1/notifications/user/${userId}/history`,
    { params }
  );
  return data;
};

export const getNotificationById = async (
  targetId: string,
  userId?: string
): Promise<NotificationResponse> => {
  const params = userId ? { userId } : {};
  const { data } = await oneNightNotifyApi.get<NotificationResponse>(
    `/v1/notifications/${targetId}`,
    { params }
  );
  return data;
};

export const getDeviceNotificationsHistory = async (
  deviceToken: string,
  params: { page?: number; limit?: number } = {}
): Promise<NotificationsHistoryResponse> => {
  console.log(
    "Fetching device notifications history for token:",
    deviceToken,
    "with params:",
    params
  );
  const response = await oneNightNotifyApi.get<NotificationsHistoryResponse>(
    `/v1/notifications/device/token/${deviceToken}/history`,
    { params }
  );
  console.log("Received device notifications history response:", response.data);
  return response.data;
};

export const markNotificationAsRead = async (
  userId: string,
  targetId: string
): Promise<{
  id: string;
  notificationId: string;
  deviceId?: string;
  read: boolean;
  deliveredAt: string;
  createdAt: string;
  updatedAt: string;
}> => {
  const { data } = await oneNightNotifyApi.patch<{
    id: string;
    notificationId: string;
    deviceId?: string;
    read: boolean;
    deliveredAt: string;
    createdAt: string;
    updatedAt: string;
  }>(`/v1/notifications/user/${userId}/mark-read/${targetId}`);
  return data;
};

export const markNotificationsAsReadBulk = async (
  userId: string,
  targetIds: string[]
): Promise<{
  markedAsRead: number;
  targetIds: string[];
}> => {
  const { data } = await oneNightNotifyApi.patch<{
    markedAsRead: number;
    targetIds: string[];
  }>(`/v1/notifications/user/${userId}/mark-read`, { targetIds });
  return data;
};

export const markDeviceNotificationAsRead = async (
  fcmToken: string,
  targetId: string
): Promise<{
  id: string;
  notificationId: string;
  deviceId?: string;
  read: boolean;
  deliveredAt: string;
  createdAt: string;
  updatedAt: string;
}> => {
  const { data } = await oneNightNotifyApi.patch<{
    id: string;
    notificationId: string;
    deviceId?: string;
    read: boolean;
    deliveredAt: string;
    createdAt: string;
    updatedAt: string;
  }>(`/v1/notifications/device/token/${fcmToken}/mark-read/${targetId}`);
  return data;
};

export const markDeviceNotificationsAsReadBulk = async (
  fcmToken: string,
  targetIds: string[]
): Promise<{
  markedAsRead: number;
  targetIds: string[];
}> => {
  const { data } = await oneNightNotifyApi.patch<{
    markedAsRead: number;
    targetIds: string[];
  }>(`/v1/notifications/device/token/${fcmToken}/mark-read`, { targetIds });
  return data;
};

// ============================================
// User Status Management
// ============================================

export const pauseUserNotifications = async (
  userId: string,
  request: UserStatusRequest = {}
): Promise<{ pausedUntil: string }> => {
  const { data } = await oneNightNotifyApi.post<{ pausedUntil: string }>(
    `/v1/notifications/user/${userId}/status/pause`,
    request
  );
  return data;
};

export const resumeUserNotifications = async (
  userId: string
): Promise<{ success: boolean }> => {
  const { data } = await oneNightNotifyApi.post<{ success: boolean }>(
    `/v1/notifications/user/${userId}/status/resume`
  );
  return data;
};

export const getUserNotificationStatus = async (
  userId: string
): Promise<UserStatusResponse> => {
  const { data } = await oneNightNotifyApi.get<UserStatusResponse>(
    `/v1/notifications/user/${userId}/status`
  );
  return data;
};

// ============================================
// Sync Notifications (for resuming app)
// ============================================

export const syncNotifications = async (
  userId: string,
  lastSyncTimestamp?: string
): Promise<NotificationsHistoryResponse> => {
  const { data } = await oneNightNotifyApi.post<NotificationsHistoryResponse>(
    "/v1/notifications/sync",
    {
      userId,
      lastSyncTimestamp,
    }
  );
  return data;
};

// ============================================
// Service Object (for compatibility)
// ============================================

export const pushNotificationService = {
  registerDevice,
  refreshDeviceToken,
  logoutDevice,
  sendTopicNotification,
  sendPersonalNotification,
  getNotificationsHistory,
  getDeviceNotificationsHistory,
  getNotificationById,
  markNotificationAsRead,
  markNotificationsAsReadBulk,
  markDeviceNotificationAsRead,
  markDeviceNotificationsAsReadBulk,
  pauseUserNotifications,
  resumeUserNotifications,
  getUserNotificationStatus,
  syncNotifications,
};
