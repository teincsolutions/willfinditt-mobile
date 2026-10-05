import { useTheme } from "@/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

type Props = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export default function IconButton({
  onPress,
  style,
  icon,
  disabled,
  accessibilityLabel,
  accessibilityHint,
}: Props) {
  const { icons, iconButton, colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      // 40px visual keeps existing layouts intact; hitSlop expands the
      // tappable area past the 44px minimum.
      hitSlop={8}
      android_ripple={{ color: colors.backgroundGray, borderless: true }}
      style={({ pressed }) => [
        styles.button,
        {
          height: iconButton.size,
          width: iconButton.size,
          borderRadius: iconButton.radius,
          backgroundColor: pressed
            ? colors.backgroundGray
            : colors.background,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      disabled={disabled}
    >
      {icon ? (
        icon
      ) : (
        <Entypo
          name="chevron-with-circle-left"
          color={colors.iconBlack}
          size={icons.md}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});
