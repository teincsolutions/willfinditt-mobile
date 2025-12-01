// components/Drawer/Badge.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

export default function Badge({
  count,
  style,
  color,
  textColor,
  countStyle,
}: {
  count: number;
  style?: StyleProp<ViewStyle>;
  countStyle?: StyleProp<TextStyle>;
  color?: string;
  textColor?: string;
}) {
  const { colors, spacing, fontSizes } = useTheme();

  if (!count || count < 1) return null;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color || colors.primary,
          paddingHorizontal: spacing.sm,
        },
        style,
      ]}
    >
      <AppText
        style={[
          { color: textColor || colors.textWhite, fontSize: fontSizes.xs },
          countStyle,
        ]}
      >
        {count}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 22,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
