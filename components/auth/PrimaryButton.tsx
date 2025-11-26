// PrimaryButton.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import AppText from "../ui/AppText";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
}: Props) {
  const { colors, button } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        {
          backgroundColor: colors.primary,
          height: button.height,
          borderRadius: button.radius,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
    >
      <AppText variant="lg" style={{ color: "#FFF" }}>
        {loading ? "..." : title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
  },
});
