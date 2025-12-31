
import { mmkvStorage } from "./mmkvStorage";

/**
 * Token Storage Keys
 */
export const TOKEN_KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
    IS_AUTHENTICATED: "auth_is_authenticated",
} as const;

/**
 * Store access token and extract expiration
 */
export const setAccessToken = (token: string): void => {
  mmkvStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
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
   mmkvStorage.removeItem(TOKEN_KEYS.IS_AUTHENTICATED);
};
