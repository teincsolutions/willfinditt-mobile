import { adService } from "@/services/adService";
import {
  Ad,
  AdSearchParams,
  AdSearchRequest,
  AdSearchSuggestionsParams,
  AdStatus,
  CreateAdRequest,
  SellerProfile,
  UpdateAdRequest,
} from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert, Linking, Share } from "react-native";
import { toast } from "sonner-native";
import { AD_QUERY_KEYS, SELLER_QUERY_KEYS } from "./queryKeys";
import { useAuth } from "./useAuth";

const fontendUrl =
  process.env.EXPO_PUBLIC_FRONTEND_URL || "https://willfinditt.com";
// Hook for infinite scrolling ads (basic endpoint - /ads)

export const useInfiniteAds = (params?: AdSearchParams) => {
  return useInfiniteQuery({
    queryKey: AD_QUERY_KEYS.ADS_INFINITE(params),
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching a single ad
export const useAd = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: AD_QUERY_KEYS.AD(id),
    queryFn: () => adService.getById(id),
    enabled: !!id && enabled,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 60 * 1000, // 1 minute
  });
};

// Hook for infinite scrolling advanced search results (/ads/search with graph-like request)
export const useInfiniteSearchAds = (
  params: AdSearchRequest,
  enabled: boolean = true
) => {
  return useInfiniteQuery({
    queryKey: AD_QUERY_KEYS.ADS_SEARCH_INFINITE(params),
    queryFn: ({ pageParam = 1 }: { pageParam: number }) =>
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
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - cached for quick return
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for search suggestions (single page - ideal for autocomplete dropdowns)
export const useSearchSuggestions = (
  params: AdSearchSuggestionsParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: AD_QUERY_KEYS.ADS_SEARCH_SUGGESTIONS(params),
    queryFn: async () => await adService.searchSuggestions(params),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - backend has Redis cache
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
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.AD() });
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_MY_STATS,
      });
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_MY_PROFILE,
      });
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.MY_ADS() });
      return newAd;
    },
    onError: (error: any) => {
      // Error is available via createAdMutation.error - don't re-throw
      console.error("Error creating ad:", error);
    },
  });

  return createAdMutation;
};

export const useUpdateAd = () => {
  const queryClient = useQueryClient();
  // Update mutation
  const updateAdMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAdRequest }) => {
      return await adService.update(id, data);
    },
    onSuccess: (result, variables) => {
      queryClient.setQueryData(AD_QUERY_KEYS.AD(variables.id), result);
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.AD() });
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.MY_ADS() });
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_MY_STATS,
      });
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_MY_PROFILE,
      });
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.ADS_INFINITE() });
    },
    onError: (error: any) => {
      // Error is available via updateAdMutation.error - don't re-throw
      console.error("Error updating ad:", error);
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
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.MY_ADS() });
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_MY_STATS,
      });
      queryClient.invalidateQueries({
        queryKey: SELLER_QUERY_KEYS.SELLER_MY_PROFILE,
      });
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.ADS_INFINITE() });
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
  const { isAuthenticated } = useAuth();
  return useInfiniteQuery({
    queryKey: AD_QUERY_KEYS.MY_ADS(params),
    queryFn: async ({ pageParam = 1 }) =>
      await adService.getMyAds({ ...params, page: pageParam }),
    enabled: isAuthenticated,
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
    refetchOnMount: "always",
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
      queryClient.invalidateQueries({
        queryKey: AD_QUERY_KEYS.ADS_SAVED_INFINITE(),
      });
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.AD(adId) });
      // Also invalidate infinite ads queries to update isSaved status
      queryClient.invalidateQueries({ queryKey: AD_QUERY_KEYS.ADS_INFINITE() });
      queryClient.invalidateQueries({
        queryKey: AD_QUERY_KEYS.ADS_SEARCH_INFINITE(),
      });
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

export const useInfiniteSavedAds = (params?: { limit?: number }) => {
  const { isAuthenticated } = useAuth();

  return useInfiniteQuery({
    queryKey: AD_QUERY_KEYS.ADS_SAVED_INFINITE(params),
    queryFn: ({ pageParam = 1 }) =>
      adService.getSavedAds({ ...params, page: pageParam }),
    enabled: !!isAuthenticated,
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

export const useAdActions = (ad?: Ad, seller?: SellerProfile) => {
  const { isAuthenticated, user } = useAuth();

  const handleCall = () => {
    if (!isAuthenticated) {
      handleLogin();
      return;
    }
    if (ad?.user?.phone) Linking.openURL(`tel:${ad.user?.phone}`);
  };

  const handleLogin = () => {
    Alert.alert("Login", "Do you want to login now?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          router.push("/(auth)/login");
        },
      },
    ]);
  };

  const handleMessage = () => {
    if (!isAuthenticated) {
      handleLogin();
      return;
    }

    if ((ad?.user?.sellerProfile || seller) && ad?.userId !== user?.id) {
      router.push({
        pathname: "/chats/[chatId]",
        params: {
          chatId: "",
          adId: ad?.id,
          userId: ad?.userId || seller?.userId || "",
          sellerId: ad?.user?.sellerProfile?.id || seller?.id || "",
        },
      });
    } else if (ad && ad.userId === user?.id) {
      toast.dismiss("You cannot message yourself.");
    }
  };

  const handleShare = () => {
    if (ad?.userId || seller) {
      // Share profile link
      Share.share({
        message: `Check out this seller: ${
          ad?.user?.sellerProfile
            ? `${fontendUrl}/ads/seller/${ad.user.sellerProfile.id}`
            : `${fontendUrl}/ads/seller/${seller?.id}`
        }`,
      });
    }
  };

  const handleShareAd = () => {
    if (ad) {
      Share.share({
        message: `Check out this ad: ${ad.title}\n\nView it here: ${fontendUrl}/ads/${ad.id}`,
      });
    }
  };

  const handleProfilePress = () => {
    if (ad?.userId || seller) {
      router.push({
        pathname: "/ads/seller/[sellerId]",
        params: { sellerId: ad?.user?.sellerProfile?.id || seller?.id || "" },
      });
    }
  };

  return {
    handleCall,
    handleMessage,
    handleShare,
    handleShareAd,
    handleProfilePress,
  };
};
