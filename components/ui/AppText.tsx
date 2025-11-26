// AppText.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Text } from "react-native";

type Props = {
  children?: React.ReactNode;
  variant?: "sm" | "md" | "lg" | "xl" | "xxl";
  style?: any;
};

export default function AppText({ children, variant = "md", style }: Props) {
  const { colors, fontSizes } = useTheme();

  return (
    <Text style={[{ color: colors.text, fontSize: fontSizes[variant] }, style]}>
      {children}
    </Text>
  );
}
