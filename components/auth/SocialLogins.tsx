// SocialLoginRow.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "../ui/AppText";

type Props = {
  onGoogle: () => void;
  onApple: () => void;
};

export default function SocialLogins({ onGoogle, onApple }: Props) {
  const { colors, spacing, button } = useTheme();

  return (
    <View style={[styles.row, { gap: spacing.md }]}>
      <Pressable
        style={[
          styles.box,
          { borderColor: colors.border, height: button.height },
        ]}
        onPress={onGoogle}
      >
        <AppText>Google</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  box: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
