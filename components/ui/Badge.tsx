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
  label,
  compact = false,
}: {
  count: number;
  style?: StyleProp<ViewStyle>;
  countStyle?: StyleProp<TextStyle>;
  color?: string;
  textColor?: string;
  label?: string;
  compact?: boolean;
}) {
  const { colors, spacing, fontSizes } = useTheme();

  if (!count || count < 1) return null;

  return (
    <View
      style={[
        styles.badge,
        compact && styles.badgeCompact,
        {
          backgroundColor: color || colors.primary,
          paddingHorizontal: compact ? spacing.xs : spacing.sm,
        },
        style,
      ]}
    >
      <AppText
        style={[
          {
            color: textColor || colors.textWhite,
            fontSize: compact ? fontSizes.xs * 0.9 : fontSizes.xs,
          },
          countStyle,
        ]}
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
      >
        {count} {label&& label}
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
  badgeCompact: {
    height: 19,
    borderRadius: 10,
  },
});
