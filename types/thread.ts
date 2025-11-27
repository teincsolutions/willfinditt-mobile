import type { ThreadPriority, ThreadStatus, ThreadType } from "./enums";
import type { User } from "./user";

// Core Thread Types
export interface Thread {
  id: string;
  userId: string;
  title: string;
  type: ThreadType;
  status: ThreadStatus;
  priority: ThreadPriority;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface ThreadMessage {
  id: string;
  threadId: string;
  userId: string;
  content: string;
  isSystem: boolean;
  createdAt: string;
  user?: User;
}

// Request Types
export interface CreateThreadRequest {
  userId: string;
  title: string;
  type: ThreadType;
  priority?: ThreadPriority;
}

export interface UpdateThreadRequest {
  title?: string;
  type?: ThreadType;
  priority?: ThreadPriority;
  status?: ThreadStatus;
}

export interface CreateThreadMessageRequest {
  content: string;
  isSystem?: boolean;
}

export interface UpdateThreadMessageRequest {
  content?: string;
  isSystem?: boolean;
}

export interface ThreadQueryParams {
  userId?: string;
  type?: ThreadType;
  status?: ThreadStatus;
  priority?: ThreadPriority;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
