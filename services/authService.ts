import api from "./api";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ApiResponse,
  SocialData,
} from "@/types";

// Enhanced error handling for auth operations
const handleAuthError = (error: any): never => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || "Authentication failed";
    const status = error.response.status;

    switch (status) {
      case 400:
        throw new Error(message || "Invalid request data");
      case 401:
        throw new Error("Invalid credentials");
      case 403:
        throw new Error("Access forbidden");
      case 404:
        throw new Error("User not found");
      case 409:
        throw new Error(message || "User already exists");
      case 422:
        throw new Error(message || "Validation failed");
      case 429:
        throw new Error("Too many requests. Please try again later");
      case 500:
        throw new Error("Server error. Please try again later");
      default:
        throw new Error(message || "Authentication failed");
    }
  } else if (error.request) {
    // Network error
    throw new Error("Network error. Please check your connection");
  } else {
    // Other error
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const authService = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/api/v1/auth/register",
        data
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Login user - supports email or phone
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/api/v1/auth/login", data);
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get<User>("/api/v1/auth/profile");
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await api.post<AuthResponse>("/api/v1/auth/refresh");
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email: string): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/forgot-password",
        { email }
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Reset password with token
  resetPassword: async (
    token: string,
    password: string
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/reset-password",
        {
          token,
          password,
        }
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Verify email with token
  verifyEmail: async (token: string): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/verify-email",
        { token }
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Resend verification (email or phone)
  resendVerification: async (
    data: { email: string } | { phone: string }
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/resend-verification",
        data
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Verify phone with OTP
  verifyPhone: async (otp: string): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/verify-phone",
        { otp }
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Social authentication (Google, Facebook, etc.)
  socialAuth: async (socialData: SocialData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/api/v1/auth/social-auth",
        socialData
      );
      return response.data;
    } catch (error: any) {
      console.log("Social auth error", error);
      return handleAuthError(error);
    }
  },

  // Send OTP to phone for password reset
  sendPhoneOTP: async (phone: string): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/send-phone-otp",
        { phone }
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Verify phone OTP for password reset
  verifyPhoneOTPAndReset: async (
    phone: string,
    otp: string
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/verify-phone-otp-reset",
        {
          phone,
          otp,
        }
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },
};
