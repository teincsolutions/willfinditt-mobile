import { sellerService } from "@/services/sellerService";
import type {
  CreateSellerProfileRequest,
  SellerProfile,
  UpdateSellerProfileRequest,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS, SELLER_QUERY_KEYS } from "./queryKeys";

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
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
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
  const queryClient = useQueryClient();

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
