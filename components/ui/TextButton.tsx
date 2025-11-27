// SecondaryTextButton.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import {
  ColorValue,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

type Props = {
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  underline?: boolean;
  isLeft?: boolean;
  icon?: ReactNode;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export function TextButton({
  title,
  underline,
  icon,
  gradientColors,
  isLeft,
  style,
  titleStyle,
  backgroundColor,
  onPress,
}: Props) {
  const { colors, textButton, spacing } = useTheme();
  return (
    <LinearGradient
      colors={gradientColors || [colors.background, colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: textButton.borderRadius }}
    >
      <Pressable
        onPress={onPress}
        style={[
          styles.row,
          textButton,
          {
            backgroundColor: gradientColors
              ? undefined
              : backgroundColor || colors.background,
            gap: spacing.sm,
          },
          style,
        ]}
      >
        {!!isLeft && icon}
        <AppText
          variant="md"
          style={[underline && { textDecorationLine: "underline" }, titleStyle]}
        >
          {title}
        </AppText>

        {!isLeft && icon}
      </Pressable>
    </LinearGradient>
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
