import { ReportCategory } from "@/types/enums";
import api from "./api";

export interface CreateReportRequest {
  category: ReportCategory;
  description?: string;
}

export interface BlockUserRequest {
  reason?: string;
}

export const moderationService = {
  // Report an ad
  reportAd: async (adId: string, data: CreateReportRequest) => {
    const response = await api.post(
      `/api/v1/content-reports/ads/${adId}`,
      data,
    );
    return response.data;
  },

  // Report a comment
  reportComment: async (commentId: string, data: CreateReportRequest) => {
    const response = await api.post(
      `/api/v1/content-reports/comments/${commentId}`,
      data,
    );
    return response.data;
  },

  // Report a chat message
  reportChatMessage: async (messageId: string, data: CreateReportRequest) => {
    const response = await api.post(
      `/api/v1/content-reports/chat-messages/${messageId}`,
      data,
    );
    return response.data;
  },

  // Report a seller review
  reportReview: async (reviewId: string, data: CreateReportRequest) => {
    const response = await api.post(
      `/api/v1/content-reports/reviews/${reviewId}`,
      data,
    );
    return response.data;
  },

  // Block a user
  blockUser: async (userId: string, data?: BlockUserRequest) => {
    const response = await api.post(
      `/api/v1/blocking/users/${userId}/block`,
      data || {},
    );
    return response.data;
  },

  // Unblock a user
  unblockUser: async (userId: string) => {
    const response = await api.delete(`/api/v1/blocking/users/${userId}/block`);
    return response.data;
  },

  // Get blocked users
  getBlockedUsers: async () => {
    const response = await api.get("/api/v1/blocking/blocked-users");
    return response.data;
  },

  // Check if user is blocked
  checkIfIsBlocked: async (userId: string) => {
    const response = await api.get(
      `/api/v1/blocking/users/${userId}/is-blocked`,
    );
    return response.data;
  },
};
