import { useAuthStore } from "@/hooks/useAuth";
import { chatGatewaySerivce } from "@/services/chatGatewaySerivce";
import { chatsSerivce, messagesSerivce } from "@/services/chatService";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

interface SendMessageData {
  content?: string;
  attachments?: string[];
  type?: "TEXT" | "IMAGE" | "FILE" | "LOCATION" | "SYSTEM";
}

export const useChatMessages = (
  chatId?: string,
  options?: { receiverId?: string; adId?: string }
) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

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

  // Send message via WebSocket
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      data,
      customChatId,
    }: {
      data: SendMessageData;
      customChatId?: string;
    }) => {
      const actualChatId = customChatId || chatId;
      if (!actualChatId) {
        throw new Error("Cannot send message: no chat ID available");
      }

      const receiverId = receiver?.id || options?.receiverId;
      if (!receiverId) {
        throw new Error("Cannot send message: receiver not found");
      }

      // Create temporary message for optimistic update
      const tempMessage = {
        id: `temp-${Date.now()}`, // Temporary ID
        chatId: actualChatId,
        senderId: user?.id || "",
        receiverId,
        content: data.content,
        type: data.type || "TEXT",
        attachments: data.attachments || [],
        createdAt: new Date().toISOString(),
        _tmpId: `temp-${Date.now()}`, // Mark as temporary
      };

      // Emit message via WebSocket
      chatGatewaySerivce.emit("send_message", {
        chatId: actualChatId,
        receiverId,
        content: data.content,
        type: data.type || "TEXT",
        attachments: data.attachments,
      });

      // Return the temporary message and chatId
      return { tempMessage, chatId: actualChatId };
    },
    onSuccess: ({ tempMessage, chatId: actualChatId }) => {
      // Add optimistic message to cache immediately
      queryClient.setQueryData(
        ["chat-messages", actualChatId],
        (oldData: any) => {
          if (!oldData) return oldData;
          const newPages = [...oldData.pages];
          const lastPage = newPages[newPages.length - 1];
          if (lastPage && lastPage.data) {
            lastPage.data.push(tempMessage);
          }
          return {
            ...oldData,
            pages: newPages,
          };
        }
      );
    },
  });

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

  const sendMessage = (data: SendMessageData, customChatId?: string) => {
    sendMessageMutation.mutate({ data, customChatId });
  };

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
    sendMessage,
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
