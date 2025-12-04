import axios, { InternalAxiosRequestConfig } from "axios";
import { tokenManager } from "../utils/tokenManager";

// Create axios instance
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    "X-Api-Key": process.env.APP_API_KEY || "",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get token from tokenManager
      const authToken = await tokenManager.getToken();

      // Add token to headers if it exists
      if (authToken) {
        config.headers["Authorization"] = `Bearer ${authToken}`;
      }

      return config;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
