import queryClient from "@/lib/query-client";
import { authService } from "@/services/authService";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SocialData,
  User,
} from "@/types";
import { mmkvStorage, storage } from "@/utils/mmkvStorage";
import * as tokenManager from "@/utils/tokenManager";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMMKVBoolean } from "react-native-mmkv";
import { toast } from "sonner-native";
import { SELLER_QUERY_KEYS } from "./useSeller";

// ============================================
// MMKV Storage Keys
// ============================================

export const AUTH_KEYS = {
  IS_AUTHENTICATED: "auth_is_authenticated",
} as const;

export const AUTH_QUERY_KEYS = {
  AUTH_USER: ["auth", "user"] as const,
  AUTH: ["auth"] as const,
};

// ============================================
// Storage Helpers (Using MMKV native JSON support)
// ============================================

async function clearAuthState(): Promise<void> {
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
    toast.success("Login Successful!");
  };

  // ============================================
  // Authentication Mutations
  // ============================================

  /**
   * Register a new user
   */
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });

  /**
   * Login with email/phone and password
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: async (response) => {
      if (!response.requires2FA) {
        handleSuccessfulLogin(response);
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
   * Logout user
   */
  const logoutMutation = useMutation({
    mutationFn: async () => await authService.logout(),
    onSuccess: async () => {
      clearAuthState();
    },
    onError: (error) => {
      clearAuthState();
      console.log("Error during logout:", error);
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
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: async (otp: string) => await authService.verifyPhone(otp),
    onSuccess: async () => {
      // Refresh user data after phone verification - TanStack Query + MMKV handles persistence
      if (user) {
        const updatedUser = await authService.getProfile();
        queryClient.setQueryData(AUTH_QUERY_KEYS.AUTH_USER, updatedUser);
      }
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
      await logoutMutation.mutateAsync();
    },
  });

  const getProfileMutation = useMutation({
    mutationFn: () => authService.getProfile(),
    onSuccess: (userData) => {
      // TanStack Query + MMKV handles persistence automatically
      queryClient.setQueryData(["auth", "user"], userData);
    },
  });

  const checkUserStatusMutation = useMutation({
    mutationFn: () => authService.getProfile(),
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(["auth", "user"], updatedUser);

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
    isAuthenticated, // Global auth state from MMKV

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
