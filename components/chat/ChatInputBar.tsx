import { useTheme } from "@/contexts/ThemeContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import AppView from "../ui/AppView";
import IconButton from "../ui/IconButton";

interface ChatInputBarProps {
  onSendMessage: (message: string) => void;
  isSending?: boolean;
}

export default function ChatInputBar({
  onSendMessage,
  isSending = false,
}: ChatInputBarProps) {
  const { colors, spacing, icons, radius } = useTheme();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !isSending) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <AppView
      style={[
        styles.wrap,
        {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          borderTopColor: colors.border,
          backgroundColor: colors.backgroundPrimary,
        },
      ]}
    >
      <IconButton
        style={{ backgroundColor: "transparent" }}
        icon={<Feather name="smile" size={icons.md} color={colors.iconGray} />}
      />

      <TextInput
        placeholder="Write a message..."
        placeholderTextColor={colors.textGray}
        value={message}
        onChangeText={setMessage}
        multiline
        maxLength={1000}
        editable={!isSending}
        style={[
          styles.input,
          {
            minHeight: 60,
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
            <Ionicons
              name="send"
              size={icons.md}
              color={colors.iconWhite}
            />
          }
        />
      ) : (
        <IconButton
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
