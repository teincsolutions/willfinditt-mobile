import type { NotificationType } from "./enums";
import type { User } from "./user";

// Core Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: any; // JSON field
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  user?: User;
}
