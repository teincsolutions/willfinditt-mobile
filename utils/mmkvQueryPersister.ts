import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { storage } from "./mmkvStorage";

/**
 * MMKV Persister for TanStack Query
 * Provides persistent storage for React Query cache using MMKV
 *
 * This is significantly faster than AsyncStorage and provides
 * synchronous access to cached query data
 */

const QUERY_CACHE_KEY = "REACT_QUERY_OFFLINE_CACHE";

export function createMMKVPersister(): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        storage.set(QUERY_CACHE_KEY, JSON.stringify(client));
      } catch (error) {
        console.error("Error persisting query client:", error);
      }
    },
    restoreClient: async () => {
      try {
        const clientString = storage.getString(QUERY_CACHE_KEY);
        if (!clientString) {
          return undefined;
        }
        return JSON.parse(clientString) as PersistedClient;
      } catch (error) {
        console.error("Error restoring query client:", error);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        storage.remove(QUERY_CACHE_KEY);
      } catch (error) {
        console.error("Error removing query client:", error);
      }
    },
  };
}

export const clearPersistedQueryCache = async () => {
  try {
    storage.remove(QUERY_CACHE_KEY);
  } catch (error) {
    console.error("Error clearing persisted query cache:", error);
  }
};
