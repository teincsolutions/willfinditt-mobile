// ============================================
// Shared Query Keys for React Query
// ============================================

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
};
