// SecondaryTextButton.tsx
import { FontSizeKey } from "@/constants";
import { useTheme } from "@/hooks/useTheme";
import React, { ReactNode } from "react";
import {
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
  onPress,
}: Props) {
  const { spacing } = useTheme();

  return (
    <Pressable
      style={[
        styles.row,
        { gap: spacing.sm, paddingVertical: spacing.sm },
        style,
      ]}
      onPress={onPress}
    >
      {!!isLeft && icon}
      <AppText
        variant={variant}
        style={[underline && { textDecorationLine: "underline" }, titleStyle]}
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
});
