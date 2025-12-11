import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import React, { ReactNode } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function FilterChip({
  label,
  selected = false,
  onPress,
  icon,
  style,
}: FilterChipProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radius.lg,
          backgroundColor: selected ? colors.primary : colors.background,
          borderWidth: 1,
          borderColor: selected ? colors.primary : colors.border,
          gap: spacing.xs,
        },
        style,
      ]}
    >
      {icon}
      <AppText
        variant="sm"
        style={{
          color: selected ? colors.textWhite : colors.text,
          fontWeight: selected ? "600" : "400",
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
