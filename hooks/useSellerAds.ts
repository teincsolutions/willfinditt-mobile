import { adService } from "@/services/adService";
import {
    CategoryGuidelines,
    ResubmitAdRequest,
    SellerPendingAd,
    SellerRejectedAd,
    SellerStats
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { AD_QUERY_KEYS, SELLER_QUERY_KEYS } from "./queryKeys";

// Get seller statistics
export const useSellerStats = () => {
  return useQuery<SellerStats>({
    queryKey: SELLER_QUERY_KEYS.SELLER_MY_STATS,
    queryFn: () => adService.getSellerStats(),
    staleTime: 30000, // 30 seconds
  });
};

// Get seller's pending ads
export const useSellerPendingAds = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery<{ data: SellerPendingAd[] }>({
    queryKey: SELLER_QUERY_KEYS.SELLER_PENDING_ADS(params),
    queryFn: () => adService.getSellerPendingAds(params),
    staleTime: 30000,
  });
};

// Get seller's rejected ads
export const useSellerRejectedAds = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery<{ data: SellerRejectedAd[] }>({
    queryKey: SELLER_QUERY_KEYS.SELLER_REJECTED_ADS(params),
    queryFn: () => adService.getSellerRejectedAds(params),
    staleTime: 30000,
  });
};

// Get category submission guidelines
export const useSellerGuidelines = (categoryId?: string) => {
  return useQuery<CategoryGuidelines>({
    queryKey: SELLER_QUERY_KEYS.SELLER_GUIDELINES(categoryId),
    queryFn: () => adService.getSellerGuidelines(categoryId!),
    enabled: !!categoryId,
    staleTime: 300000, // 5 minutes - guidelines don't change often
  });
};

// Resubmit rejected ad
export const useResubmitAd = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      adId,
      data,
    }: {
      adId: string;
      data: ResubmitAdRequest;
    }) => {
      return adService.resubmitAd(adId, data);
    },
    onSuccess: (result, variables) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_MY_STATS,
      });
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_REJECTED_ADS(),
      });
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_PENDING_ADS(),
      });
      queryClient.invalidateQueries({
        queryKey: AD_QUERY_KEYS.MY_ADS(),
      });
      queryClient.invalidateQueries({
        queryKey: AD_QUERY_KEYS.AD(variables.adId),
      });
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_MY_STATS,
      });

      toast.success("Ad resubmitted successfully", {
        description: "Your ad has been sent for review again.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to resubmit ad", {
        description: error?.message || "An error occurred while resubmitting",
      });
    },
  });

  return {
    resubmit: mutation.mutate,
    resubmitAsync: mutation.mutateAsync,
    isResubmitting: mutation.isPending,
    error: mutation.error,
  };
};
