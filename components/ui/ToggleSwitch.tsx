import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleProp, Switch, TextStyle, View, ViewStyle } from "react-native";
import AppText from "./AppText";

type Props = {
  label?: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  ios_backgroundColor?: string;
  textStyle?: StyleProp<TextStyle>;
  trackColor?: { false: string; true: string };
  getActiveThumbColor?: (active: boolean) => string;
};

export default function ToggleSwitch({
  label,
  description,
  value,
  onValueChange,
  style,
  disabled = false,
  ios_backgroundColor,
  trackColor,
  textStyle,
  getActiveThumbColor,
}: Props) {
  const { colors, spacing } = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: spacing.sm,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, marginRight: spacing.md }}>
        {label && (
          <AppText
            variant="md"
            style={[{ marginBottom: spacing.xs }, textStyle]}
          >
            {label}
          </AppText>
        )}
        {description && (
          <AppText
            variant="sm"
            style={[{ opacity: 0.6, color: colors.textGray }, textStyle]}
          >
            {description}
          </AppText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={
          trackColor || {
            false: colors.border,
            true: colors.primary,
          }
        }
        thumbColor={
          value
            ? getActiveThumbColor
              ? getActiveThumbColor(true)
              : colors.iconWhite
            : getActiveThumbColor
            ? getActiveThumbColor(false)
            : colors.iconWhite
        }
        ios_backgroundColor={ios_backgroundColor || colors.border}
      />
    </View>
  );
}
