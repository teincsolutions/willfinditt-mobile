import { categoryFieldService } from "@/services/categoryFieldService";
import { useQuery } from "@tanstack/react-query";

// Hook for fetching all fields for a specific category
// Note: staleTime is 0 to always fetch fresh data when the form mounts,
// preventing 400 errors from stale cached field definitions
export const useCategoryFields = (categoryId: string) => {
  return useQuery({
    queryKey: ["categoryFields", categoryId],
    queryFn: () => categoryFieldService.getByCategoryId(categoryId),
    staleTime: 0, // Always consider data stale - fetch fresh from server
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes only
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!categoryId,
  });
};
