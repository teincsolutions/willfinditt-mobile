import * as tokenManager from "@/utils/tokenManager";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Create axios instance
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

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

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
      originalRequest.url?.includes(endpoint)
    );

    // Get refresh token (synchronous)
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      // No refresh token, cannot refresh
      return Promise.reject(error);
    }

    // Check if error is 401 and we haven't retried yet, and it's not an auth endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
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
        console.log("Attempting token refresh with refresh token");

        // Call refresh endpoint - send refresh token in body, not header
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/auth/refresh`,
          { refresh_token: refreshToken },
          {
            headers: {
              "X-Api-Key": process.env.APP_API_KEY || "",
            },
          }
        );

        console.log("Token refresh response:", response.data);

        const accessToken =
          response.data.access_token || response.data.accessToken;
        const newRefreshToken =
          response.data.refresh_token || response.data.refreshToken;

        if (!accessToken || !newRefreshToken) {
          console.error("Missing tokens in refresh response:", response.data);
          throw new Error("Invalid refresh response");
        }

        // Store new tokens (synchronous)
        tokenManager.setTokens(accessToken, newRefreshToken);
        console.log("New tokens stored successfully");

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear tokens on refresh failure (synchronous)
        tokenManager.clearTokens();

        // Optionally redirect to login or trigger logout
        // You can emit an event here or use a store to handle logout

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
