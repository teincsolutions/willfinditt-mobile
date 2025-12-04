// queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  },
});

persistQueryClient({
  queryClient,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
});

export default queryClient;
