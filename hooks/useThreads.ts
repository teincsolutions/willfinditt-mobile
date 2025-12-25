import { threadGatewayService } from "@/services/threadGatewayService";
import { threadService } from "@/services/threadService";
import { CreateThreadRequest, ThreadQueryParams } from "@/types";
import * as tokenManager from "@/utils/tokenManager";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner-native";

// Hook for fetching a single thread
export const useThread = (id: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["thread", id],
    queryFn: () => threadService.getThreadById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10,
  });

  // WebSocket integration for real-time thread updates
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    // Handler for thread status changes
    const onThreadStatusChanged = (data: any) => {
      if (!mounted) return;
      if (!data?.thread || data.thread.id !== id) return;

      // Update thread in cache
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    };

    // Handler for thread closed
    const onThreadClosed = (data: any) => {
      if (!mounted) return;
      if (!data?.thread || data.thread.id !== id) return;

      // Update thread in cache
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    };

    // Register WebSocket event handlers
    threadGatewayService.on("thread.status_changed", onThreadStatusChanged);
    threadGatewayService.on("thread.closed", onThreadClosed);

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
      threadGatewayService.off("thread.status_changed", onThreadStatusChanged);
      threadGatewayService.off("thread.closed", onThreadClosed);
    };
  }, [id, queryClient]);

  return query;
};

// Hook for fetching user's threads
export const useThreads = (params?: Omit<ThreadQueryParams, "userId">) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["threads", params],
    queryFn: () => threadService.getMyThreads(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 1, // Refetch every 1 minute to get new threads
  });

  // WebSocket integration for real-time thread updates
  useEffect(() => {
    let mounted = true;

    // Handler for new threads (only admins receive this, but users might get their own threads)
    const onThreadCreated = (data: any) => {
      if (!mounted) return;
      if (!data?.thread) return;

      // Add new thread to cache if it's for the current user
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    };

    // Handler for thread status changes
    const onThreadStatusChanged = (data: any) => {
      if (!mounted) return;
      if (!data?.thread) return;

      // Update thread status in cache
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      queryClient.invalidateQueries({ queryKey: ["thread", data.thread.id] });
    };

    // Handler for thread closed
    const onThreadClosed = (data: any) => {
      if (!mounted) return;
      if (!data?.thread) return;

      // Update thread status in cache
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      queryClient.invalidateQueries({ queryKey: ["thread", data.thread.id] });
    };

    // Register WebSocket event handlers
    threadGatewayService.on("thread.created", onThreadCreated);
    threadGatewayService.on("thread.status_changed", onThreadStatusChanged);
    threadGatewayService.on("thread.closed", onThreadClosed);

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
      threadGatewayService.off("thread.created", onThreadCreated);
      threadGatewayService.off("thread.status_changed", onThreadStatusChanged);
      threadGatewayService.off("thread.closed", onThreadClosed);
    };
  }, [queryClient]);

  return query;
};

// Hook for creating a new thread
export const useCreateThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateThreadRequest) =>
      threadService.createThread(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
    onError: (error: any) => {
      console.log("Create thread error:", error.response);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create thread"
      );
    },
  });
};
