// SocialLoginRow.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";
import AppText from "../ui/AppText";

type Props = {
  onGoogle: () => void;
  onApple: () => void;
  loading?: boolean;
};

export default function SocialLogins({ onGoogle, onApple, loading }: Props) {
  const { colors, spacing, button, radius, icons } = useTheme();

  return (
    <View style={[styles.row, { gap: spacing.md }]}>
      <Pressable
        style={[
          styles.box,
          {
            borderColor: colors.border,
            height: button.height,
            borderRadius: radius.xxl,
            opacity: loading ? 0.6 : 1,
          },
        ]}
        onPress={onGoogle}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <>
            <Image
              style={{ height: icons.sm, width: icons.sm }}
              source={require("@/assets/icons/google-logo.png")}
            />
            <AppText style={{ color: colors.textGray, fontWeight: "500" }}>
              Google
            </AppText>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  box: {
    flex: 1,
    borderWidth: 1,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
