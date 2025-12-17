import { AdCondition, AdSearchParams } from "@/types";
import { mmkvStorage } from "@/utils/mmkvStorage";
import { useCallback, useState } from "react";

const SEARCH_FILTERS_KEY = "search-filters";

/**
 * Default search filter values
 */
const DEFAULT_FILTERS: AdSearchParams = {
  page: 1,
  limit: 20,
  query: undefined,
  categoryIds: undefined,
  cityIds: undefined,
  conditions: undefined,
  priceMin: undefined,
  priceMax: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
};

/**
 * Hook for managing search filter state using MMKV storage
 * Used across search screens for consistent filtering
 */
export const useSearchFilters = () => {
  // Initialize state from MMKV storage
  const [filters, setFiltersState] = useState<AdSearchParams>(() => {
    const stored = mmkvStorage.getJSON<AdSearchParams>(SEARCH_FILTERS_KEY);
    return stored || DEFAULT_FILTERS;
  });

  // Update all filters
  const setFilters = useCallback(
    (newFilters: Partial<AdSearchParams>) => {
      const updated = { ...filters, ...newFilters };
      mmkvStorage.setJSON(SEARCH_FILTERS_KEY, updated);
      setFiltersState(updated);
    },
    [filters]
  );

  // Set search query
  const setQuery = useCallback(
    (query: string | undefined) => {
      const updated = { ...filters, query, page: 1 };
      mmkvStorage.setJSON(SEARCH_FILTERS_KEY, updated);
      setFiltersState(updated);
    },
    [filters]
  );

  // Set category (single value as array)
  const setCategoryId = useCallback(
    (categoryId: string | undefined) => {
      const updated = {
        ...filters,
        categoryIds: categoryId ? [categoryId] : undefined,
        page: 1,
      };
      mmkvStorage.setJSON(SEARCH_FILTERS_KEY, updated);
      setFiltersState(updated);
    },
    [filters]
  );

  // Set city (single value as array)
  const setCityId = useCallback(
    (cityId: string | undefined) => {
      const updated = {
        ...filters,
        cityIds: cityId ? [cityId] : undefined,
        page: 1,
      };
      mmkvStorage.setJSON(SEARCH_FILTERS_KEY, updated);
      setFiltersState(updated);
    },
    [filters]
  );

  // Set conditions
  const setConditions = useCallback(
    (conditions: AdCondition[] | undefined) => {
      const updated = { ...filters, conditions, page: 1 };
      mmkvStorage.setJSON(SEARCH_FILTERS_KEY, updated);
      setFiltersState(updated);
    },
    [filters]
  );

  // Set price range
  const setPriceRange = useCallback(
    (priceMin: number | undefined, priceMax: number | undefined) => {
      const updated = { ...filters, priceMin, priceMax, page: 1 };
      mmkvStorage.setJSON(SEARCH_FILTERS_KEY, updated);
      setFiltersState(updated);
    },
    [filters]
  );

  // Set sorting
  const setSorting = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => {
      const updated = { ...filters, sortBy, sortOrder, page: 1 };
      mmkvStorage.setJSON(SEARCH_FILTERS_KEY, updated);
      setFiltersState(updated);
    },
    [filters]
  );

  // Set page
  const setPage = useCallback(
    (page: number) => {
      const updated = { ...filters, page };
      mmkvStorage.setJSON(SEARCH_FILTERS_KEY, updated);
      setFiltersState(updated);
    },
    [filters]
  );

  // Clear all filters (reset to defaults)
  const clearFilters = useCallback(() => {
    mmkvStorage.setJSON(SEARCH_FILTERS_KEY, DEFAULT_FILTERS);
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  // Clear specific filters but keep query
  const clearFilterOptions = useCallback(() => {
    const updated = {
      ...DEFAULT_FILTERS,
      query: filters.query,
    };
    mmkvStorage.setJSON(SEARCH_FILTERS_KEY, updated);
    setFiltersState(updated);
  }, [filters.query]);

  // Get single categoryId from array
  const categoryId = filters.categoryIds?.[0];

  // Get single cityId from array
  const cityId = filters.cityIds?.[0];

  // Count active filters (excluding query, page, limit, sortBy, sortOrder)
  const activeFiltersCount =
    (filters.categoryIds?.length || 0) +
    (filters.cityIds?.length || 0) +
    (filters.conditions?.length || 0) +
    (filters.priceMin !== undefined || filters.priceMax !== undefined ? 1 : 0);

  return {
    filters,
    categoryId,
    cityId,
    activeFiltersCount,
    setFilters,
    setQuery,
    setCategoryId,
    setCityId,
    setConditions,
    setPriceRange,
    setSorting,
    setPage,
    clearFilters,
    clearFilterOptions,
  };
};
