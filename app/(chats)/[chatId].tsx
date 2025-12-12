import { ProductCardSmallLandscape } from "@/components/ads/ProductCardSmallLandscape";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInputBar from "@/components/chat/ChatInputBar";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useTheme } from "@/hooks/useTheme";
import { formatTime } from "@/lib/formatTime";
import { Message } from "@/types/chat";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { spacing, colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

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
  } = useChatMessages(chatId);

  // Mark messages as read when entering chat
  useEffect(() => {
    if (chat && !isLoading) {
      markAsRead();
    }
  }, [chat, isLoading]);

  // Determine the other participant
  const otherUser = chat
    ? chat.senderId === user?.id
      ? chat.receiver
      : chat.sender
    : null;

  const displayName = otherUser
    ? [otherUser.firstName, otherUser.lastName].filter(Boolean).join(" ") ||
      otherUser.username
    : "Chat";

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      sendMessage({ content: content.trim() });
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
        isTemp={!!item._tmpId}
        isDelivered={item._isDelivered}
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
            header: () => <ChatHeader isOnline={isOtherOnline} name={displayName} />,
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
            paddingBottom: spacing.lg + insets.bottom,
          }}
          stickyHeaderIndices={chat?.adId?[0]:undefined}
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
        <ChatInputBar onSendMessage={handleSendMessage} isSending={isSending} />
      </AppView>
    </KeyboardAvoidingView>
  );
}
