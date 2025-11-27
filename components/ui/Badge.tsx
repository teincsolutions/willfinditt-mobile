// components/Drawer/Badge.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import AppText from "./AppText";

export default function Badge({
  count,
  style,
}: {
  count: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, spacing } = useTheme();

  if (!count || count < 1) return null;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.primary, paddingHorizontal: spacing.sm },
        style,
      ]}
    >
      <AppText style={{ color: colors.textWhite, fontSize: 12 }}>
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
