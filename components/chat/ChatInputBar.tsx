import { useTheme } from "@/contexts/ThemeContext";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput } from "react-native";
import AppView from "../ui/AppView";
import IconButton from "../ui/IconButton";

export default function ChatInputBar() {
  const { colors, spacing, icons } = useTheme();

  return (
    <AppView
      style={[
        styles.wrap,
        {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        },
      ]}
    >
      <Feather name="smile" size={icons.md} color={colors.iconGray} />

      <TextInput
        placeholder="Write a message..."
        placeholderTextColor={colors.textGray}
        style={[
          styles.input,
          {
            marginHorizontal: spacing.md,
            color: colors.text,
            backgroundColor: colors.inputBg,
          },
        ]}
      />

      <IconButton
        style={{ backgroundColor: undefined }}
        icon={
          <MaterialCommunityIcons
            name="microphone-message"
            size={icons.md}
            color={colors.iconGray}
          />
        }
      />
      <IconButton
        style={{ backgroundColor: colors.primary }}
        icon={
          <MaterialCommunityIcons
            name="microphone-message"
            size={icons.md}
            color={colors.iconWhite}
          />
        }
      />
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
