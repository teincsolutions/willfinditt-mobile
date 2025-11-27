// AppText.tsx
import { FontSizeKey, FontWeightKey, FontWeights } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

type Props = {
  children?: React.ReactNode;
  variant?: FontSizeKey;
  style?: StyleProp<TextStyle>;
  fontWeight?: FontWeightKey;
  numberOfLines?: number;
};

export default function AppText({
  children,
  variant = "md",
  style,
  numberOfLines,
  fontWeight,
}: Props) {
  const { colors, fontSizes } = useTheme();

  return (
    <Text
      style={[
        {
          color: colors.text,
          fontSize: fontSizes[variant],
          fontWeight: FontWeights[fontWeight || "regular"],
        },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}
