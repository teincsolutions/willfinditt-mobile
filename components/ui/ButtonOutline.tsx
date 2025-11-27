import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import React, { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

export default function ButtonOutline({
  title,
  style,
  icon,
  isRight = false,
  onPress,
}: {
  title: string;
  style?: StyleProp<ViewStyle>;
  isRight?: boolean;
  onPress?: () => void;
  icon?: (props: { color: string; size: number }) => ReactNode;
}) {
  const { colors, spacing, button, icons } = useTheme();
  return (
    <Pressable
      style={[
        styles.btn,
        {
          borderColor: colors.border,
          gap: spacing.sm,
          height: button.height,
          borderWidth: button.borderWidth,
          paddingHorizontal: button.paddingHorizontal,
          borderRadius: button.radius,
        },
        style,
      ]}
      onPress={onPress}
    >
      {icon && !isRight && icon({ color: colors.iconWhite, size: icons.md })}
      <AppText variant="md" style={{ color: colors.textWhite }}>
        {title}
      </AppText>

      {icon && isRight && icon({ color: colors.iconWhite, size: icons.md })}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
