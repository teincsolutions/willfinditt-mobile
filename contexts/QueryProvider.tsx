import queryClient, { persistOptions } from "@/lib/query-client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Query Provider with MMKV Persistence
 * 
 * Wraps the app with TanStack Query's PersistQueryClientProvider
 * to enable persistent caching using MMKV storage
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
