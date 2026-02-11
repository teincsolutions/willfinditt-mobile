import {
  BlockUserRequest,
  CreateReportRequest,
  moderationService,
} from "@/services/moderationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { AD_QUERY_KEYS } from "./queryKeys";

export const useReportAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ adId, data }: { adId: string; data: CreateReportRequest }) =>
      moderationService.reportAd(adId, data),
    onSuccess: (_, variables) => {
      toast.success("Ad reported successfully");
      queryClient.invalidateQueries({
        queryKey: AD_QUERY_KEYS.AD(variables.adId),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to report ad");
    },
  });
};

export const useReportComment = () => {
  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string;
      data: CreateReportRequest;
    }) => moderationService.reportComment(commentId, data),
    onSuccess: () => {
      toast.success("Comment reported successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to report comment");
    },
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data?: BlockUserRequest;
    }) => moderationService.blockUser(userId, data),
    onSuccess: () => {
      toast.success("User blocked successfully");
      queryClient.invalidateQueries({ queryKey: ["seller"] });
      queryClient.invalidateQueries({ queryKey: ["ad"] });
      // Invalidate specific queries if needed
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to block user");
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => moderationService.unblockUser(userId),
    onSuccess: () => {
      toast.success("User unblocked successfully");
      queryClient.invalidateQueries({ queryKey: ["seller"] });
      queryClient.invalidateQueries({ queryKey: ["ad"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to unblock user");
    },
  });
};

export const useBlockedUsers = () => {
  return useQuery({
    queryKey: ["blocked-users"],
    queryFn: () => moderationService.getBlockedUsers(),
  });
};

export const useIsUserBlocked = (userId: string) => {
  return useQuery({
    queryKey: ["is-blocked", userId],
    queryFn: () => moderationService.checkIfIsBlocked(userId),
    enabled: !!userId,
  });
};

export const useReportReview = () => {
  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: CreateReportRequest;
    }) => moderationService.reportReview(reviewId, data),
    onSuccess: () => {
      toast.success("Review reported successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to report review");
    },
  });
};

export const useReportChatMessage = () => {
  return useMutation({
    mutationFn: ({
      messageId,
      data,
    }: {
      messageId: string;
      data: CreateReportRequest;
    }) => moderationService.reportChatMessage(messageId, data),
    onSuccess: () => {
      toast.success("Message reported successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to report message");
    },
  });
};
