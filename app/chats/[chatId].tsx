import { ProductCardSmallLandscape } from "@/components/ads/ProductCardSmallLandscape";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInputBar from "@/components/chat/ChatInputBar";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { useAdActions } from "@/hooks/useAds";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages, useCreateChat } from "@/hooks/useChatMessages";
import { useSeller } from "@/hooks/useSeller";
import { useTheme } from "@/hooks/useTheme";
import { formatTime } from "@/lib/formatTime";
import { Chat, Message } from "@/types/chat";
import { Stack } from "expo-router";
import { useGlobalSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { spacing, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    chatId: initialChatId,
    sellerId,
    userId,
    adId,
  } = useGlobalSearchParams<{
    chatId: string;
    sellerId: string;
    userId: string;
    adId: string;
  }>();

  console.log("ChatScreen params:", {
    initialChatId,
    sellerId,
    userId,
    adId,
  });

  const { user } = useAuth();
  const [chatId, setChatId] = useState<string>(initialChatId);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { createChatAsync, isCreating } = useCreateChat();
  const {
    messages,
    chat,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    markAsRead,
    sendMessage,
    isSending,
    isOtherOnline,
  } = useChatMessages(chatId, { adId, receiverId: userId || "" });

  // Determine the other participant
  const otherUser = chat
    ? chat.senderId === user?.id
      ? `${chat.receiver?.firstName} ${chat.receiver?.lastName}`
      : `${chat.sender?.firstName} ${chat.sender?.lastName}`
    : null;

  const { sellerProfile } = useSeller(sellerId);

  const { handleCall } = useAdActions(undefined, sellerProfile);
  // Mark messages as read when entering chat
  useEffect(() => {
    if (chat && !isLoading) {
      markAsRead();
    }
    // Only run when chat.id changes or loading state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?.id, isLoading]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!chatId) {
        try {
          const newChat: Chat = await createChatAsync({
            adId,
            receiverId: userId || "",
          });

          setChatId(newChat.id);
        } catch (error: any) {
          console.log(
            "Failed to create chat:",
            error.response?.data ?? error.message
          );
        }
      }
    };
    initializeChat();
    // Only run once on mount or when these specific values change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, adId, userId]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const sellerNameNoChat = `${sellerProfile?.user?.firstName || ""} ${
    sellerProfile?.user?.lastName || ""
  }`;
  const displayName = chat ? otherUser : sellerNameNoChat || "Chat";

  const handleSendMessage = async (content: string) => {
    try {
    if (content.trim()) {
      await sendMessage({ chatId, content: content.trim() });
    }
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isSender = item.senderId === user?.id;
    return (
      <ChatBubble
        text={item.content || ""}
        time={formatTime(item.createdAt)}
        isSender={isSender}
        isRead={item.isRead}
        isDelivered={!item._tmpId}
      />
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <AppView
        style={{
          padding: spacing.md,
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="small" color={colors.primary} />
      </AppView>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <AppView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.xl,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </AppView>
      );
    }

    return (
      <AppView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.xl,
        }}
      >
        <AppText
          variant="md"
          style={{ color: colors.textGray, textAlign: "center" }}
        >
          No messages yet. Start the conversation!
        </AppText>
      </AppView>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
        <Stack.Screen
          options={{
            header: () => (
              <ChatHeader onCall={handleCall} isOnline={isOtherOnline} name={displayName!} />
            ),
          }}
        />
        <AppView>
          {chat?.adId ? <ProductCardSmallLandscape adId={chat.adId} /> : null}
        </AppView>
        <FlatList
          style={{ backgroundColor: colors.background }}
          inverted
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: spacing.lg + (isKeyboardVisible ? 0 : insets.bottom),
          }}
          stickyHeaderIndices={chat?.adId ? [0] : undefined}
          showsVerticalScrollIndicator={false}
          data={messages.reverse()}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={renderFooter()}
          ListEmptyComponent={renderEmptyState()}
        />
        <ChatInputBar
          onSendMessage={handleSendMessage}
          isSending={isSending || isCreating}
          style={{
            paddingBottom: (isKeyboardVisible ? 0 : insets.bottom) + spacing.sm,
          }}
        />
      </AppView>
    </KeyboardAvoidingView>
  );
}
