// SecondaryTextButton.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React, { ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";
import AppText from "./AppText";

type Props = {
  title: string;
  underline?: boolean;
  isLeft?: boolean;
  icon?: ReactNode;
  onPress?: () => void;
};

export function TextButton({ title, underline, icon, isLeft, onPress }: Props) {
  const { colors, textButton, spacing } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        textButton,
        {
          backgroundColor: colors.background,
          gap: spacing.sm,
        },
      ]}
    >
      {!!isLeft && icon}
      <AppText
        variant="md"
        style={[underline && { textDecorationLine: "underline" }]}
      >
        {title}
      </AppText>

      {!isLeft && icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { marginLeft: 8 },
});
