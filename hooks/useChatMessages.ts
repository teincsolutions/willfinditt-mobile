
import { chatGatewaySerivce } from "@/services/chatGatewaySerivce";
import { chatsSerivce, messagesSerivce } from "@/services/chatService";
import { Message, MessageType } from "@/types";
import { tokenManager } from "@/utils/tokenManager";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

// Hook for creating chats
export const useCreateChat = () => {
  const queryClient = useQueryClient();

  const createChatMutation = useMutation({
    mutationFn: ({
      receiverId,
      adId,
    }: {
      receiverId: string;
      adId: string;
    }) => {
      return chatsSerivce.createChat({
        receiverId,
        adId,
      });
    },
    onSuccess: (newChat) => {
      console.log("Chat created successfully:", newChat.id);
      // Invalidate chats query
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error) => {
      console.error("Failed to create chat:", error);
    },
  });

  return {
    createChat: createChatMutation.mutate,
    createChatAsync: createChatMutation.mutateAsync,
    isCreating: createChatMutation.isPending,
    error: createChatMutation.error,
  };
};

export const useChatMessages = (
  chatId?: string,
  options?: { receiverId?: string; adId?: string }
) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isTyping, setIsTyping] = useState(false);

  // Get chat info to determine receiver
  const { data: chat } = useQuery({
    queryKey: ["chat", chatId || ""],
    queryFn: () => chatsSerivce.getChat(chatId || ""),
    enabled: !!chatId,
  });

  // Find the other participant (receiver)
  const receiver = chat
    ? chat.senderId === user?.id
      ? chat.receiver
      : chat.sender
    : null;

  // Track online status for the other participant (real-time)
  const [isOtherOnline, setIsOtherOnline] = useState<boolean | undefined>(receiver?.isOnline);

  // Fetch messages with infinite scroll
  const {
    data: messagesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["chat-messages", chatId || ""],
    queryFn: ({ pageParam = 1 }) =>
      messagesSerivce.listMessages(chatId || "", {
        page: pageParam,
        limit: 20,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta) {
        return undefined;
      }
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!chatId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Flatten messages from all pages
  const messages = messagesData?.pages.flatMap((page) => page.data) ?? [];

  // Send message via WebSocket only. Do not create optimistic temp messages.
  const sendMessageMutation = useMutation<{ ok?: boolean; ack?: any }, unknown, { data: Partial<Message>; customChatId?: string }>(
    {
      // Optimistic update: insert a temp message immediately
      onMutate: async ({ data, customChatId }: { data: Partial<Message>; customChatId?: string }) => {
        if (user == null) return;
        const actualChatId = customChatId || chatId;
        if (!actualChatId) return { actualChatId: null };

        const receiverId = receiver?.id || options?.receiverId;

        // Create a temp id and message
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const tempMessage: Message = {
          id: tempId,
          chatId: actualChatId,
          senderId: user.id,
          receiverId: receiverId || "",
          content: data.content,
          type: data.type || MessageType.TEXT,
          attachments: data.attachments || [],
          isRead: false,
          createdAt: new Date().toISOString(),
          _tmpId: tempId,
          readAt: null,
          sender: {
            id: user.id,
            username: user.username,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            avatar: user.avatar || null,
          }
        };

        // Insert temp message at the start of pages (most recent)
        const previous = queryClient.getQueryData(["chat-messages", actualChatId]);
        queryClient.setQueryData(["chat-messages", actualChatId], (oldData: any) => {
          const incomingPage = { data: [tempMessage], meta: { page: 1, totalPages: 1, total: 1 } };
          if (!oldData) return { pages: [incomingPage], pageParams: [1] };

          const newPages = oldData.pages.map((p: any) => ({ ...p, data: [...p.data] }));
          if (newPages.length > 0) newPages[0].data.push(tempMessage);
          else newPages.push(incomingPage);
          return { ...oldData, pages: newPages };
        });

        // Return context for rollback and to know tempId
        return { previous, actualChatId, tempId };
      },
      onError: (_err, _vars, context: any) => {
        // rollback optimistic update if present
        if (!context || !context.actualChatId) return;
        const { actualChatId, tempId, previous } = context;
        if (previous) {
          queryClient.setQueryData(["chat-messages", actualChatId], previous);
        } else if (tempId) {
          queryClient.setQueryData(["chat-messages", actualChatId], (oldData: any) => {
            if (!oldData) return oldData;
            const newPages = oldData.pages.map((p: any) => ({ ...p, data: p.data.filter((m: any) => m.id !== tempId) }));
            return { ...oldData, pages: newPages };
          });
        }
      },
      onSettled: (_data, _err, vars, context: any) => {
        // Invalidate so the server authoritative messages replace the temp placeholder
        const actualChatId = (vars && (vars.customChatId || chatId)) || context?.actualChatId;
        if (actualChatId) {
          queryClient.invalidateQueries({ queryKey: ["chat-messages", actualChatId] });
          queryClient.invalidateQueries({ queryKey: ["chat", actualChatId] });
          queryClient.invalidateQueries({ queryKey: ["chats"] });
        }
      },
      mutationFn: async ({ data, customChatId }: { data: Partial<Message>; customChatId?: string }) => {
        const actualChatId = customChatId || chatId;
        if (!actualChatId) throw new Error("Cannot send message: no chat ID available");

        const receiverId = receiver?.id || options?.receiverId;
        if (!receiverId) throw new Error("Cannot send message: receiver not found");

        // Ensure socket is connected. If not, attempt to connect using stored token.
        if (!chatGatewaySerivce.isConnected()) {
          try {
            const token = await tokenManager.getToken();
            if (token) chatGatewaySerivce.connect(token);

            // wait up to 2000ms for connection
            const start = Date.now();
            while (!chatGatewaySerivce.isConnected() && Date.now() - start < 2000) {
              // small delay
              // eslint-disable-next-line no-await-in-loop
              await new Promise((r) => setTimeout(r, 100));
            }
          } catch (err) {
            console.warn("Failed to ensure chat socket connected before sending:", err);
          }
        }

        // Join the chat room just in case
        try {
          chatGatewaySerivce.joinChat(actualChatId);
        } catch (e) {
          // ignore
        }

        // Emit the message. Await an ack (if the server provides one) so we can process
        // an authoritative server message or fallback to invalidation when necessary.
        try {
          const ack: any = await chatGatewaySerivce.emit("send_message", {
            chatId: actualChatId,
            receiverId,
            content: data.content,
            type: data.type || "TEXT",
            attachments: data.attachments,
          });

          // Return ack to callers so they can handle it if needed
          return { ok: true, ack } as any;
        } catch (err) {
          console.error("Failed to emit send_message:", err);
          throw err;
        }
      },
    }
  );

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: () => {
      if (!chatId) throw new Error("Cannot mark as read: no chat ID");
      return chatsSerivce.markChatRead(chatId);
    },
    onSuccess: () => {
      // Update chat unread count in cache
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
    },
  });

  const sendMessage = (data: Partial<Message>, customChatId?: string) => {
    return sendMessageMutation.mutateAsync({ data, customChatId });
  };

  // Setup gateway connection and listeners for this chat
  useEffect(() => {
    if (!chatId) return;

    let mounted = true;

    // Handlers (defined synchronously so cleanup can remove them)
    const onNewMessage = (message: Message) => {
      if (!mounted) return;
      if (!message || !message.chatId || message.chatId !== chatId) return;

      // Insert message into cache (defensive). Skip duplicates by message id.
      queryClient.setQueryData(["chat-messages", chatId], (oldData: any) => {
        const incomingPage = { data: [message], meta: { page: 1, totalPages: 1, total: 1 } };
        if (!oldData) return { pages: [incomingPage], pageParams: [1] };

        const newPages = oldData.pages.map((p: any) => ({ ...p, data: [...p.data.filter((m: Message) => !m._tmpId)] }));
        // If a message with same id already exists, skip adding
        const exists = oldData.pages.some((page: any) => page.data.some((m: any) => m.id === message.id));
        if (exists) return oldData;

        // append to first page
        if (newPages.length > 0) newPages[0].data.push(message);
        else newPages.push(incomingPage);

        return { ...oldData, pages: newPages };
      });

      // Update chat summary and unread counts
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
    };

    const onTypingStart = (data: any) => {
      if (!mounted) return;
      if (data?.chatId !== chatId) return;
      setIsTyping(true);
    };

    const onTypingStop = (data: any) => {
      if (!mounted) return;
      if (data?.chatId !== chatId) return;
      setIsTyping(false);
    };

    const onUserOnline = (d: any) => {
      if (!mounted) return;
      const userId = d?.userId || d?.id;
      if (!userId) return;
      if (receiver && userId === receiver.id) setIsOtherOnline(true);
    };

    const onUserOffline = (d: any) => {
      if (!mounted) return;
      const userId = d?.userId || d?.id;
      if (!userId) return;
      if (receiver && userId === receiver.id) setIsOtherOnline(false);
    };

    const onMessageDelivered = (d: any) => {
      if (!mounted) return;
      if (d?.chatId !== chatId) return;
      // up message to delivered
      // Update message status in cache
      queryClient.setQueryData(["chat-messages", chatId], (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((p: any) => ({
          ...p,
          data: p.data.map((m: any) => ({ ...m, _isDelivered: true }))
        }));
        return { ...oldData, pages: newPages };
      });

      // so the UI can refetch authoritative state if needed.
      queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
    };

    const onMessageRead = (d: any) => {
      if (!mounted) return;
      if (d?.chatId !== chatId) return;
      queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    };

    // Register handlers now
    chatGatewaySerivce.on("new_message", onNewMessage);
    chatGatewaySerivce.on("typing_start", onTypingStart);
    chatGatewaySerivce.on("typing_stop", onTypingStop);
    chatGatewaySerivce.on("message_delivered", onMessageDelivered);
    chatGatewaySerivce.on("message_read", onMessageRead);
    chatGatewaySerivce.on("user_online", onUserOnline);
    chatGatewaySerivce.on("user_offline", onUserOffline);

    // Connect and join asynchronously (doesn't affect cleanup registration)
    (async () => {
      try {
        const token = await tokenManager.getToken();
        if (token) {
          chatGatewaySerivce.connect(token);
        }

        // Join the chat room
        chatGatewaySerivce.joinChat(chatId);
      } catch (err) {
        console.error("Chat gateway setup failed:", err);
      }
    })();

    // cleanup
    return () => {
      mounted = false;
      try {
        chatGatewaySerivce.leaveChat(chatId);
        chatGatewaySerivce.off("new_message", onNewMessage);
        chatGatewaySerivce.off("typing_start", onTypingStart);
        chatGatewaySerivce.off("typing_stop", onTypingStop);
        chatGatewaySerivce.off("message_delivered", onMessageDelivered);
        chatGatewaySerivce.off("message_read", onMessageRead);
        chatGatewaySerivce.off("user_online", onUserOnline);
        chatGatewaySerivce.off("user_offline", onUserOffline);
      } catch (e) {
        // ignore
      }
    };
  }, [chatId, queryClient]);

  const markAsRead = () => {
    markAsReadMutation.mutate();
  };
  const ensureChatMutation = useMutation({
    mutationFn: (adId: string) => chatsSerivce.ensureChatForAd(adId),
    onError: (error) => {
      console.error("Failed to create chat:", error);
    },
  });

  return {
    messages,
    chat,
    isLoading,
    isOtherOnline,
    sendMessage,
    isTyping,
    markAsRead,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    isSending: sendMessageMutation.isPending,
    sendError: sendMessageMutation.error,
    ensureChatAsync: ensureChatMutation.mutateAsync,
    isEnsuringChat: ensureChatMutation.isPending,
    createChatError: ensureChatMutation.error,
  };
};
