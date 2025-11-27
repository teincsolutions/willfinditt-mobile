// PrimaryButton.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import AppText from "./AppText";

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
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.linear,
        {
          height: button.height,
          borderRadius: button.radius,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
    >
      <Pressable onPress={onPress} disabled={disabled} style={styles.btn}>
        <AppText variant="lg" style={{ color: "#FFF" }}>
          {loading ? "..." : title}
        </AppText>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linear: {
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
