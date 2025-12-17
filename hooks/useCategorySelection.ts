import { Category } from "@/types";
import { mmkvStorage } from "@/utils/mmkvStorage";
import { useCallback, useState } from "react";

const SELECTED_CATEGORY_KEY = "selected-category";
const SELECTED_PARENT_CATEGORY_KEY = "selected-parent-category";

/**
 * Hook for managing category selection state using MMKV storage
 * Used for creating or editing ads with category context
 */
export const useCategorySelection = () => {
  // Initialize state from MMKV storage
  const [selectedCategory, setSelectedCategoryState] =
    useState<Category | null>(() => {
      return mmkvStorage.getJSON<Category>(SELECTED_CATEGORY_KEY) || null;
    });

  const [selectedParentCategory, setSelectedParentCategoryState] =
    useState<Category | null>(() => {
      return (
        mmkvStorage.getJSON<Category>(SELECTED_PARENT_CATEGORY_KEY) || null
      );
    });

  // Set selected category
  const setSelectedCategory = useCallback((category: Category | null) => {
    if (category) {
      mmkvStorage.setJSON(SELECTED_CATEGORY_KEY, category);
    } else {
      mmkvStorage.removeItem(SELECTED_CATEGORY_KEY);
    }
    setSelectedCategoryState(category);
  }, []);

  // Set selected parent category
  const setSelectedParentCategory = useCallback((category: Category | null) => {
    if (category) {
      mmkvStorage.setJSON(SELECTED_PARENT_CATEGORY_KEY, category);
    } else {
      mmkvStorage.removeItem(SELECTED_PARENT_CATEGORY_KEY);
    }
    setSelectedParentCategoryState(category);
  }, []);

  // Clear all category selections
  const clearCategorySelection = useCallback(() => {
    mmkvStorage.removeItem(SELECTED_CATEGORY_KEY);
    mmkvStorage.removeItem(SELECTED_PARENT_CATEGORY_KEY);
    setSelectedCategoryState(null);
    setSelectedParentCategoryState(null);
  }, []);

  return {
    selectedCategory,
    selectedParentCategory,
    setSelectedCategory,
    setSelectedParentCategory,
    clearCategorySelection,
  };
};
