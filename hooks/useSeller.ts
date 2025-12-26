import { sellerService } from "@/services/sellerService";
import type {
  CreateSellerProfileRequest,
  SellerProfile,
  SellerReview,
  UpdateSellerProfileRequest,
} from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner-native";
import { AD_QUERY_KEYS, AUTH_QUERY_KEYS, SELLER_QUERY_KEYS } from "./queryKeys";

export const useMySeller = () => {
  const queryClient = useQueryClient();

  // Get my seller profile
  const mySellerProfileQuery = useQuery({
    queryKey: SELLER_QUERY_KEYS.SELLER_MY_PROFILE,
    queryFn: () => sellerService.getMySellerProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Get my seller stats
  const mySellerStatsQuery = useQuery({
    queryKey: SELLER_QUERY_KEYS.SELLER_MY_STATS,
    queryFn: () => sellerService.getMySellerStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Create seller profile mutation
  const createSellerProfileMutation = useMutation({
    mutationFn: (data: CreateSellerProfileRequest) =>
      sellerService.createSellerProfile(data),
    onSuccess: (sellerProfile: SellerProfile) => {
      // Update cache
      queryClient.setQueryData(["seller", "my-profile"], sellerProfile);
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.ADS_INFINITE() });
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.ADS_SEARCH_INFINITE() });
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.AD() });
    },
  });

  // Update seller profile mutation
  const updateSellerProfileMutation = useMutation({
    mutationFn: ({
      sellerId,
      data,
    }: {
      sellerId: string;
      data: UpdateSellerProfileRequest;
    }) => sellerService.updateSellerProfile(sellerId, data),
    onSuccess: (sellerProfile: SellerProfile) => {
      // Update cache
      queryClient.setQueryData(
        SELLER_QUERY_KEYS.SELLER_MY_PROFILE,
        sellerProfile
      );
      queryClient.setQueryData(
        SELLER_QUERY_KEYS.SELLER_PROFILE(sellerProfile.id),
        sellerProfile
      );
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.AUTH_USER });
    },
    onError: (error: any) => {
      console.log(
        "Failed to update seller profile:",
        error.response?.data || error.message
      );
    },
  });

  // Delete seller profile mutation
  const deleteSellerProfileMutation = useMutation({
    mutationFn: (sellerId: string) =>
      sellerService.deleteSellerProfile(sellerId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_MY_PROFILE,
      });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.AUTH_USER });
    },
  });

  // Submit verification mutation
  const submitVerificationMutation = useMutation({
    mutationFn: (data: any) => sellerService.submitVerification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_MY_PROFILE,
      });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.AUTH_USER });
    },
  });

  // Update verification mutation
  const updateVerificationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      sellerService.updateMyVerification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_MY_PROFILE,
      });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.AUTH_USER });
    },
  });

  return {
    // Queries
    sellerProfile: mySellerProfileQuery.data,
    isLoading: mySellerProfileQuery.isLoading,
    isError: mySellerProfileQuery.isError,
    error: mySellerProfileQuery.error,

    // Stats
    stats: mySellerStatsQuery.data,
    isLoadingStats: mySellerStatsQuery.isLoading,

    // Mutations
    createSellerProfile: createSellerProfileMutation.mutate,
    createSellerProfileAsync: createSellerProfileMutation.mutateAsync,
    isCreating: createSellerProfileMutation.isPending,

    updateSellerProfile: updateSellerProfileMutation.mutate,
    updateSellerProfileAsync: updateSellerProfileMutation.mutateAsync,
    isUpdating: updateSellerProfileMutation.isPending,

    deleteSellerProfile: deleteSellerProfileMutation.mutate,
    deleteSellerProfileAsync: deleteSellerProfileMutation.mutateAsync,
    isDeleting: deleteSellerProfileMutation.isPending,

    // Verification Mutations
    submitVerification: submitVerificationMutation.mutate,
    submitVerificationAsync: submitVerificationMutation.mutateAsync,
    isSubmittingVerification: submitVerificationMutation.isPending,

    updateVerification: updateVerificationMutation.mutate,
    updateVerificationAsync: updateVerificationMutation.mutateAsync,
    isUpdatingVerification: updateVerificationMutation.isPending,

    // Refetch
    refetch: mySellerProfileQuery.refetch,
  };
};

export const useSeller = (sellerId: string) => {
  // Get seller profile by ID
  const sellerProfileQuery = useQuery({
    queryKey: SELLER_QUERY_KEYS.SELLER_PROFILE(sellerId),
    queryFn: () => sellerService.getSellerProfile(sellerId),
    enabled: !!sellerId,
    staleTime: 5 * 60 * 1000,
  });

  // Get seller stats by ID
  const sellerStatsQuery = useQuery({
    queryKey: SELLER_QUERY_KEYS.SELLER_STATS(sellerId),
    queryFn: () => sellerService.getSellerStats(sellerId),
    enabled: !!sellerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    // Queries
    sellerProfile: sellerProfileQuery.data,
    isLoading: sellerProfileQuery.isLoading,
    isError: sellerProfileQuery.isError,
    error: sellerProfileQuery.error,

    // Stats
    stats: sellerStatsQuery.data,
    isLoadingStats: sellerStatsQuery.isLoading,

    // Refetch
    refetch: sellerProfileQuery.refetch,
  };
};

// Hook for fetching seller reviews with pagination
export const useSellerReviews = (sellerId: string, limit = 20) => {
  return useInfiniteQuery({
    queryKey: SELLER_QUERY_KEYS.SELLER_REVIEWS(sellerId),
    queryFn: ({ pageParam = 1 }) =>
      sellerService.getSellerReviews(sellerId, pageParam, limit),
    enabled: !!sellerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.meta.page > 1) {
        return firstPage.meta.page - 1;
      }
      return undefined;
    },
  });
};

// Hook for creating seller reviews
export const useCreateSellerReview = () => {
  const queryClient = useQueryClient();

  const createSellerReviewMutation = useMutation({
    mutationFn: (data: { sellerId: string; rating: number; comment?: string }) =>
      sellerService.createSellerReview(data),
    onSuccess: (newReview: SellerReview) => {
      // Invalidate seller reviews for the reviewed seller
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_REVIEWS(newReview.sellerId),
      });
      // Invalidate my reviews
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_MY_REVIEWS,
      });
      // Invalidate seller stats
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_STATS(newReview.sellerId),
      });
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.AD() });
      toast.success("Review submitted successfully");
    },
  });

  return {
    createSellerReview: createSellerReviewMutation.mutate,
    createSellerReviewAsync: createSellerReviewMutation.mutateAsync,
    isCreatingReview: createSellerReviewMutation.isPending,
  };
};
