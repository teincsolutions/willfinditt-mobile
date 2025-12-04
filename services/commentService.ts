import api from './api';
import { AdComment, CreateCommentRequest, PaginatedResponse } from '@/types';

export const commentService = {
  // Create a new comment on an ad
  createComment: async (data: CreateCommentRequest): Promise<AdComment> => {
    const response = await api.post<AdComment>('/api/v1/comments', data);
    return response.data;
  },

  // Get comments for a specific ad
  getCommentsForAd: async (adId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AdComment>> => {
    const response = await api.get<PaginatedResponse<AdComment>>(`/api/v1/comments/ads/${adId}`, { params });
    return response.data;
  },

  // Update a comment
  updateComment: async (commentId: string, data: {
    content: string;
  }): Promise<AdComment> => {
    const response = await api.patch<AdComment>(`/api/v1/comments/${commentId}`, data);
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/api/v1/comments/${commentId}`);
  },
};
