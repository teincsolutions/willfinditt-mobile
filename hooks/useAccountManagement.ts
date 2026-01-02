import { userService } from "@/services/userService";
import { emitLogout } from "@/utils/eventEmitter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";

/**
 * Hook for account deactivation
 * Deactivates account - user won't be able to log in until admin reactivates
 */
export const useDeactivateAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return userService.deactivateAccount();
    },
    onSuccess: () => {
      // Clear auth state and logout
      queryClient.clear();
      emitLogout({ reason: "manual" });
      
      toast.success("Account deactivated", {
        description: "Your account has been deactivated successfully.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to deactivate account", {
        description: error?.message || "An error occurred",
      });
    },
  });

  return {
    deactivate: mutation.mutate,
    deactivateAsync: mutation.mutateAsync,
    isDeactivating: mutation.isPending,
    error: mutation.error,
  };
};

/**
 * Hook for account deletion (soft delete with 30-day grace period)
 * - All ACTIVE and PENDING ads will be closed immediately
 * - 30-day grace period before permanent anonymization
 * - User can contact support to reactivate within 30 days
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return userService.deleteAccount();
    },
    onSuccess: () => {
      // Clear auth state and logout
      queryClient.clear();
      emitLogout({ reason: "manual" });
      
      toast.success("Account deletion requested", {
        description: "Your account will be deleted after 30 days. Contact support to reactivate.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete account", {
        description: error?.message || "An error occurred",
      });
    },
  });

  return {
    deleteAccount: mutation.mutate,
    deleteAccountAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
};
