import { AdCondition, AdSearchParams } from "@/types";
import { useCallback } from "react";
import { useMMKVObject } from "react-native-mmkv";

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
  // Use MMKV reactive hook for automatic re-renders
  const [filters, setFiltersState] =
    useMMKVObject<AdSearchParams>(SEARCH_FILTERS_KEY);

  const currentFilters = filters || DEFAULT_FILTERS;

  // Update all filters
  const setFiltersFunc = useCallback(
    (newFilters: Partial<AdSearchParams>) => {
      const updated = { ...currentFilters, ...newFilters };
      setFiltersState(updated);
    },
    [currentFilters, setFiltersState]
  );

  // Set search query
  const setQuery = useCallback(
    (query: string | undefined) => {
      const updated = { ...currentFilters, query, page: 1 };
      setFiltersState(updated);
    },
    [currentFilters, setFiltersState]
  );

  // Set category (single value as array)
  const setCategoryId = useCallback(
    (categoryId: string | undefined) => {
      const updated = {
        ...currentFilters,
        categoryIds: categoryId ? [categoryId] : undefined,
        page: 1,
      };
      setFiltersState(updated);
    },
    [currentFilters, setFiltersState]
  );

  // Set city (single value as array)
  const setCityId = useCallback(
    (cityId: string | undefined) => {
      const updated = {
        ...currentFilters,
        cityIds: cityId ? [cityId] : undefined,
        page: 1,
      };
      setFiltersState(updated);
    },
    [currentFilters, setFiltersState]
  );

  // Set conditions
  const setConditions = useCallback(
    (conditions: AdCondition[] | undefined) => {
      const updated = { ...currentFilters, conditions, page: 1 };
      setFiltersState(updated);
    },
    [currentFilters, setFiltersState]
  );

  // Set price range
  const setPriceRange = useCallback(
    (priceMin: number | undefined, priceMax: number | undefined) => {
      console.log(
        "Setting price range to:",
        priceMin,
        priceMax,
        "currentFilters:",
        currentFilters
      );
      setFiltersState((prev) => {
        return { ...prev, priceMin: priceMin, priceMax: priceMax, page: 1 };
      });
    },
    [currentFilters, setFiltersState]
  );

  // Set sorting
  const setSorting = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => {
      const updated = { ...currentFilters, sortBy, sortOrder, page: 1 };
      setFiltersState(updated);
    },
    [currentFilters, setFiltersState]
  );

  // Set field values (dynamic category fields)
  const setFieldValues = useCallback(
    (fieldValues: { categoryFieldId: string; value: string }[] | undefined) => {
      const updated = { ...currentFilters, fieldValues, page: 1 };
      setFiltersState(updated);
    },
    [currentFilters, setFiltersState]
  );

  // Set page
  const setPage = useCallback(
    (page: number) => {
      const updated = { ...currentFilters, page };
      setFiltersState(updated);
    },
    [currentFilters, setFiltersState]
  );

  // Clear all filters (reset to defaults)
  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, [setFiltersState]);

  // Clear specific filters but keep query
  const clearFilterOptions = useCallback(() => {
    const updated = {
      ...DEFAULT_FILTERS,
      query: currentFilters.query,
    };
    setFiltersState(updated);
  }, [currentFilters, setFiltersState]);

  // Get single categoryId from array
  const categoryId = currentFilters.categoryIds?.[0];

  // Get single cityId from array
  const cityId = currentFilters.cityIds?.[0];

  // Count active filters (excluding query, page, limit, sortBy, sortOrder)
  const activeFiltersCount =
    (currentFilters.categoryIds?.length || 0) +
    (currentFilters.cityIds?.length || 0) +
    (currentFilters.conditions?.length || 0) +
    (currentFilters.priceMin !== undefined ||
    currentFilters.priceMax !== undefined
      ? 1
      : 0) +
    (currentFilters.fieldValues?.length || 0);

  return {
    filters,
    categoryId,
    cityId,
    activeFiltersCount,
    setFilters: setFiltersFunc,
    setQuery,
    setCategoryId,
    setCityId,
    setConditions,
    setPriceRange,
    setSorting,
    setFieldValues,
    setPage,
    clearFilters,
    clearFilterOptions,
  };
};
