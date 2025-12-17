import { userService } from "@/services/userService";
import type { User } from "@/types";
import { mmkvStorage } from "@/utils/mmkvStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUser = (userId?: string) => {
  const queryClient = useQueryClient();

  // Get user by ID (public profile)
  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      return await userService.getUserById(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Request email change mutation
  const requestEmailChangeMutation = useMutation({
    mutationFn: ({ newEmail, currentPassword }: { newEmail: string; currentPassword: string }) =>
      userService.requestEmailChange(newEmail, currentPassword),
  });

  // Verify email change mutation
  const verifyEmailChangeMutation = useMutation({
    mutationFn: (code: string) => userService.verifyEmailChange(code),
    onSuccess: (updatedUser: User) => {
      mmkvStorage.setJSON("auth_user", updatedUser);
      queryClient.setQueryData(["auth", "user"], updatedUser);
    },
  });

  // Request phone change mutation
  const requestPhoneChangeMutation = useMutation({
    mutationFn: ({ newPhone, currentPassword }: { newPhone: string; currentPassword: string }) =>
      userService.requestPhoneChange(newPhone, currentPassword),
  });

  // Verify phone change mutation
  const verifyPhoneChangeMutation = useMutation({
    mutationFn: (otp: string) => userService.verifyPhoneChange(otp),
    onSuccess: (updatedUser: User) => {
      mmkvStorage.setJSON("auth_user", updatedUser);
      queryClient.setQueryData(["auth", "user"], updatedUser);
    },
  });

  // Request email verification mutation
  const requestEmailVerificationMutation = useMutation({
    mutationFn: () => userService.requestEmailVerification(),
  });

  // Request phone verification mutation
  const requestPhoneVerificationMutation = useMutation({
    mutationFn: () => userService.requestPhoneVerification(),
  });

  // Verify existing email mutation
  const verifyExistingEmailMutation = useMutation({
    mutationFn: (code: string) => userService.verifyExistingEmail(code),
    onSuccess: (updatedUser: User) => {
      mmkvStorage.setJSON("auth_user", updatedUser);
      queryClient.setQueryData(["auth", "user"], updatedUser);
    },
  });

  // Verify existing phone mutation
  const verifyExistingPhoneMutation = useMutation({
    mutationFn: (otp: string) => userService.verifyExistingPhone(otp),
    onSuccess: (updatedUser: User) => {
      mmkvStorage.setJSON("auth_user", updatedUser);
      queryClient.setQueryData(["auth", "user"], updatedUser);
    },
  });

  return {
    // Query
    ...userQuery,
    
    // Email change
    requestEmailChange: requestEmailChangeMutation.mutate,
    requestEmailChangeAsync: requestEmailChangeMutation.mutateAsync,
    isRequestingEmailChange: requestEmailChangeMutation.isPending,
    requestEmailChangeError: requestEmailChangeMutation.error,

    verifyEmailChange: verifyEmailChangeMutation.mutate,
    verifyEmailChangeAsync: verifyEmailChangeMutation.mutateAsync,
    isVerifyingEmailChange: verifyEmailChangeMutation.isPending,
    verifyEmailChangeError: verifyEmailChangeMutation.error,

    // Phone change
    requestPhoneChange: requestPhoneChangeMutation.mutate,
    requestPhoneChangeAsync: requestPhoneChangeMutation.mutateAsync,
    isRequestingPhoneChange: requestPhoneChangeMutation.isPending,
    requestPhoneChangeError: requestPhoneChangeMutation.error,

    verifyPhoneChange: verifyPhoneChangeMutation.mutate,
    verifyPhoneChangeAsync: verifyPhoneChangeMutation.mutateAsync,
    isVerifyingPhoneChange: verifyPhoneChangeMutation.isPending,
    verifyPhoneChangeError: verifyPhoneChangeMutation.error,

    // Email verification
    requestEmailVerification: requestEmailVerificationMutation.mutate,
    requestEmailVerificationAsync: requestEmailVerificationMutation.mutateAsync,
    isRequestingEmailVerification: requestEmailVerificationMutation.isPending,
    requestEmailVerificationError: requestEmailVerificationMutation.error,

    verifyExistingEmail: verifyExistingEmailMutation.mutate,
    verifyExistingEmailAsync: verifyExistingEmailMutation.mutateAsync,
    isVerifyingExistingEmail: verifyExistingEmailMutation.isPending,
    verifyExistingEmailError: verifyExistingEmailMutation.error,

    // Phone verification
    requestPhoneVerification: requestPhoneVerificationMutation.mutate,
    requestPhoneVerificationAsync: requestPhoneVerificationMutation.mutateAsync,
    isRequestingPhoneVerification: requestPhoneVerificationMutation.isPending,
    requestPhoneVerificationError: requestPhoneVerificationMutation.error,

    verifyExistingPhone: verifyExistingPhoneMutation.mutate,
    verifyExistingPhoneAsync: verifyExistingPhoneMutation.mutateAsync,
    isVerifyingExistingPhone: verifyExistingPhoneMutation.isPending,
    verifyExistingPhoneError: verifyExistingPhoneMutation.error,
  };
};
