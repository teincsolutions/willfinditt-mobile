// HeaderBack.tsx
import { useTheme } from "@/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import React, { ReactNode } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

type Props = {
  onPress?: () => void;
  style?: ViewStyle;
  icon?: ReactNode;
};

export default function IconButton({ onPress, style }: Props) {
  const { icons, iconButton, colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          height: iconButton.size,
          width: iconButton.size,
          borderRadius: iconButton.radius,
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      <Entypo
        name="chevron-with-circle-left"
        color={colors.iconBlack}
        size={icons.md}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});
