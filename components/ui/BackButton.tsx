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
  const { icons, spacing, colors } = useTheme();
  const handleBack = () => {
    if (canGoBack) router.dismiss();
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={handleBack}
      style={[styles.container, style, { }]}
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
     { !hideLabel && (
      <AppText
        variant="lg"
        style={{ color: tintColor || colors.text, fontWeight: "500" }}
      >
        {label || "Back"}
      </AppText>)}
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
