import { useTheme } from "@/contexts/ThemeContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    TextInput,
    ViewStyle,
} from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import IconButton from "../ui/IconButton";

interface ChatInputBarProps {
  onSendMessage: (message: string) => void;
  onAttachment?: () => void;
  isSending?: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
  uploadStatus?: { current: number; total: number };
  style?: StyleProp<ViewStyle>;
}

export default function ChatInputBar({
  onSendMessage,
  onAttachment,
  isSending = false,
  isUploading = false,
  uploadProgress = 0,
  uploadStatus,
  style,
}: ChatInputBarProps) {
  const { colors, spacing, icons, radius } = useTheme();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !isSending) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const isDisabled = isSending || isUploading;

  return (
    <AppView>
      {isUploading && (
        <AppView
          style={{
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            backgroundColor: colors.backgroundPrimary,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <ActivityIndicator size="small" color={colors.primary} />
          <AppText variant="sm" style={{ color: colors.textGray }}>
            {uploadStatus && uploadStatus.total > 1
              ? `Uploading file ${uploadStatus.current} of ${uploadStatus.total}... ${uploadProgress}%`
              : `Uploading... ${uploadProgress}%`}
          </AppText>
        </AppView>
      )}
      <AppView
        style={[
          styles.wrap,
          {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            borderTopColor: colors.border,
            backgroundColor: colors.backgroundPrimary,
          },
          style,
        ]}
      >
        <IconButton
          style={{ backgroundColor: "transparent" }}
          icon={
            <Feather name="smile" size={icons.md} color={colors.iconGray} />
          }
        />

        <TextInput
          placeholder="Write a message..."
          placeholderTextColor={colors.textGray}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={1000}
          editable={!isDisabled}
          style={[
            styles.input,
            {
              minHeight: 40,
              marginHorizontal: spacing.sm,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              color: colors.text,
              backgroundColor: colors.background,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
          onSubmitEditing={handleSend}
        />

        {message.trim() ? (
          <IconButton
            onPress={handleSend}
            disabled={isSending}
            style={{ backgroundColor: colors.primary }}
            icon={
              <Ionicons name="send" size={icons.md} color={colors.iconWhite} />
            }
          />
        ) : (
          <IconButton
            onPress={onAttachment}
            disabled={isDisabled}
            style={{ backgroundColor: "transparent" }}
            icon={
              <Feather
                name="paperclip"
                size={icons.md}
                color={colors.iconGray}
              />
            }
          />
        )}
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
  },
  mic: {},
});
