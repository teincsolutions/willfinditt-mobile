import ChatBubble from "@/components/chat/ChatBubble";
import ChatInputBar from "@/components/chat/ChatInputBar";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { BackButton } from "@/components/ui/BackButton";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useSendMessage, useThreadMessages } from "@/hooks/useThreadMessages";
import { useThread } from "@/hooks/useThreads";
import { ThreadStatus } from "@/types/enums";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ThreadScreen() {
  const insets = useSafeAreaInsets();
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const { data: thread, isLoading: threadLoading, isFetching: threadFetching } = useThread(threadId!);
  const { data: messages = [],  isFetching: messagesFetching } = useThreadMessages(
    threadId!
  );
  const { user } = useAuth();
  const { colors, spacing } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const sendMessageMutation = useSendMessage();

  const isFetching = threadFetching || messagesFetching;

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

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

  const handleSendMessage = (message: string) => {
    sendMessageMutation.mutate({
      threadId: threadId!,
      data: { content: message },
    });
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isSender = item.userId === user?.id;
    const time = new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <ChatBubble
        text={item.content}
        time={time}
        isSender={isSender}
        isDelivered={!item._tmpId}
        isRead={false}
      />
    );
  };

  const getHeaderTitle = () => {
    if (threadLoading && !thread) {
      return "Loading...";
    }
    if (isFetching) {
      return "Loading...";
    }
    return thread?.title || "Thread";
  };

  const renderHeaderRight = () => {
    if (isFetching) {
      return <ActivityIndicator size="small" color={colors.primary} />;
    }
    return null;
  };

  if (!thread && !threadLoading) {
    return (
      <AppView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <AppText>Thread not found</AppText>
      </AppView>
    );
  }

  const isClosed = thread?.status === ThreadStatus.CLOSED;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
        <Stack.Screen
          options={{
            title: getHeaderTitle(),
            header: () => (
              <Header
                title={getHeaderTitle()}
                navRowStyle={{ paddingHorizontal: spacing.md }}
                containerStyle={{ paddingBottom: spacing.sm }}
                left={<BackButton />}
                right={renderHeaderRight()}
              />
            ),
          }}
        />
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{
              paddingVertical: spacing.md,
              flexGrow: 1,
              paddingBottom: insets.bottom,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
        {!isClosed && (
          <ChatInputBar
            onSendMessage={handleSendMessage}
            isSending={sendMessageMutation.isPending}
            style={{ paddingBottom: (isKeyboardVisible ? 0 : insets.bottom) + spacing.sm }}
          />
        )}
        {isClosed && (
          <View
            style={{
              padding: spacing.md,
              backgroundColor: colors.backgroundSecondary,
              alignItems: "center",
              paddingBottom: isKeyboardVisible ? 0 : insets.bottom,
            }}
          >
            <AppText style={{ color: colors.textGray }}>
              This thread is closed. You cannot send new messages.
            </AppText>
          </View>
        )}
      </AppView>
    </KeyboardAvoidingView>
  );
}
