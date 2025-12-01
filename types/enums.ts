export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
}

export enum AdCondition {
  NEW = "NEW",
  LIKE_NEW = "LIKE_NEW",
  USED = "USED",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
}

export enum AdStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  SOLD = "SOLD",
  EXPIRED = "EXPIRED",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export enum CategoryFieldType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  SELECT = "SELECT",
  RADIO = "RADIO",
  CHECKBOX = "CHECKBOX",
  TEXTAREA = "TEXTAREA",
  DATE = "DATE",
  BOOLEAN = "BOOLEAN",
}

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  LOCATION = "LOCATION",
  SYSTEM = "SYSTEM",
}

export enum InteractionType {
  VIEW = "VIEW",
  CLICK = "CLICK",
  CONTACT_REVEAL = "CONTACT_REVEAL",
  PHONE_CLICK = "PHONE_CLICK",
  EMAIL_CLICK = "EMAIL_CLICK",
  SHARE = "SHARE",
}

export enum NotificationType {
  AD_INTERACTION = "AD_INTERACTION",
  CHAT_MESSAGE = "CHAT_MESSAGE",
  PROMOTION = "PROMOTION",
  SYSTEM = "SYSTEM",
  SELLER_REVIEW = "SELLER_REVIEW",
  AD_COMMENT = "AD_COMMENT",
}

export enum ThreadType {
  SUPPORT = "SUPPORT",
  NOTIFICATION = "NOTIFICATION",
  SYSTEM = "SYSTEM",
}

export enum ThreadStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  PENDING = "PENDING",
}

export enum ThreadPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum DocumentType {
  NATIONAL_ID = "NATIONAL_ID",
  DRIVERS_LICENSE = "DRIVERS_LICENSE",
  PASSPORT = "PASSPORT",
}

export const BusinessTypes = {
  SOLE_PROPRIETORSHIP: 'Sole Proprietorship',
  PARTNERSHIP: 'Partnership',
  COMPANY_LIMITED_BY_SHARES: 'Company Limited by Shares',
  COMPANY_LIMITED_BY_GUARANTEE: 'Company Limited by Guarantee',
  EXTERNAL_COMPANY: 'External Company',
  UNREGISTERED: 'Unregistered'
};


export type BusinessType = typeof BusinessTypes[keyof typeof BusinessTypes];

export enum VerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export enum MessageStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}
