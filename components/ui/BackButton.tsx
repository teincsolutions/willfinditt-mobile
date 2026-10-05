import { useTheme } from "@/contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

interface BackButtonProps {
  tintColor?: string;
  label?: string;
  href?: string;
  style?: StyleProp<ViewStyle>;
  canGoBack?: boolean;
  showIcon?: boolean;
  hideLabel?: boolean;
  backgroundColor?: string;
}

// Minimum recommended touch target (Apple HIG / WCAG 2.5.8).
const TOUCH_TARGET = 44;

export const BackButton: React.FC<BackButtonProps> = ({
  tintColor,
  label = "Back",
  style,
  canGoBack = true,
  showIcon = true,
  hideLabel = true,
  backgroundColor,
}) => {
  const { icons, spacing, colors, fontSizes } = useTheme();
  const disabled = !canGoBack;

  const handleBack = () => {
    // router.back() pops whether the current screen is a stack push or a
    // modal sheet; router.dismiss() only ever closes modals, which left
    // the back button dead on every pushed screen using this component.
    if (disabled) return;
    if (router.canGoBack()) {
      router.back();
    }
  };

  const a11yLabel = label || "Go back";

  // Text-only variant (e.g. "Cancel").
  if (!showIcon) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        accessibilityHint="Goes back to the previous screen"
        accessibilityState={{ disabled }}
        onPress={handleBack}
        disabled={disabled}
        hitSlop={8}
        android_ripple={{
          color: colors.backgroundGray,
          borderless: false,
        }}
        style={({ pressed }) => [
          styles.textButton,
          {
            minHeight: TOUCH_TARGET,
            paddingHorizontal: spacing.sm,
            backgroundColor: pressed
              ? colors.backgroundGray
              : "transparent",
            opacity: disabled ? 0.4 : 1,
          },
          style,
        ]}
      >
        <AppText
          variant="lg"
          style={{ color: tintColor || colors.text, fontWeight: "500" }}
          maxFontSizeMultiplier={1.25}
        >
          {a11yLabel}
        </AppText>
      </Pressable>
    );
  }

  // Circular icon button (default). Fixed 44x44 so header titles stay
  // centered regardless of back-button presence.
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint="Goes back to the previous screen"
      accessibilityState={{ disabled }}
      onPress={handleBack}
      disabled={disabled}
      hitSlop={8}
      android_ripple={{ color: colors.backgroundGray, borderless: true }}
      style={({ pressed }) => [
        styles.circle,
        {
          width: TOUCH_TARGET,
          height: TOUCH_TARGET,
          borderRadius: TOUCH_TARGET / 2,
          backgroundColor: pressed
            ? colors.backgroundGray
            : (backgroundColor ?? colors.background),
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
    >
      <MaterialIcons
        name="arrow-back"
        size={icons.md}
        color={tintColor || colors.iconBlack}
      />
      {!hideLabel && label ? (
        <AppText
          variant="lg"
          style={{
            color: tintColor || colors.text,
            fontWeight: "500",
            fontSize: fontSizes.md,
            marginLeft: spacing.xs,
          }}
          maxFontSizeMultiplier={1.25}
        >
          {label}
        </AppText>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  circle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
});
