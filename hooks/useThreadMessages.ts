import { useQuery } from "@tanstack/react-query";
import { threadService } from "@/services/threadService";
import { ThreadMessage } from "@/types";

// Hook for fetching thread messages
export const useThreadMessages = (
  threadId: string,
  disableAutoRefetch = false
) => {
  return useQuery({
    queryKey: ["thread-messages", threadId],
    queryFn: () => threadService.getThreadMessages(threadId),
    enabled: !!threadId,
    staleTime: 1000 * 60 * 1, // 1 minute - messages can change frequently
    gcTime: 1000 * 60 * 5,
    refetchInterval: disableAutoRefetch ? false : 1000 * 30, // Refetch every 30 seconds to get new messages (unless disabled)
  });
};

// Hook for fetching a single message by ID
export const useThreadMessage = (messageId: string) => {
  return useQuery({
    queryKey: ["thread-message", messageId],
    queryFn: async () => {
      // This would need to be implemented in the service if we need single message fetching
      throw new Error("Single message fetching not implemented");
    },
    enabled: !!messageId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
