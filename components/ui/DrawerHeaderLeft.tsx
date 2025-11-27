import { useTheme } from "@/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import IconButton from "./IconButton";

interface Props {
  onPress?(): void;
  style?: StyleProp<ViewStyle>;
}

export default function DrawerHeaderLeft({ onPress, style }: Props) {
  const { colors, spacing, icons } = useTheme();

  return (
    <IconButton
      onPress={onPress}
      style={[{ padding: spacing.sm, marginStart: spacing.md }, style]}
      icon={<Entypo name="menu" size={icons.md} color={colors.text} />}
    />
  );
}
