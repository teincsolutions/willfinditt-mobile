import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleProp, Switch, View, ViewStyle } from "react-native";
import AppText from "./AppText";

type Props = {
  label?: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function ToggleSwitch({
  label,
  description,
  value,
  onValueChange,
  style,
  disabled = false,
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
          <AppText variant="md" style={{ marginBottom: spacing.xs }}>
            {label}
          </AppText>
        )}
        {description && (
          <AppText
            variant="sm"
            style={{ opacity: 0.6, color: colors.textGray }}
          >
            {description}
          </AppText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.border,
          true: colors.primary,
        }}
        thumbColor={value ? colors.textWhite : colors.iconGray}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}
