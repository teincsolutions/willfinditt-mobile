import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SocialData,
  User,
} from "@/types";
import api from "./api";

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
        // Handle conflict - preserve original message for smart handling
        const conflictError = new Error(message || "User already exists");
        (conflictError as any).isConflict = true;
        (conflictError as any).originalMessage = message;
        throw conflictError;
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
        data,
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

  // Logout user (current device)
  logout: async (refreshToken?: string): Promise<void> => {
    try {
      await api.post("/api/v1/auth/logout", { refreshToken });
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Logout from all devices
  logoutAll: async (): Promise<void> => {
    try {
      await api.post("/api/v1/auth/logout-all");
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Get active sessions (NOT IMPLEMENTED IN API - stub for compatibility)
  getActiveSessions: async (): Promise<any[]> => {
    console.warn("getActiveSessions is not implemented in the backend API");
    return [];
  },

  // Revoke specific session (NOT IMPLEMENTED IN API - stub for compatibility)
  revokeSession: async (sessionId: string): Promise<void> => {
    console.warn("revokeSession is not implemented in the backend API");
    throw new Error("Session management is not available");
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

  // Change password (requires current password)
  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Request password reset
  forgotPassword: async ({
    email,
    phone,
  }: {
    email?: string;
    phone?: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/forgot-password",
        { email, phone },
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Reset password with token
  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/reset-password",
        {
          token,
          newPassword,
        },
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Verify 2FA OTP
  verify2FAOTP: async (
    userId: string,
    otpCode: string,
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/api/v1/auth/verify-2fa-otp",
        {
          userId,
          otpCode,
        },
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
        { token },
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Resend verification (email or phone)
  resendVerification: async (
    data: { email: string } | { phone: string },
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/resend-verification",
        data,
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Verify phone with OTP
  verifyPhone: async (
    token: string,
    phone: string,
  ): Promise<ApiResponse<any>> => {
    try {
      console.log("Verifying phone with OTP:", token);
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/verify-phone",
        { token, phone },
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Social authentication (Google, Facebook, etc.)
  socialAuth: async (socialData: SocialData): Promise<AuthResponse> => {
    try {
      // log req data
      const response = await api.post<AuthResponse>(
        "/api/v1/auth/social-auth",
        socialData,
      );
      return response.data;
    } catch (error: any) {
      console.log("Social auth error", error.response.data);
      return handleAuthError(error);
    }
  },

  // Send OTP to phone for password reset
  sendPhoneOTP: async (phone: string): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/send-phone-otp",
        { phone },
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Verify phone OTP for password reset (optional - just verification)
  verifyResetPhoneOtp: async (
    phone: string,
    otp: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/verify-reset-phone-otp",
        {
          phone,
          otp,
        },
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Reset password with phone OTP
  resetPasswordWithPhone: async (
    phone: string,
    otp: string,
    newPassword: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/reset-password-phone",
        {
          phone,
          otp,
          newPassword,
        },
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  // Accept terms and privacy policy (for existing users)
  acceptTerms: async (data: {
    termsAccepted: boolean;
    privacyPolicyAccepted: boolean;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        "/api/v1/auth/accept-terms",
        data,
      );
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },
};
