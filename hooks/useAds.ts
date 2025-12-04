import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { adService } from "@/services/adService";
import {
  Ad,
  AdCondition,
  AdStatus,
  CreateAdRequest,
  UpdateAdRequest,
  AdSearchRequest,
} from "@/types";

// Hook for infinite scrolling ads
export const useInfiniteAds = (params?: {
  limit?: number;
  categoryId?: string;
  cityId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: AdCondition;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteQuery({
    queryKey: ["ads-infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      adService.getAll({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta) {
        return undefined;
      }
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for fetching a single ad
export const useAd = (id: string) => {
  return useQuery({
    queryKey: ["ad", id],
    queryFn: () => adService.getById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minutes
    gcTime: 60 * 1000, // 1 minutes
  });
};

// Hook for fetching user's ads
export const useMyAds = (params?: {
  page?: number;
  limit?: number;
  status?: AdStatus;
}) => {
  return useQuery({
    queryKey: ["my-ads", params],
    queryFn: () => adService.getMyAds(params),
    staleTime: 2 * 60 * 1000, // 2 minutes for user's own data
    gcTime: 5 * 60 * 1000,
  });
};

// Hook for fetching saved ads
export const useSavedAds = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["saved-ads", params],
    queryFn: () => adService.getSavedAds(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Hook for infinite scrolling saved ads
export const useInfiniteSavedAds = (params?: { limit?: number }) => {
  return useInfiniteQuery({
    queryKey: ["saved-ads-infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      adService.getSavedAds({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta) {
        return undefined;
      }
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Hook for infinite scrolling search results
export const useInfiniteSearchAds = (params: AdSearchRequest) => {
  return useInfiniteQuery({
    queryKey: ["ads-search-infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      adService.search({
        ...params,
        search: { ...params.search, page: pageParam },
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta) {
        return undefined;
      }
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateAd = () => {
  const queryClient = useQueryClient();
  // Create mutation
  const createAdMutation = useMutation({
    mutationFn: async (data: CreateAdRequest) => {
      return adService.create(data);
    },
    onSuccess: (newAd) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      queryClient.invalidateQueries({ queryKey: ["my-ads"] });
      return newAd;
    },
    onError: (error: any) => {
      throw new Error(error?.message || "Error creating ad");
    },
  });

  return createAdMutation;
};

export const useUpdateAd = () => {
  const queryClient = useQueryClient();
  // Update mutation
  const updateAdMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAdRequest }) => {
      return adService.update(id, data);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["ad"] });
      queryClient.invalidateQueries({ queryKey: ["my-ads"] });
    },
    onError: (error: any) => {
      throw new Error(error?.message || "Error updating ad");
    },
  });

  return updateAdMutation;
};

export const useDeleteAd = () => {
  const queryClient = useQueryClient();
  // Delete mutation
  const deleteAdMutation = useMutation({
    mutationFn: async (id: string) => {
      return adService.delete(id);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["my-ads"] });
      queryClient.invalidateQueries({ queryKey: ["my-ads-infinite"] });
    },
    onError: (error: any) => {
      throw new Error(error?.message || "Error deleting ad");
    },
  });

  return deleteAdMutation;
};

export const useInfiniteMyAds = (params?: {
  limit?: number;
  status?: AdStatus;
}) => {
  return useInfiniteQuery({
    queryKey: ["my-ads-infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      adService.getMyAds({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta) {
        return undefined;
      }
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useSaveAd = () => {
  const queryClient = useQueryClient();
  // Save ad mutation
  const saveAdMutation = useMutation({
    mutationFn: async (adId: string) => {
      return adService.saveAd(adId);
    },
    onSuccess: (_, adId) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["saved-ads"] });
      queryClient.invalidateQueries({ queryKey: ["saved-ads-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["ad", adId] });
      // Also invalidate infinite ads queries to update isSaved status
      queryClient.invalidateQueries({ queryKey: ["ads-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["ads-search-infinite"] });
    },
    onError: (error: any) => {
      throw new Error(error?.message || "Error saving ad");
    },
  });

  return saveAdMutation;
};

export const useUnsaveAd = () => {
  const queryClient = useQueryClient();
  // Unsave ad mutation
  const unsaveAdMutation = useMutation({
    mutationFn: async (adId: string) => {
      return adService.unsaveAd(adId);
    },
    onSuccess: (_, adId) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["saved-ads"] });
      queryClient.invalidateQueries({ queryKey: ["saved-ads-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["ad", adId] });
      // Also invalidate infinite ads queries to update isSaved status
      queryClient.invalidateQueries({ queryKey: ["ads-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["ads-search-infinite"] });
    },
    onError: (error: any) => {
      throw new Error(error?.message || "Error unsaving ad");
    },
  });

  return unsaveAdMutation;
};
