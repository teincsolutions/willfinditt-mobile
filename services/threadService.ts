import {
  CreateThreadMessageRequest,
  CreateThreadRequest,
  Thread,
  ThreadMessage,
  ThreadQueryParams,
  UpdateThreadMessageRequest,
  UpdateThreadRequest,
} from "@/types";
import api from "./api";

export const threadService = {
  // Create a new thread
  createThread: async (data: CreateThreadRequest): Promise<Thread> => {
    const response = await api.post<Thread>("/api/v1/threads", data);
    return response.data;
  },

  // Get current user's threads
  getMyThreads: async (
    params?: Omit<ThreadQueryParams, "userId">
  ): Promise<Thread[]> => {
    const response = await api.get<Thread[]>("/api/v1/threads/my-threads", {
      params,
    });
    return response.data;
  },

  // Get single thread by ID
  getThreadById: async (id: string): Promise<Thread> => {
    const response = await api.get<Thread>(`/api/v1/threads/${id}`);
    return response.data;
  },

  // Update a thread
  updateThread: async (
    id: string,
    data: UpdateThreadRequest
  ): Promise<Thread> => {
    const response = await api.patch<Thread>(`/api/v1/threads/${id}`, data);
    return response.data;
  },

  // Add message to thread
  addMessageToThread: async (
    threadId: string,
    data: CreateThreadMessageRequest
  ): Promise<ThreadMessage> => {
    const response = await api.post<ThreadMessage>(
      `/api/v1/threads/${threadId}/messages`,
      data
    );
    return response.data;
  },

  // Get thread messages
  getThreadMessages: async (threadId: string): Promise<ThreadMessage[]> => {
    const response = await api.get<ThreadMessage[]>(
      `/api/v1/threads/${threadId}/messages`
    );
    return response.data;
  },

  // Update thread message
  updateThreadMessage: async (
    messageId: string,
    data: UpdateThreadMessageRequest
  ): Promise<ThreadMessage> => {
    const response = await api.patch<ThreadMessage>(
      `/api/v1/threads/messages/${messageId}`,
      data
    );
    return response.data;
  },
};
