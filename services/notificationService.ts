import api from "./api";
import {
  Notification,
  PaginatedResponse,
  ApiResponse,
  NotificationType,
} from "@/types";

interface GetNotificationsParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType | string;
}

interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
}

// Get user's notifications
export const getMyNotifications = async (
  params: GetNotificationsParams = {}
): Promise<PaginatedResponse<Notification>> => {
  const { data } = await api.get<PaginatedResponse<Notification>>(
    "/api/v1/notifications/my-notifications",
    { params }
  );
  return data;
};

// Get unread notifications count
export const getUnreadCount = async (): Promise<{ count: number }> => {
  const { data } = await api.get("/api/v1/notifications/unread-count");
  return data;
};

// Get notification by ID
export const getNotificationById = async (
  id: string
): Promise<Notification> => {
  const { data } = await api.get(`/api/v1/notifications/${id}`);
  return data;
};

// Mark notification as read
export const markNotificationAsRead = async (
  id: string
): Promise<ApiResponse<Notification>> => {
  const { data } = await api.patch(`/api/v1/notifications/${id}/mark-read`);
  return data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<
  ApiResponse<{ updated: number }>
> => {
  const { data } = await api.patch("/api/v1/notifications/mark-all-read");
  return data;
};

// Delete notification
export const deleteNotification = async (
  id: string
): Promise<ApiResponse<void>> => {
  const { data } = await api.delete(`/api/v1/notifications/${id}`);
  return data;
};

// Register push notification token according to API spec
export const registerPushToken = async (
  userId: string,
  token: string,
  platform: "ios" | "android" | "web"
): Promise<ApiResponse<any>> => {
  const { data } = await api.post("/api/v1/notifications/push-tokens", {
    userId,
    token,
    platform,
  });
  return data;
};

// Get user's push tokens
export const getMyPushTokens = async (): Promise<any[]> => {
  const { data } = await api.get("/api/v1/notifications/push-tokens/my-tokens");
  return data;
};

// Update push token (deactivate)
export const updatePushToken = async (
  tokenId: string,
  isActive: boolean
): Promise<ApiResponse<any>> => {
  const { data } = await api.patch(
    `/api/v1/notifications/push-tokens/${tokenId}`,
    {
      isActive,
    }
  );
  return data;
};

// Delete push token
export const deletePushToken = async (
  tokenId: string
): Promise<ApiResponse<any>> => {
  const { data } = await api.delete(
    `/api/v1/notifications/push-tokens/${tokenId}`
  );
  return data;
};
