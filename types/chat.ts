import type { MessageStatus, MessageType } from "./enums";

// Core Chat Types
export interface Chat {
  id: string;
  senderId: string;
  receiverId: string;
  adId?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  receiver: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  unreadCount?: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content?: string;
  isRead: boolean;
  readAt: string | null;
  attachments?: {
    url: string;
    mime: string;
    width?: number;
    height?: number;
  }[];
  type: MessageType;
  sender: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  createdAt: string;
  status?: MessageStatus;
  _tmpId?: string; // local only for optimistic UI
}

// Request Types
export interface CreateChatRequest {
  participantId: string;
  adId?: string;
  initialMessage?: string;
}

export interface SendMessageRequest {
  content: string;
  type?: MessageType;
  attachments?: string[];
}
