// SecondaryTextButton.tsx
import { FontSizeKey } from "@/constants";
import { useTheme } from "@/hooks/useTheme";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

type Props = {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  variant?: FontSizeKey;
  isLeft?: boolean;
  icon?: ReactNode;
  underline?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
};

export default function SecondaryTextButton({
  title,
  variant = "md",
  underline,
  icon,
  isLeft,
  titleStyle,
  style,
  disabled,
  loading,
  onPress,
}: Props) {
  const { spacing, colors } = useTheme();

  return (
    <Pressable
      style={[
        styles.row,
        { gap: spacing.sm, paddingVertical: spacing.sm },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {!!isLeft && icon}
      <AppText
        variant={variant}
        style={[underline && { textDecorationLine: "underline", opacity: disabled ? 0.5 : 1 }, titleStyle]}
      >
        {title}
      </AppText>
      {loading && <ActivityIndicator size="small" color={colors.accent} />}

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
});
