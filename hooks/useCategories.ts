import { categoryService } from "@/services/categoryService";
import { useQuery } from "@tanstack/react-query";

// Hook for fetching parent categories
export const useParentCategories = () => {
  return useQuery({
    queryKey: ["parent-categories"],
    queryFn: () => categoryService.getParents(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Hook for fetching subcategories
export const useSubcategories = (parentId: string) => {
  return useQuery({
    queryKey: ["subcategories", parentId],
    queryFn: async () => await categoryService.getSubcategories(parentId),
    enabled: !!parentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Hook for fetching a single category
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
