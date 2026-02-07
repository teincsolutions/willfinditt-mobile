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
import { useUploadUserContent } from "@/hooks/useUpload";
import { formatTime } from "@/lib/formatTime";
import { getSignedUrl } from "@/services/uploadService";
import { Chat, Message } from "@/types/chat";
import { MessageType } from "@/types/enums";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import { useGlobalSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    current: number;
    total: number;
  }>({ current: 0, total: 0 });
  const [processedAttachments, setProcessedAttachments] = useState<
    Record<string, string>
  >({});
  const { createChatAsync, isCreating } = useCreateChat();
  const { mutateAsync: uploadContent, progress: uploadProgress } =
    useUploadUserContent();
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
            error.response?.data ?? error.message,
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

  const sellerNameNoChat = `${sellerProfile?.user?.firstName || ""} ${
    sellerProfile?.user?.lastName || ""
  }`;
  const displayName = chat ? otherUser : sellerNameNoChat || "Chat";

  // Process S3 URLs in attachments to signed URLs
  useEffect(() => {
    const processAttachments = async () => {
      const urlsToProcess: string[] = [];

      // Collect all S3 URLs from messages
      messages.forEach((message) => {
        if (message.attachments && message.attachments.length > 0) {
          message.attachments.forEach((attachment) => {
            const url =
              typeof attachment === "string" ? attachment : attachment.url;
            if (url.startsWith("s3://") && !processedAttachments[url]) {
              urlsToProcess.push(url);
            }
          });
        }
      });

      // Process URLs in batches
      if (urlsToProcess.length > 0) {
        const newProcessed: Record<string, string> = {
          ...processedAttachments,
        };

        for (const s3Url of urlsToProcess) {
          try {
            // Get signed URL with 1 hour expiry
            const signedUrl = await getSignedUrl(s3Url, 3600);
            newProcessed[s3Url] = signedUrl;
          } catch (error) {
            console.error("Failed to get signed URL for:", s3Url, error);
          }
        }

        setProcessedAttachments(newProcessed);
      }
    };

    if (messages.length > 0) {
      processAttachments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  const uploadAndSendFiles = async (
    files: Array<{ uri: string; name: string; type?: string }>,
    messageType: MessageType.IMAGE | MessageType.FILE,
  ) => {
    try {
      setIsUploading(true);
      setUploadStatus({ current: 0, total: files.length });
      const uploadedAttachments: Array<{ url: string; mime: string }> = [];

      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadStatus({ current: i + 1, total: files.length });

        // Create FormData for upload
        const formData = new FormData();
        formData.append("content", {
          uri: file.uri,
          name: file.name,
          type:
            file.type ||
            (messageType === MessageType.IMAGE
              ? "image/jpeg"
              : "application/octet-stream"),
        } as any);
        formData.append("category", "chats");

        // Upload file
        const uploadResult = await uploadContent(formData);

        if (uploadResult?.url) {
          uploadedAttachments.push({
            url: uploadResult.url,
            mime:
              file.type ||
              (messageType === MessageType.IMAGE
                ? "image/jpeg"
                : "application/octet-stream"),
          });
        }
      }

      if (uploadedAttachments.length > 0) {
        // Send message with all attachments
        const count = uploadedAttachments.length;
        const content =
          messageType === MessageType.IMAGE
            ? `📷 ${count} ${count === 1 ? "Image" : "Images"}`
            : `📎 ${count} ${count === 1 ? "File" : "Files"}`;

        await sendMessage({
          content,
          type: messageType,
          attachments: uploadedAttachments,
        });
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      Alert.alert("Upload Failed", "Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadStatus({ current: 0, total: 0 });
    }
  };

  const handleAttachment = () => {
    Alert.alert(
      "Add Attachment",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            try {
              const { status } =
                await ImagePicker.requestCameraPermissionsAsync();
              if (status !== "granted") {
                Alert.alert(
                  "Permission needed",
                  "Camera permission is required to take photos.",
                );
                return;
              }

              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                quality: 0.8,
              });

              if (!result.canceled && result.assets.length > 0) {
                const files = result.assets.map((asset) => ({
                  uri: asset.uri,
                  name: asset.fileName || "image.jpg",
                  type: "image/jpeg",
                }));
                await uploadAndSendFiles(files, MessageType.IMAGE);
              }
            } catch (error) {
              console.error("Error taking photo:", error);
              Alert.alert("Error", "Failed to take photo. Please try again.");
            }
          },
        },
        {
          text: "Photo Library",
          onPress: async () => {
            try {
              const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== "granted") {
                Alert.alert(
                  "Permission needed",
                  "Photo library permission is required.",
                );
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: 5,
              });

              if (!result.canceled && result.assets.length > 0) {
                const files = result.assets.map((asset) => ({
                  uri: asset.uri,
                  name: asset.fileName || "image.jpg",
                  type: "image/jpeg",
                }));
                await uploadAndSendFiles(files, MessageType.IMAGE);
              }
            } catch (error) {
              console.error("Error picking image:", error);
              Alert.alert("Error", "Failed to pick image. Please try again.");
            }
          },
        },
        {
          text: "Document",
          onPress: async () => {
            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
                multiple: true,
              });

              if (!result.canceled && result.assets.length > 0) {
                const files = result.assets.map((asset) => ({
                  uri: asset.uri,
                  name: asset.name,
                  type: asset.mimeType,
                }));
                await uploadAndSendFiles(files, MessageType.FILE);
              }
            } catch (error) {
              console.error("Error picking document:", error);
              Alert.alert(
                "Error",
                "Failed to pick document. Please try again.",
              );
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true },
    );
  };

  const handleSendMessage = async (content: string) => {
    try {
      if (content.trim()) {
        await sendMessage({ content: content.trim() });
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isSender = item.senderId === user?.id;

    // Process attachments to replace S3 URLs with signed URLs
    const processedMessageAttachments = item.attachments?.map((attachment) => {
      const url = typeof attachment === "string" ? attachment : attachment.url;

      // If it's an S3 URL and we have a signed URL for it, use that
      if (url.startsWith("s3://") && processedAttachments[url]) {
        return typeof attachment === "string"
          ? processedAttachments[url]
          : { ...attachment, url: processedAttachments[url] };
      }

      return attachment;
    });

    return (
      <ChatBubble
        text={item.content || ""}
        time={formatTime(item.createdAt)}
        isSender={isSender}
        isRead={item.isRead}
        isDelivered={!item._tmpId}
        attachments={processedMessageAttachments}
        messageType={item.type}
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
              <ChatHeader
                onCall={handleCall}
                isOnline={isOtherOnline}
                name={displayName!}
              />
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
          onAttachment={handleAttachment}
          isSending={isSending || isCreating}
          isUploading={isUploading}
          uploadProgress={uploadProgress.percentage}
          uploadStatus={uploadStatus}
          style={{
            paddingBottom: (isKeyboardVisible ? 0 : insets.bottom) + spacing.sm,
          }}
        />
      </AppView>
    </KeyboardAvoidingView>
  );
}
