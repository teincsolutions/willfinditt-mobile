import { Chat, Message, PaginatedResponse } from "@/types";
import api from "./api";

interface CreateChatRequest {
  receiverId: string;
  adId?: string;
}

interface SendMessageRequest {
  receiverId: string;
  content?: string;
  type?: "TEXT" | "IMAGE" | "FILE" | "LOCATION" | "SYSTEM";
  attachments?: string[];
}

export const chatsSerivce = {
  // List my chats
  listMyChats: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    adId?: string;
  }): Promise<PaginatedResponse<Chat>> => {
    const response = await api.get<PaginatedResponse<Chat>>("/api/v1/chat", {
      params,
    });
    return response.data;
  },

  // Get a single chat
  getChat: async (chatId: string): Promise<Chat> => {
    const response = await api.get<Chat>(`/api/v1/chat/${chatId}`);
    return response.data;
  },

  // Create chat
  createChat: async (data: CreateChatRequest): Promise<Chat> => {
    const response = await api.post<Chat>("/api/v1/chat", data);
    return response.data;
  },

  // Ensure chat for ad - custom logic to find or create chat for ad
  ensureChatForAd: async (adId: string): Promise<Chat> => {
    // First, list chats to find existing one for this ad
    const response = await api.get<PaginatedResponse<Chat>>("/api/v1/chat", {
      params: { adId },
    });
    const chats = response.data.data;
    if (chats.length > 0) {
      return chats[0];
    }
    // Get ad to find seller
    const adResponse = await api.get<{ userId: string }>(`/api/v1/ads/${adId}`);
    const sellerId = adResponse.data.userId;

    // Create new chat using correct API format
    return await chatsSerivce.createChat({
      receiverId: sellerId,
      adId,
    });
  },

  // Mark chat read
  markChatRead: async (chatId: string): Promise<{ message: string }> => {
    const response = await api.patch<{ message: string }>(
      `/api/v1/chat/${chatId}/read`
    );
    return response.data;
  },

  // Delete chat
  deleteChat: async (chatId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/api/v1/chat/${chatId}`
    );
    return response.data;
  },

  // Get chat stats for current user
  getStats: async (): Promise<{
    totalChats: number;
    activeChats: number;
    unreadMessages: number;
  }> => {
    const response = await api.get<{
      totalChats: number;
      activeChats: number;
      unreadMessages: number;
    }>(`/api/v1/chat/stats`);
    return response.data;
  },
};

export const messagesSerivce = {
  // List messages for chat
  listMessages: async (
    chatId: string,
    params?: {
      page?: number;
      limit?: number;
      type?: "TEXT" | "IMAGE" | "FILE" | "LOCATION" | "SYSTEM";
      search?: string;
    }
  ) => {
    const response = await api.get<PaginatedResponse<Message>>(
      `/api/v1/chat/${chatId}/messages`,
      { params }
    );
    return response.data;
  },

  // Send message
  sendMessage: async (
    chatId: string,
    data: SendMessageRequest
  ): Promise<Message> => {
    const response = await api.post<Message>(
      `/api/v1/chat/${chatId}/messages`,
      data
    );
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/api/v1/chat/messages/${messageId}`
    );
    return response.data;
  },
};
