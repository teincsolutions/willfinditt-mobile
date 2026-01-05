import { categoryFieldService } from "@/services/categoryFieldService";
import { useQuery } from "@tanstack/react-query";

// Hook for fetching all fields for a specific category
export const useCategoryFields = (categoryId: string) => {
  return useQuery({
    queryKey: ["categoryFields", categoryId],
    queryFn: () => categoryFieldService.getByCategoryId(categoryId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 1000, // 10 minutes
    refetchOnMount: true,
    enabled: !!categoryId,
  });
};
