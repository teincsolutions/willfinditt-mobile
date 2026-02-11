import ChatBubble from "@/components/chat/ChatBubble";
import ChatInputBar from "@/components/chat/ChatInputBar";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { BackButton } from "@/components/ui/BackButton";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useBlockUser, useReportChatMessage } from "@/hooks/useModeration";
import { useSendMessage, useThreadMessages } from "@/hooks/useThreadMessages";
import { useThread } from "@/hooks/useThreads";
import { ThreadStatus } from "@/types/enums";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const {
    data: thread,
    isLoading: threadLoading,
    isFetching: threadFetching,
  } = useThread(threadId!);
  const { data: messages = [], isFetching: messagesFetching } =
    useThreadMessages(threadId!);
  const { user } = useAuth();
  const { colors, spacing, icons } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const sendMessageMutation = useSendMessage();

  const isFetching = threadFetching || messagesFetching;

  const reportSheetRef = useRef<BottomSheet>(null);
  const { mutateAsync: blockUser, isPending: isBlocking } = useBlockUser();
  const { mutateAsync: reportMessage, isPending: isReporting } =
    useReportChatMessage();

  // In a real app, you would fetch thread details to get the participant's user ID
  // For now, we'll assume the other participant is the first message's sender if not current user
  const otherParticipantId = messages.find(
    (msg) => msg.userId !== user?.id,
  )?.userId;

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
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      },
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

  const handleBlockPress = () => {
    if (!otherParticipantId) {
      Alert.alert("Error", "Could not identify user to block.");
      return;
    }
    Alert.alert(
      "Block User",
      "Are you sure you want to block this user? You will no longer receive messages from them.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            try {
              await blockUser({ userId: otherParticipantId });
              router.back(); // Or navigate away from the chat
            } catch (error) {
              // Error handled in hook, e.g., via toast
            }
          },
        },
      ],
    );
  };

  const handleReportPress = () => {
    reportSheetRef.current?.expand();
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
    return (
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <IconButton
          onPress={handleReportPress}
          icon={
            <MaterialIcons name="report" size={icons.sm} color={colors.error} />
          }
        />
        {otherParticipantId && ( // Only show block if we can identify another participant
          <IconButton
            onPress={handleBlockPress}
            icon={
              <Feather name="user-x" size={icons.sm} color={colors.error} />
            }
          />
        )}
      </View>
    );
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
      <AppView style={{ flex: 1, backgroundColor: colors.background }}>
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
            style={{
              paddingBottom:
                (isKeyboardVisible ? 0 : insets.bottom) + spacing.sm,
            }}
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
