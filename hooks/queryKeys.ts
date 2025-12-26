// ============================================
// Shared Query Keys for React Query
// ============================================

import { AdSearchParams, AdSearchRequest, AdSearchSuggestionsParams } from "@/types/ad";

export const AUTH_QUERY_KEYS = {
  AUTH_USER: ["auth", "user"] as const,
  AUTH: ["auth"] as const,
  SESSIONS: ["auth", "sessions"] as const,
};

export const SELLER_QUERY_KEYS = {
  SELLER_MY_PROFILE: ["seller", "my-profile"] as const,
  SELLER_PROFILE: (sellerId: string) => ["seller", sellerId] as const,
  SELLER_STATS: (sellerId: string) => ["seller", sellerId, "stats"] as const,
  SELLER_MY_STATS: ["seller", "my-stats"] as const,
  SELLER_REVIEWS: (sellerId: string) =>
    ["seller", sellerId, "reviews"] as const,
  SELLER_MY_REVIEWS: ["seller", "my-reviews"] as const,
};

export const AD_QUERY_KEYS = {
  AD: (adId?: string) => ["ad", adId || ""] as const,
  AD_SAVED: (adId: string) => ["ad", adId, "saved"] as const,
  ADS_SAVED_INFINITE: (params?: any) => ["saved-ads-infinite", params || {}] as const,
  ADS_INFINITE: (params?: AdSearchParams) => ["ads-infinite", params] as const,
  ADS_SEARCH_INFINITE: (params?: AdSearchRequest) =>
    ["ads-search-infinite", params || {}] as const,
  ADS_SEARCH_SUGGESTIONS: (params?: AdSearchSuggestionsParams) =>
    ["ads", "search-suggestions", params || {}] as const,
  MY_ADS: (params?: any) => ["my-ads", params || {}] as const,
  ADS_FEATURED: ["ads-featured"] as const,
};

export const CHAT_QUERY_KEYS = {
  CHAT: (chatId: string) => ["chat", chatId] as const,
  CHATS: "chats" as const,
};

export const MESSAGE_QUERY_KEYS = {
  MESSAGES: (chatId: string) => ["chat", chatId, "messages"] as const,
};
