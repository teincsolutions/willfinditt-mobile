import { Suggestion } from "@/types";
import { mmkvStorage } from "@/utils/mmkvStorage";
import { useCallback, useState } from "react";

const RECENT_SEARCHES_KEY = "recent-searches";
const MAX_RECENT_SEARCHES = 10;

/**
 * Hook for managing recent search history using MMKV storage
 */
export const useRecentSearch = () => {
  // Initialize state from MMKV storage
  const [recentSearches, setRecentSearches] = useState<Suggestion[]>(() => {
    const stored = mmkvStorage.getJSON<Suggestion[]>(RECENT_SEARCHES_KEY);
    return stored || [];
  });

  // Add a recent search
  const addRecent = useCallback((suggestion: Suggestion) => {
    const current = mmkvStorage.getJSON<Suggestion[]>(RECENT_SEARCHES_KEY) || [];
    // Remove if already exists and add to front, limit to max items
    const updated = [
      suggestion,
      ...current.filter((t) => t.id !== suggestion.id),
    ].slice(0, MAX_RECENT_SEARCHES);
    mmkvStorage.setJSON(RECENT_SEARCHES_KEY, updated);
    setRecentSearches(updated);
  }, []);

  // Clear all recent searches
  const clearRecents = useCallback(() => {
    mmkvStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  }, []);

  // Remove a specific recent search
  const removeRecent = useCallback((id: string) => {
    const current = mmkvStorage.getJSON<Suggestion[]>(RECENT_SEARCHES_KEY) || [];
    const updated = current.filter((t) => t.id !== id);
    mmkvStorage.setJSON(RECENT_SEARCHES_KEY, updated);
    setRecentSearches(updated);
  }, []);

  return {
    recentSearches,
    addRecent,
    clearRecents,
    removeRecent,
  };
};
