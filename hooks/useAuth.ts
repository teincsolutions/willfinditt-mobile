import queryClient from "@/lib/query-client";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SocialData,
  User,
} from "@/types";
import { onLogout } from "@/utils/eventEmitter";
import { mmkvStorage, storage } from "@/utils/mmkvStorage";
import * as tokenManager from "@/utils/tokenManager";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMMKVBoolean } from "react-native-mmkv";
import { toast } from "sonner-native";
import { AUTH_QUERY_KEYS, SELLER_QUERY_KEYS } from "./queryKeys";

// ============================================
// MMKV Storage Keys
// ============================================

export const AUTH_KEYS = {
  IS_AUTHENTICATED: "auth_is_authenticated",
} as const;

// ============================================
// Storage Helpers (Using MMKV native JSON support)
// ============================================

export async function clearAuthState(): Promise<void> {
  try {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser) await GoogleSignin.signOut();
  } catch (error) {
    console.error("Error signing out from Google:", error);
  }
  tokenManager.clearTokens();
  mmkvStorage.removeItem(AUTH_KEYS.IS_AUTHENTICATED);
  queryClient.clear();
}

// ============================================
// useAuth Hook with All Auth Operations
// ============================================

export function useAuth() {
  // Global authentication state from MMKV (triggers re-renders automatically)
  const [isAuthenticated, setIsAuthenticated] = useMMKVBoolean(
    AUTH_KEYS.IS_AUTHENTICATED,
    storage
  );

  // Listen for logout events from API interceptor
  useEffect(() => {
    const cleanup = onLogout((payload) => {
      console.log("Logout event received:", payload);

      // Use a small timeout to avoid immediate state updates during render
      setTimeout(() => {
        // Clear auth state
        setIsAuthenticated(false);

        // Show appropriate message based on reason
        const messages = {
          invalid_token: "Your session is invalid. Please login again.",
          invalid_user: "Your account is no longer active.",
          no_refresh_token: "Session expired. Please login again.",
          refresh_failed: "Session expired. Please login again.",
          unauthorized: "Please login to continue.",
          manual: "Logged out successfully.",
        };

        const message = messages[payload.reason] || "Logged out";
        toast.error(message);
      }, 0);
    });

    return cleanup;
  }, [setIsAuthenticated]);

  // Get user from React Query cache or storage
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: AUTH_QUERY_KEYS.AUTH_USER,
    queryFn: async () => await authService.getProfile(),
    enabled: isAuthenticated,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const handleSuccessfulLogin = (response: AuthResponse) => {
    // Store tokens
    tokenManager.setTokens(response.access_token, response.refresh_token);

    // Set user in React Query cache - MMKV handles persistence
    queryClient.setQueryData(AUTH_QUERY_KEYS.AUTH_USER, response.user);

    // Set global auth state
    setIsAuthenticated(true);

    // Fetch and store user profile in React Query cache
    queryClient.refetchQueries({ queryKey: AUTH_QUERY_KEYS.AUTH_USER });
    queryClient.invalidateQueries({
      queryKey: SELLER_QUERY_KEYS.SELLER_MY_PROFILE,
    });
  };

  // ============================================
  // Authentication Mutations
  // ============================================

  /**
   * Register a new user
   */
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onError: (error: any) => {
      console.log("Registration error:", error.response);
      // If 409, always treat as duplicate unverified (verification resent)
      if (error?.response?.status === 409) {
        toast.info(
          error.response?.data?.message ||
            "Account already exists but is unverified. Verification has been resent."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Registration failed"
        );
      }
    },
    onSuccess: (response) => {
      console.log("Registration successful:", response);
      if (!response.requiresVerification) {
        handleSuccessfulLogin(response);
      } else {
        tokenManager.setTokens(response.access_token, response.refresh_token);
      }
      toast.success(response.message || "Registration Successful!");
    },
  });

  /**
   * Login with email/phone and password
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: async (response) => {
      if (!response.requires2FA) {
        handleSuccessfulLogin(response);

        // Check if verification is required
        if (response.requiresVerification) {
          toast.success(
            "Login Successful! Please verify your account to access all features."
          );
        } else {
          toast.success("Login Successful!");
        }
      }
    },
  });

  /**
   * Verify 2FA OTP code
   */
  const verify2FAMutation = useMutation({
    mutationFn: ({ userId, otpCode }: { userId: string; otpCode: string }) => {
      return authService.verify2FAOTP(userId, otpCode);
    },
    onSuccess: (response) => {
      handleSuccessfulLogin(response);
      toast.success("Login Successful!");
    },
  });

  /**
   * Social authentication (Google, Facebook, etc.)
   */
  const socialAuthMutation = useMutation({
    mutationFn: (socialData: SocialData) => authService.socialAuth(socialData),
    onSuccess: (response) => {
      console.log("Social Auth Response:", response);
      handleSuccessfulLogin(response);
    },
  });

  /**
   * Logout user from current device
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = tokenManager.getRefreshToken() || undefined;
      await authService.logout(token);
    },
    onSuccess: async () => {
      clearAuthState();
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      clearAuthState();
      console.log("Error during logout:", error);
      toast.error("Logout completed with errors");
    },
  });

  /**
   * Logout user from all devices
   */
  const logoutAllMutation = useMutation({
    mutationFn: async () => await authService.logoutAll(),
    onSuccess: async () => {
      clearAuthState();
      toast.success("Logged out from all devices successfully");
    },
    onError: (error) => {
      clearAuthState();
      console.log("Error during logout all:", error);
      toast.error("Logout completed with errors");
    },
  });

  /**
   * Get active sessions
   */
  const getActiveSessionsQuery = useQuery({
    queryKey: AUTH_QUERY_KEYS.SESSIONS,
    queryFn: () => authService.getActiveSessions(),
    enabled: isAuthenticated,
    refetchInterval: false, // Only fetch manually
  });

  /**
   * Revoke specific session
   */
  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => authService.revokeSession(sessionId),
    onSuccess: () => {
      // Refetch active sessions after revoking
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.SESSIONS });
      toast.success("Session revoked successfully");
    },
    onError: (error) => {
      console.log("Error revoking session:", error);
      toast.error("Failed to revoke session");
    },
  });

  // ============================================
  // Password Management Mutations
  // ============================================

  const changePasswordMutation = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => await authService.changePassword(currentPassword, newPassword),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async ({ email, phone }: { email?: string; phone?: string }) =>
      await authService.forgotPassword({ email, phone }),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => await authService.resetPassword(token, newPassword),
  });

  // ============================================
  // Email & Phone Verification Mutations
  // ============================================

  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: async () => {
      if (user) {
        const updatedUser = await authService.getProfile();
        queryClient.setQueryData(AUTH_QUERY_KEYS.AUTH_USER, updatedUser);
      }
    },
    onError: (error) => {
      console.log("Email verification error:", error);
      toast.error(
        error?.message || "Failed to verify email. Please try again."
      );
    },
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: async ({ otp, phone }: { otp: string; phone: string }) =>
      await authService.verifyPhone(otp, phone),
    onSuccess: async (response) => {
      // Refresh user data after phone verification - TanStack Query + MMKV handles persistence
      if (user) {
        const updatedUser = await authService.getProfile();
        queryClient.setQueryData(AUTH_QUERY_KEYS.AUTH_USER, updatedUser);
      }
    },
    onError: (error) => {
      console.log("Phone verification error:", error);
      toast.error(
        error?.message || "Failed to verify phone. Please try again."
      );
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async (data: { email: string } | { phone: string }) =>
      await authService.resendVerification(data),
  });

  const sendPhoneOTPMutation = useMutation({
    mutationFn: (phone: string) => authService.sendPhoneOTP(phone),
  });

  const verifyResetPhoneOtpMutation = useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      authService.verifyResetPhoneOtp(phone, otp),
  });

  const resetPasswordWithPhoneMutation = useMutation({
    mutationFn: ({
      phone,
      otp,
      newPassword,
    }: {
      phone: string;
      otp: string;
      newPassword: string;
    }) => authService.resetPasswordWithPhone(phone, otp, newPassword),
  });

  // ============================================
  // Session Management Mutations
  // ============================================

  const refreshTokenMutation = useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (response) => {
      tokenManager.setTokens(response.access_token, response.refresh_token);
      setIsAuthenticated(true);
    },
    onError: async () => {
      // If refresh fails, logout user
      await logoutMutation.mutateAsync(undefined);
    },
  });

  const getProfileMutation = useMutation({
    mutationFn: () => authService.getProfile(),
    onSuccess: (userData) => {
      // TanStack Query + MMKV handles persistence automatically
      queryClient.setQueryData(AUTH_QUERY_KEYS.AUTH_USER, userData);
    },
  });

  const checkUserStatusMutation = useMutation({
    mutationFn: () => authService.getProfile(),
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.AUTH_USER, updatedUser);

      // If user is no longer active, logout
      if (!updatedUser.isActive) {
        await logoutMutation.mutateAsync(undefined);
      }
    },
  });

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<User>) => userService.updateProfile(data),
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.AUTH_USER, updatedUser);
    },
  });

  // ============================================
  // Return Hook Interface
  // ============================================

  return {
    // User State
    user,
    isLoading,
    isAuthenticated, // Global auth state from MMKV

    // Registration
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    // Update Profile
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // 2FA
    verify2FA: verify2FAMutation.mutate,
    verify2FAAsync: verify2FAMutation.mutateAsync,
    isVerifying2FA: verify2FAMutation.isPending,
    verify2FAError: verify2FAMutation.error,

    // Social Auth
    socialAuth: socialAuthMutation.mutate,
    socialAuthAsync: socialAuthMutation.mutateAsync,
    isSocialAuthLoading: socialAuthMutation.isPending,
    socialAuthError: socialAuthMutation.error,

    // Logout
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error,

    // Logout All Devices
    logoutAll: logoutAllMutation.mutate,
    logoutAllAsync: logoutAllMutation.mutateAsync,
    isLoggingOutAll: logoutAllMutation.isPending,
    logoutAllError: logoutAllMutation.error,

    // Active Sessions
    activeSessions: getActiveSessionsQuery.data,
    isLoadingSessions: getActiveSessionsQuery.isLoading,
    refetchSessions: getActiveSessionsQuery.refetch,
    sessionsError: getActiveSessionsQuery.error,

    // Revoke Session
    revokeSession: revokeSessionMutation.mutate,
    revokeSessionAsync: revokeSessionMutation.mutateAsync,
    isRevokingSession: revokeSessionMutation.isPending,
    revokeSessionError: revokeSessionMutation.error,

    // Password Management
    changePassword: changePasswordMutation.mutate,
    changePasswordAsync: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error,

    forgotPassword: forgotPasswordMutation.mutate,
    forgotPasswordAsync: forgotPasswordMutation.mutateAsync,
    isSendingPasswordReset: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,

    resetPassword: resetPasswordMutation.mutate,
    resetPasswordAsync: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,

    // Email & Phone Verification
    verifyEmail: verifyEmailMutation.mutate,
    verifyEmailAsync: verifyEmailMutation.mutateAsync,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error,

    verifyPhone: verifyPhoneMutation.mutate,
    verifyPhoneAsync: verifyPhoneMutation.mutateAsync,
    isVerifyingPhone: verifyPhoneMutation.isPending,
    verifyPhoneError: verifyPhoneMutation.error,

    resendVerification: resendVerificationMutation.mutate,
    resendVerificationAsync: resendVerificationMutation.mutateAsync,
    isResendingVerification: resendVerificationMutation.isPending,
    resendVerificationError: resendVerificationMutation.error,

    sendPhoneOTP: sendPhoneOTPMutation.mutate,
    sendPhoneOTPAsync: sendPhoneOTPMutation.mutateAsync,
    isSendingPhoneOTP: sendPhoneOTPMutation.isPending,
    sendPhoneOTPError: sendPhoneOTPMutation.error,

    verifyResetPhoneOtp: verifyResetPhoneOtpMutation.mutate,
    verifyResetPhoneOtpAsync: verifyResetPhoneOtpMutation.mutateAsync,
    isVerifyingResetPhoneOtp: verifyResetPhoneOtpMutation.isPending,
    verifyResetPhoneOtpError: verifyResetPhoneOtpMutation.error,

    resetPasswordWithPhone: resetPasswordWithPhoneMutation.mutate,
    resetPasswordWithPhoneAsync: resetPasswordWithPhoneMutation.mutateAsync,
    isResettingPasswordWithPhone: resetPasswordWithPhoneMutation.isPending,
    resetPasswordWithPhoneError: resetPasswordWithPhoneMutation.error,

    // Session Management
    refreshToken: refreshTokenMutation.mutate,
    refreshTokenAsync: refreshTokenMutation.mutateAsync,
    isRefreshingToken: refreshTokenMutation.isPending,
    refreshTokenError: refreshTokenMutation.error,

    getProfile: getProfileMutation.mutate,
    getProfileAsync: getProfileMutation.mutateAsync,
    isGettingProfile: getProfileMutation.isPending,
    getProfileError: getProfileMutation.error,

    checkUserStatus: checkUserStatusMutation.mutate,
    checkUserStatusAsync: checkUserStatusMutation.mutateAsync,
    isCheckingUserStatus: checkUserStatusMutation.isPending,
  };
}
