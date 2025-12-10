import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { ArrowLeft } from "iconsax-react-nativejs";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import AppText from "./AppText";

interface BackButtonProps {
  tintColor?: string;
  label?: string;
  href?: string;
  style?: ViewStyle;
  canGoBack?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  tintColor,
  label = "Back",
  style,
  canGoBack = true,
}) => {
  const { icons, spacing, colors } = useTheme();
  const handleBack = () => {
    if (canGoBack) router.dismiss();
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={handleBack}
      style={[styles.container, style, { gap: spacing.sm }]}
      activeOpacity={0.7}
    >
      <ArrowLeft onPress={handleBack} size={icons.lg} color={tintColor || colors.iconBlack} />
      <AppText
        variant="lg"
        style={{ color: tintColor || colors.text, fontWeight: "500" }}
      >
        {label || "Back"}
      </AppText>
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
