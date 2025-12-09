import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import type { LoginRequest, RegisterRequest, SocialData, User } from "@/types";
import { mmkvStorage } from "@/utils/mmkvStorage";
import { tokenManager } from "@/utils/tokenManager";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

// ============================================
// MMKV Storage Keys
// ============================================

const AUTH_KEYS = {
  USER: "auth_user",
  REQUIRES_2FA: "auth_requires_2fa",
  TWO_FA_USER_ID: "auth_2fa_user_id",
} as const;

// ============================================
// Storage Helpers (Using MMKV native JSON support)
// ============================================

function getStoredUser(): User | null {
  return mmkvStorage.getJSON<User>(AUTH_KEYS.USER);
}

function setStoredUser(user: User | null): void {
  if (user) {
    mmkvStorage.setJSON(AUTH_KEYS.USER, user);
  } else {
    mmkvStorage.removeItem(AUTH_KEYS.USER);
  }
}

function get2FAState(): { requires2FA: boolean; userId: string | null } {
  const requires2FA = mmkvStorage.getBoolean(AUTH_KEYS.REQUIRES_2FA) || false;
  const userId = mmkvStorage.getItem(AUTH_KEYS.TWO_FA_USER_ID) || null;
  return { requires2FA, userId };
}

function set2FAState(requires2FA: boolean, userId: string | null): void {
  if (requires2FA && userId) {
    mmkvStorage.setBoolean(AUTH_KEYS.REQUIRES_2FA, true);
    mmkvStorage.setItem(AUTH_KEYS.TWO_FA_USER_ID, userId);
  } else {
    mmkvStorage.removeItem(AUTH_KEYS.REQUIRES_2FA);
    mmkvStorage.removeItem(AUTH_KEYS.TWO_FA_USER_ID);
  }
}

// ============================================
// useAuth Hook with All Auth Operations
// ============================================

export function useAuth() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [twoFAState, setTwoFAState] = useState(() => get2FAState());

  // Get user from React Query cache or storage
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["auth", "user"],
    queryFn: () => getStoredUser(),
    staleTime: Infinity,
  });

  const isLoggedIn = !!user;

  // Helper to handle auth response
  const handleAuthResponse = useCallback(
    async (response: any) => {
      console.log("Auth response received:", JSON.stringify(response, null, 2));

      // Check if 2FA is required
      if (response.requires2FA) {
        const userId = response.userId || response.user?.id || "";
        set2FAState(true, userId);
        setTwoFAState({ requires2FA: true, userId });
        return { requires2FA: true, userId };
      }

      // Store tokens - check both snake_case and camelCase
      const accessToken = response.access_token || response.accessToken;
      const refreshToken = response.refresh_token || response.refreshToken;

      console.log("Token check:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenLength: accessToken?.length || 0,
        refreshTokenLength: refreshToken?.length || 0,
      });

      if (accessToken && refreshToken) {
        await tokenManager.setTokens(accessToken, refreshToken);
        console.log("Tokens stored successfully");
      } else {
        console.warn("Missing tokens in response:", {
          accessToken: !!accessToken,
          refreshToken: !!refreshToken,
        });
      }

      // Store user ID
      if (response.user?.id) {
        await tokenManager.setUserId(response.user.id);
      }

      // Update user in storage and React Query cache
      setStoredUser(response.user);
      queryClient.setQueryData(["auth", "user"], response.user);

      // Clear 2FA state
      set2FAState(false, null);
      setTwoFAState({ requires2FA: false, userId: null });

      return { requires2FA: false, user: response.user };
    },
    [queryClient]
  );

  // ============================================
  // Authentication Mutations
  // ============================================

  /**
   * Register a new user
   */
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: async (response) => {
      await handleAuthResponse(response);
    },
    onError: (err: any) => {
      setError(err.message || "Registration failed");
    },
  });

  /**
   * Login with email/phone and password
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: async (response) => {
      await handleAuthResponse(response);
    },
    onError: (err: any) => {
      setError(err.message || "Login failed");
    },
  });

  /**
   * Verify 2FA OTP code
   */
  const verify2FAMutation = useMutation({
    mutationFn: (otpCode: string) => {
      if (!twoFAState.userId) {
        throw new Error("No 2FA session found");
      }
      return authService.verify2FAOTP(twoFAState.userId, otpCode);
    },
    onSuccess: async (response) => {
      await handleAuthResponse(response);
    },
    onError: (err: any) => {
      setError(err.message || "OTP verification failed");
    },
  });

  /**
   * Social authentication (Google, Facebook, etc.)
   */
  const socialAuthMutation = useMutation({
    mutationFn: (socialData: SocialData) => authService.socialAuth(socialData),
    onSuccess: async (response) => {
      await handleAuthResponse(response);
    },
    onError: (err: any) => {
      setError(err.message || "Social authentication failed");
    },
  });

  /**
   * Logout user
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Clear all tokens
      await tokenManager.clearAllTokens();

      // Sign out from Google if applicable
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        // Ignore Google sign out errors
      }

      // Clear user from storage
      setStoredUser(null);
    },
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.removeQueries({ queryKey: ["user"] });

      // Clear 2FA state
      set2FAState(false, null);
      setTwoFAState({ requires2FA: false, userId: null });
    },
    onError: (err: any) => {
      setError(err.message || "Logout failed");
    },
  });

  // ============================================
  // Password Management Mutations
  // ============================================

  const changePasswordMutation = useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authService.changePassword(currentPassword, newPassword),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => authService.resetPassword(token, newPassword),
  });

  // ============================================
  // Email & Phone Verification Mutations
  // ============================================

  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: async () => {
      // Refresh user data after email verification
      if (user) {
        const updatedUser = await authService.getProfile();
        setStoredUser(updatedUser);
        queryClient.setQueryData(["auth", "user"], updatedUser);
      }
    },
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: (otp: string) => authService.verifyPhone(otp),
    onSuccess: async () => {
      // Refresh user data after phone verification
      if (user) {
        const updatedUser = await authService.getProfile();
        setStoredUser(updatedUser);
        queryClient.setQueryData(["auth", "user"], updatedUser);
      }
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: (data: { email: string } | { phone: string }) =>
      authService.resendVerification(data),
  });

  const sendPhoneOTPMutation = useMutation({
    mutationFn: (phone: string) => authService.sendPhoneOTP(phone),
  });

  const verifyPhoneOTPAndResetMutation = useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      authService.verifyPhoneOTPAndReset(phone, otp),
  });

  // ============================================
  // Session Management Mutations
  // ============================================

  const refreshTokenMutation = useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: async (response) => {
      await tokenManager.setTokens(
        response.access_token,
        response.refresh_token
      );
    },
    onError: async () => {
      // If refresh fails, logout user
      await logoutMutation.mutateAsync();
    },
  });

  const getProfileMutation = useMutation({
    mutationFn: () => authService.getProfile(),
    onSuccess: (userData) => {
      setStoredUser(userData);
      queryClient.setQueryData(["auth", "user"], userData);
    },
  });

  const checkUserStatusMutation = useMutation({
    mutationFn: () => userService.getProfile(),
    onSuccess: async (updatedUser) => {
      if (!user) return;

      // Check if user data has changed
      const hasChanged =
        user.firstName !== updatedUser.firstName ||
        user.lastName !== updatedUser.lastName ||
        user.email !== updatedUser.email ||
        user.phone !== updatedUser.phone ||
        user.avatar !== updatedUser.avatar ||
        user.isActive !== updatedUser.isActive ||
        user.isVerified !== updatedUser.isVerified;

      if (hasChanged) {
        setStoredUser(updatedUser);
        queryClient.setQueryData(["auth", "user"], updatedUser);
      }

      // If user is no longer active, logout
      if (!updatedUser.isActive) {
        await logoutMutation.mutateAsync();
      }
    },
  });

  // ============================================
  // Return Hook Interface
  // ============================================

  return {
    // User State
    user,
    isLoading,
    isAuthenticated: !!user,

    // Registration
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

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
    requires2FA: get2FAState().requires2FA,
    twoFAUserId: get2FAState().userId,

    // Social Auth
    socialAuth: socialAuthMutation.mutate,
    socialAuthAsync: socialAuthMutation.mutateAsync,
    isSocialAuthLoading: socialAuthMutation.isPending,
    socialAuthError: socialAuthMutation.error,

    // Logout
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

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

    verifyPhoneOTPAndReset: verifyPhoneOTPAndResetMutation.mutate,
    verifyPhoneOTPAndResetAsync: verifyPhoneOTPAndResetMutation.mutateAsync,
    isVerifyingPhoneOTPAndReset: verifyPhoneOTPAndResetMutation.isPending,
    verifyPhoneOTPAndResetError: verifyPhoneOTPAndResetMutation.error,

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
