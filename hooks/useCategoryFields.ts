import { useQuery } from "@tanstack/react-query";
import { categoryFieldService } from "@/services/categoryFieldService";

// Hook for fetching all fields for a specific category
export const useCategoryFields = (categoryId: string) => {
  return useQuery({
    queryKey: ["categoryFields", categoryId],
    queryFn: () => categoryFieldService.getByCategoryId(categoryId),
    enabled: !!categoryId,
  });
};
