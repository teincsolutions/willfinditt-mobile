import { threadGatewayService } from "@/services/threadGatewayService";
import { threadService } from "@/services/threadService";
import { CreateThreadMessageRequest, ThreadMessage } from "@/types";
import * as tokenManager from "@/utils/tokenManager";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner-native";
import { useAuth } from "./useAuth";

// Hook for fetching thread messages
export const useThreadMessages = (
  threadId: string,
  disableAutoRefetch = false
) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["thread-messages", threadId],
    queryFn: () => threadService.getThreadMessages(threadId),
    enabled: !!threadId,
    staleTime: 1000 * 60 * 1, // 1 minute - messages can change frequently
    gcTime: 1000 * 60 * 60, // 60 minutes
  });

  // WebSocket integration for real-time updates
  useEffect(() => {
    if (!threadId) return;

    let mounted = true;

    // Handler for new thread messages
    const onNewThreadMessage = (data: any) => {
      if (!mounted) return;
      if (!data?.message || !data?.thread || data.thread.id !== threadId) return;

      // Insert new message into cache
      queryClient.setQueryData(
        ["thread-messages", threadId],
        (oldData: ThreadMessage[] | undefined) => {
          if (!oldData) return [data.message];
          // Check if message already exists (avoid duplicates)
          const exists = oldData.some(msg => msg.id === data.message.id);
          if (exists) return oldData;
          return [...oldData, data.message];
        }
      );

      // Remove any temporary messages that match this real message
      queryClient.setQueryData(
        ["thread-messages", threadId],
        (oldData: ThreadMessage[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(msg => !msg._tmpId);
        }
      );
    };

    // Register WebSocket event handlers
    threadGatewayService.on("thread.message", onNewThreadMessage);

    // Connect to WebSocket if not already connected
    try {
      const token = tokenManager.getAccessToken();
      if (token && !threadGatewayService.isConnected()) {
        threadGatewayService.connect(token);
      }
    } catch (err) {
      console.error("Thread gateway setup failed:", err);
    }

    // Cleanup function
    return () => {
      mounted = false;
      threadGatewayService.off("thread.message", onNewThreadMessage);
    };
  }, [threadId, queryClient]);

  return query;
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

// Hook for sending a message to a thread
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ threadId, data }: { threadId: string; data: CreateThreadMessageRequest }) =>
      threadService.addMessageToThread(threadId, data),
    onMutate: async ({ threadId, data }) => {
      if (!user) return;

      // Create a temp id and message
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const tempMessage: ThreadMessage = {
        id: tempId,
        threadId,
        userId: user.id,
        content: data.content,
        isSystem: data.isSystem || false,
        createdAt: new Date().toISOString(),
        _tmpId: tempId,
      };

      // Insert temp message into cache
      queryClient.setQueryData(
        ["thread-messages", threadId],
        (oldData: ThreadMessage[] | undefined) => {
          if (!oldData) return [tempMessage];
          return [...oldData, tempMessage];
        }
      );

      return { tempId, threadId };
    },
    onSuccess: (response, { threadId }, context) => {
      if (context?.tempId) {
        // Remove temp message and let the real data replace it
        queryClient.setQueryData(
          ["thread-messages", threadId],
          (oldData: ThreadMessage[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter(msg => msg.id !== context.tempId);
          }
        );
      }
      // Invalidate to get fresh data
      queryClient.invalidateQueries({ queryKey: ["thread-messages", threadId] });
      toast.success("Message sent!");
    },
    onError: (error: any, { threadId }, context) => {
      // Remove temp message on error
      if (context?.tempId) {
        queryClient.setQueryData(
          ["thread-messages", threadId],
          (oldData: ThreadMessage[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter(msg => msg.id !== context.tempId);
          }
        );
      }
      console.log("Send message error:", error.response);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to send message"
      );
    },
  });
};
