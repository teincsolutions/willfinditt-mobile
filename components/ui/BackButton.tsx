import { useTheme } from "@/contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import AppText from "./AppText";

interface BackButtonProps {
  tintColor?: string;
  label?: string;
  href?: string;
  style?: ViewStyle;
  canGoBack?: boolean;
  showIcon?: boolean;
  hideLabel?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  tintColor,
  label = "Back",
  style,
  canGoBack = true,
  showIcon = true,
  hideLabel = false,
}) => {
  const { icons, spacing, colors, radius } = useTheme();
  const handleBack = () => {
    // router.back() pops whether the current screen is a stack push or a
    // modal sheet; router.dismiss() only ever closes modals, which left
    // the back button dead on every pushed screen using this component.
    if (!canGoBack) return;
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={handleBack}
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      {showIcon && (
        <MaterialIcons
          name="arrow-back"
          onPress={handleBack}
          size={icons.md}
          color={tintColor || colors.iconBlack}
        />
      )}
      {!hideLabel && (
        <AppText
          variant="lg"
          style={{ color: tintColor || colors.text, fontWeight: "500" }}
        >
          {label || "Back"}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
