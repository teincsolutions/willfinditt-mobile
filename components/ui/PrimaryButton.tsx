// PrimaryButton.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function PrimaryButton({
  title,
  onPress,
  style,
  disabled,
  loading,
}: Props) {
  const { colors, button, spacing } = useTheme();
  const isDisabled = disabled || loading;

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
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.btn, { gap: spacing.md }]}
      >
        <AppText
          variant="lg"
          style={{
            color: colors.textWhite,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          {title}
        </AppText>
        {loading && <ActivityIndicator size="small" color={colors.iconGray} />}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
