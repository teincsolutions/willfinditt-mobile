import { Category } from "@/types";
import { storage } from "@/utils/mmkvStorage";
import { useCallback } from "react";
import { useMMKVObject } from "react-native-mmkv";

const SELECTED_CATEGORY_KEY = "selected-category";
const SELECTED_PARENT_CATEGORY_KEY = "selected-parent-category";

/**
 * Hook for managing category selection state using MMKV storage
 * Used for creating or editing ads with category context
 */
export const useCategorySelection = () => {
  // Use MMKV reactive hooks for automatic re-renders
  const [selectedCategory, setSelectedCategory] = useMMKVObject<Category>(
    SELECTED_CATEGORY_KEY,
    storage
  );

  const [selectedParentCategory, setSelectedParentCategory] =
    useMMKVObject<Category>(SELECTED_PARENT_CATEGORY_KEY, storage);

  // Clear all category selections
  const clearCategorySelection = useCallback(() => {
    setSelectedCategory(undefined);
    setSelectedParentCategory(undefined);
  }, [setSelectedCategory, setSelectedParentCategory]);

  return {
    selectedCategory: selectedCategory || null,
    selectedParentCategory: selectedParentCategory || null,
    setSelectedCategory,
    setSelectedParentCategory,
    clearCategorySelection,
  };
};
