// stores/useRecentSearchStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Suggestion } from '@/types';

interface RecentSearchState {
  recentSearches: Suggestion[];
  addRecent: (suggestion:Suggestion) => void;
  clearRecents: () => void;
}

export const useRecentSearch= create<RecentSearchState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addRecent: (term) => {
        const current = get().recentSearches;
        const updated = [term, ...current.filter(t => t.id !== term.id)].slice(0, 10);
        set({ recentSearches: updated });
      },
      clearRecents: () => set({ recentSearches: [] }),
    }),
    {
      name: 'recent-searches', // storage key
      storage: {
        getItem: async (key) => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
    }
  )
);
