// queryClient.ts
import { createMMKVPersister } from "@/utils/mmkvQueryPersister";
import { QueryClient } from "@tanstack/react-query";

/**
 * Query Client with MMKV Persistent Storage
 * 
 * Features:
 * - Persistent cache across app restarts
 * - Fast synchronous storage with MMKV
 * - Automatic garbage collection after 30 days
 * - 1 hour stale time for optimal performance
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour - data is considered fresh
      gcTime: 1000 * 60 * 60 * 24 * 30, // 30 days - cache cleanup time
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: true, // Refetch when app comes to foreground
      refetchOnReconnect: true, // Refetch when internet connection is restored
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});

/**
 * MMKV Persister for React Query Cache
 * Provides fast, encrypted persistent storage
 */
export const mmkvPersister = createMMKVPersister();

/**
 * Persist Options for TanStack Query
 * Configure how the cache is persisted to storage
 */
export const persistOptions = {
  persister: mmkvPersister,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  buster: "v1", // Change this to force cache invalidation on app updates
};

export default queryClient;
