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
 * Token Manager
 * Handles secure storage and retrieval of authentication tokens using MMKV
 * Based on WillFind8 API authentication requirements
 */
class TokenManager {
  /**
   * Store access token
   * @param token - JWT access token from login/refresh response
   */
  async setToken(token: string): Promise<void> {
    try {
      mmkvStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
      
      // Store timestamp for token expiry tracking (tokens typically valid for 1 hour)
      const expiryTime = Date.now() + (60 * 60 * 1000); // 1 hour from now
      mmkvStorage.setNumber(TOKEN_KEYS.TOKEN_EXPIRY, expiryTime);
    } catch (error) {
      console.error("Error storing access token:", error);
      throw error;
    }
  }

  /**
   * Retrieve access token
   * @returns Access token or null if not found
   */
  async getToken(): Promise<string | null> {
    try {
      const token = mmkvStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
      return token || null;
    } catch (error) {
      console.error("Error retrieving access token:", error);
      return null;
    }
  }

  /**
   * Store refresh token
   * @param token - JWT refresh token from login response
   */
  async setRefreshToken(token: string): Promise<void> {
    try {
      mmkvStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error("Error storing refresh token:", error);
      throw error;
    }
  }

  /**
   * Retrieve refresh token
   * @returns Refresh token or null if not found
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      const token = mmkvStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
      return token || null;
    } catch (error) {
      console.error("Error retrieving refresh token:", error);
      return null;
    }
  }

  /**
   * Store both access and refresh tokens
   * Typically called after successful login or token refresh
   * @param accessToken - JWT access token
   * @param refreshToken - JWT refresh token
   */
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await this.setToken(accessToken);
      await this.setRefreshToken(refreshToken);
    } catch (error) {
      console.error("Error storing tokens:", error);
      throw error;
    }
  }

  /**
   * Store user ID
   * @param userId - User ID from authentication response
   */
  async setUserId(userId: string): Promise<void> {
    try {
      mmkvStorage.setItem(TOKEN_KEYS.USER_ID, userId);
    } catch (error) {
      console.error("Error storing user ID:", error);
      throw error;
    }
  }

  /**
   * Retrieve user ID
   * @returns User ID or null if not found
   */
  async getUserId(): Promise<string | null> {
    try {
      const userId = mmkvStorage.getItem(TOKEN_KEYS.USER_ID);
      return userId || null;
    } catch (error) {
      console.error("Error retrieving user ID:", error);
      return null;
    }
  }

  /**
   * Check if access token is expired
   * @returns true if token is expired or expiry not set
   */
  isTokenExpired(): boolean {
    try {
      const expiryTime = mmkvStorage.getNumber(TOKEN_KEYS.TOKEN_EXPIRY);
      if (!expiryTime) return true;
      
      // Add 5 minute buffer before actual expiry
      const bufferTime = 5 * 60 * 1000; // 5 minutes
      return Date.now() >= (expiryTime - bufferTime);
    } catch (error) {
      console.error("Error checking token expiry:", error);
      return true;
    }
  }

  /**
   * Check if user is authenticated
   * @returns true if access token exists and is not expired
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token && !this.isTokenExpired();
    } catch (error) {
      console.error("Error checking authentication status:", error);
      return false;
    }
  }

  /**
   * Clear access token only
   */
  async clearToken(): Promise<void> {
    try {
      mmkvStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      mmkvStorage.removeItem(TOKEN_KEYS.TOKEN_EXPIRY);
    } catch (error) {
      console.error("Error clearing access token:", error);
      throw error;
    }
  }

  /**
   * Clear all authentication tokens and user data
   * Typically called on logout
   */
  async clearAllTokens(): Promise<void> {
    try {
      mmkvStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      mmkvStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      mmkvStorage.removeItem(TOKEN_KEYS.TOKEN_EXPIRY);
      mmkvStorage.removeItem(TOKEN_KEYS.USER_ID);
    } catch (error) {
      console.error("Error clearing all tokens:", error);
      throw error;
    }
  }

  /**
   * Get authorization header value
   * @returns Bearer token string or null
   */
  async getAuthorizationHeader(): Promise<string | null> {
    try {
      const token = await this.getToken();
      return token ? `Bearer ${token}` : null;
    } catch (error) {
      console.error("Error getting authorization header:", error);
      return null;
    }
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();
