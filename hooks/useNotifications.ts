import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationById,
} from "@/services/notificationService";
import { NotificationType } from "@/types";
import { useAppToast } from "./useToast";

interface UseNotificationsParams {
  page?: number;
  limit?: number;
  q?: string; // Search query parameter
  isRead?: boolean;
  type?: NotificationType | string;
}

// Hook to get user's notifications
export const useNotifications = (params: UseNotificationsParams = {}) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getMyNotifications(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get unread count
export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
};

// Hook to get a single notification
export const useNotification = (id: string) => {
  return useQuery({
    queryKey: ["notifications", id],
    queryFn: () => getNotificationById(id),
    enabled: !!id,
  });
};

// Hook to mark notification as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidate notifications list and unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
    onError: (error: any) => {
      toast.showError(
        "Error",
        error.response?.data?.message || "Failed to mark notification as read"
      );
    },
  });
};

// Hook to mark all notifications as read
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: (data) => {
      // Invalidate notifications list and unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });

      toast.showSuccess(
        "Success",
        `Marked ${data.data?.updated || "all"} notifications as read`
      );
    },
    onError: (error: any) => {
      toast.showError(
        "Error",
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    },
  });
};

// Hook to delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      // Invalidate notifications list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      toast.showSuccess("Success", "Notification deleted");
    },
    onError: (error: any) => {
      toast.showError(
        "Error",
        error.response?.data?.message || "Failed to delete notification"
      );
    },
  });
};

// Refresh notification list
export const useRefreshNotifications = () => {
  const queryClient = useQueryClient();

  const refreshNotifications = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({
      queryKey: ["notifications", "unread-count"],
    });
  };

  return refreshNotifications;
};
