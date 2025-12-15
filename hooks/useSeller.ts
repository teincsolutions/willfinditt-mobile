import { sellerService } from "@/services/sellerService";
import type {
  CreateSellerProfileRequest,
  SellerProfile,
  UpdateSellerProfileRequest,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSeller = (sellerId?: string) => {
  const queryClient = useQueryClient();

  // Get my seller profile
  const mySellerProfileQuery = useQuery({
    queryKey: ["seller", "my-profile"],
    queryFn: () => sellerService.getMySellerProfile(),
    enabled: !sellerId, // Only fetch if no sellerId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get seller profile by ID
  const sellerProfileQuery = useQuery({
    queryKey: ["seller", sellerId],
    queryFn: () => {
      if (!sellerId) throw new Error("Seller ID is required");
      return sellerService.getSellerProfile(sellerId);
    },
    enabled: !!sellerId,
    staleTime: 5 * 60 * 1000,
  });

  // Get seller stats
  const sellerStatsQuery = useQuery({
    queryKey: ["seller", sellerId || "my-profile", "stats"],
    queryFn: async () => {
      const id = sellerId || mySellerProfileQuery.data?.id;
      if (!id) throw new Error("Seller ID is required");
      return sellerService.getSellerStats(id);
    },
    enabled: !!sellerId || !!mySellerProfileQuery.data?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
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
      queryClient.setQueryData(["seller", "my-profile"], sellerProfile);
      queryClient.setQueryData(["seller", sellerProfile.id], sellerProfile);
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });

  // Delete seller profile mutation
  const deleteSellerProfileMutation = useMutation({
    mutationFn: (sellerId: string) =>
      sellerService.deleteSellerProfile(sellerId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["seller", "my-profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });

  return {
    // Queries
    sellerProfile: sellerId
      ? sellerProfileQuery.data
      : mySellerProfileQuery.data,
    isLoading: sellerId
      ? sellerProfileQuery.isLoading
      : mySellerProfileQuery.isLoading,
    isError: sellerId
      ? sellerProfileQuery.isError
      : mySellerProfileQuery.isError,
    error: sellerId ? sellerProfileQuery.error : mySellerProfileQuery.error,

    // Stats
    stats: sellerStatsQuery.data,
    isLoadingStats: sellerStatsQuery.isLoading,

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

    // Refetch
    refetch: sellerId
      ? sellerProfileQuery.refetch
      : mySellerProfileQuery.refetch,
  };
};

export const useSellerStats = () =>
  useQuery({
    queryKey: ["seller", "my-stats"],
    queryFn: async () => {
      return sellerService.getMySellerStats();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
