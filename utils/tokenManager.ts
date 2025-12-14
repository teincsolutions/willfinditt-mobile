import { mmkvStorage } from "./mmkvStorage";

/**
 * Token Storage Keys
 */
const TOKEN_KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
  TOKEN_EXPIRY: "auth_token_expiry",
  USER_ID: "auth_user_id",
} as const;

/**
 * Decode JWT token payload without verification
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
function decodeJWT(token: string): any {
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT format");
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Base64 URL decode - replace URL-safe chars and pad if needed
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }

    // Decode base64
    const jsonPayload = atob(base64);

    // Parse JSON
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Store access token and extract expiration
 */
export const setAccessToken = (token: string): void => {
  mmkvStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);

  // Decode JWT to extract expiration time
  const payload = decodeJWT(token);
  if (payload?.exp) {
    mmkvStorage.setNumber(TOKEN_KEYS.TOKEN_EXPIRY, payload.exp * 1000);
  }
};

/**
 * Get access token
 */
export const getAccessToken = (): string | null => {
  return mmkvStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN) || null;
};

/**
 * Store refresh token
 */
export const setRefreshToken = (token: string): void => {
  mmkvStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
};

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | null => {
  return mmkvStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN) || null;
};

/**
 * Store both tokens and extract user ID
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);

  // Extract and store user ID from JWT
  const payload = decodeJWT(accessToken);
  if (payload) {
    const userId =
      payload.sub ||
      payload.userId ||
      payload.id ||
      payload.user_id ||
      payload.uid;
    if (userId) {
      mmkvStorage.setItem(TOKEN_KEYS.USER_ID, String(userId));
    }
  }
};

/**
 * Get user ID
 */
export const getUserId = (): string | null => {
  return mmkvStorage.getItem(TOKEN_KEYS.USER_ID) || null;
};

/**
 * Get token expiration timestamp
 */
export const getTokenExpiry = (): number | null => {
  return mmkvStorage.getNumber(TOKEN_KEYS.TOKEN_EXPIRY) || null;
};

/**
 * Check if token is expired (with 5 min buffer)
 */
export const isTokenExpired = (): boolean => {
  const expiryTime = getTokenExpiry();
  if (!expiryTime) return true;

  const bufferTime = 5 * 60 * 1000; // 5 minutes
  return Date.now() >= expiryTime - bufferTime;
};

/**
 * Get authorization header
 */
export const getAuthHeader = (): string | null => {
  const token = getAccessToken();
  return token ? `Bearer ${token}` : null;
};

/**
 * Clear all tokens
 */
export const clearTokens = (): void => {
  mmkvStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  mmkvStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  mmkvStorage.removeItem(TOKEN_KEYS.TOKEN_EXPIRY);
  mmkvStorage.removeItem(TOKEN_KEYS.USER_ID);
};
