import { emitLogout } from "@/utils/eventEmitter";
import * as tokenManager from "@/utils/tokenManager";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// ============================================
// API Error Code Constants
// ============================================
export const API_ERROR_CODES = {
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INVALID_TOKEN: "INVALID_TOKEN",
  INVALID_USER: "INVALID_USER",
  FORBIDDEN: "FORBIDDEN",
  UNAUTHORIZED: "UNAUTHORIZED",
} as const;

// ============================================
// Error Response Interface
// ============================================
interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  code: string;
}

// ============================================
// Create axios instance
// ============================================
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    "X-Api-Key": process.env.APP_API_KEY || "",
  },
});

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from tokenManager (synchronous)
    const authToken = tokenManager.getAccessToken();

    console.log("Attaching auth token to request:", {
      url: config.url,
      hasToken: !!authToken,
    });
    // Add token to headers if it exists
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// Helper: Clear auth state and emit logout event
// ============================================
const clearAuthState = () => {
  tokenManager.clearTokens();
  // Note: Full auth state cleanup will be handled by useAuth hook
  // listening to the logout event
  console.log("Auth tokens cleared");
};

// ============================================
// Helper: Get error code from response
// ============================================
const getErrorCode = (error: AxiosError): string | null => {
  const errorData = error.response?.data as ApiErrorResponse | undefined;
  return errorData?.code || null;
};

// ============================================
// Response interceptor to handle token refresh and errors
// ============================================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Get error code from response
    const errorCode = getErrorCode(error);
    const statusCode = error.response?.status;

    console.log("API Error:", {
      status: statusCode,
      code: errorCode,
      url: originalRequest?.url,
    });

    // List of endpoints that should NOT trigger token refresh
    const authEndpoints = [
      "/api/v1/auth/login",
      "/api/v1/auth/register",
      "/api/v1/auth/refresh",
      "/api/v1/auth/forgot-password",
      "/api/v1/auth/reset-password",
      "/api/v1/auth/verify-email",
      "/api/v1/auth/verify-phone",
      "/api/v1/auth/social",
    ];

    const isAuthEndpoint = authEndpoints.some((endpoint) =>
      originalRequest?.url?.includes(endpoint)
    );

    // ============================================
    // Handle specific error codes
    // ============================================

    // FORBIDDEN - User doesn't have permission (403)
    if (errorCode === API_ERROR_CODES.FORBIDDEN) {
      console.warn("Access forbidden:", error.response?.data);
      // Don't redirect, just reject - let UI handle showing message
      return Promise.reject(error);
    }

    // UNAUTHORIZED - Generic unauthorized (401)
    if (errorCode === API_ERROR_CODES.UNAUTHORIZED) {
      console.warn("Unauthorized access:", error.response?.data);
      const accessToken = tokenManager.getAccessToken();
      // Only clear auth state if user was actually authenticated
      if (accessToken) {
        console.error("Authenticated user received unauthorized, clearing auth state");
        clearAuthState();
        emitLogout({ reason: "unauthorized" });
      }
      return Promise.reject(error);
    }

    // INVALID_TOKEN - Token is corrupted or malformed (401)
    if (errorCode === API_ERROR_CODES.INVALID_TOKEN) {
      console.error("Invalid token detected, clearing auth state");
      clearAuthState();
      emitLogout({ reason: "invalid_token" });
      return Promise.reject(error);
    }

    // INVALID_USER - User account issue (401)
    if (errorCode === API_ERROR_CODES.INVALID_USER) {
      console.error("Invalid user detected, clearing auth state");
      clearAuthState();
      emitLogout({ reason: "invalid_user" });
      return Promise.reject(error);
    }

    // TOKEN_EXPIRED - Attempt to refresh token (401)
    if (
      errorCode === API_ERROR_CODES.TOKEN_EXPIRED &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        console.error("No refresh token available");
        clearAuthState();
        emitLogout({ reason: "no_refresh_token" });
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Token expired, attempting refresh...");

        // Call refresh endpoint with refresh token in Authorization header
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/auth/refresh`,
          {},
          {
            headers: {
              "X-Api-Key": process.env.APP_API_KEY || "",
              "Authorization": `Bearer ${refreshToken}`,
            },
          }
        );

        const accessToken =
          response.data.access_token || response.data.accessToken;
        const newRefreshToken =
          response.data.refresh_token || response.data.refreshToken;

        if (!accessToken || !newRefreshToken) {
          console.error("Missing tokens in refresh response:", response.data);
          throw new Error("Invalid refresh response");
        }

        // Store new tokens
        tokenManager.setTokens(accessToken, newRefreshToken);
        console.log("Token refresh successful");

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        const refreshErrorCode = getErrorCode(refreshError as AxiosError);

        console.error("Token refresh failed:", {
          code: refreshErrorCode,
          error: refreshError,
        });

        processQueue(refreshError, null);

        // Check if refresh token is also expired or invalid
        if (
          refreshErrorCode === API_ERROR_CODES.TOKEN_EXPIRED ||
          refreshErrorCode === API_ERROR_CODES.INVALID_TOKEN ||
          refreshErrorCode === API_ERROR_CODES.INVALID_USER
        ) {
          console.error(
            "Refresh token expired or invalid, clearing auth state"
          );
          clearAuthState();
          emitLogout({ reason: "refresh_failed" });
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // UNAUTHORIZED - Generic auth failure or no specific code (401)
    // Only clear auth if we have explicit error code from server.
    // Generic 401 without error code could be transient network issues,
    // server errors, or other non-auth failures - don't lock user out.
    if (statusCode === 401 && !errorCode && !isAuthEndpoint) {
      // Log for debugging but don't clear auth state - let the app retry or show server error
      console.warn("Received 401 without error code - possible transient error:", {
        url: originalRequest?.url,
        status: statusCode,
      });
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
