// AppText.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

type Props = {
  children?: React.ReactNode;
  variant?: "sm" | "md" | "lg" | "xl" | "xxl";
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

export default function AppText({
  children,
  variant = "md",
  style,
  numberOfLines,
}: Props) {
  const { colors, fontSizes } = useTheme();

  return (
    <Text
      style={[{ color: colors.text, fontSize: fontSizes[variant] }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}
