import { useQuery } from "@tanstack/react-query";
import { threadService } from "@/services/threadService";
import { Thread, ThreadQueryParams } from "@/types";

// Hook for fetching a single thread
export const useThread = (id: string) => {
  return useQuery({
    queryKey: ["thread", id],
    queryFn: () => threadService.getThreadById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10,
  });
};

// Hook for fetching user's threads
export const useThreads = (params?: Omit<ThreadQueryParams, "userId">) => {
  return useQuery({
    queryKey: ["threads", params],
    queryFn: () => threadService.getMyThreads(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5,
  });
};
