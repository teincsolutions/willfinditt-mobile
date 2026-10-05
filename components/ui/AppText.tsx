// AppText.tsx
import { FontSizeKey, FontWeightKey, FontWeights } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";

type Props = {
  children?: React.ReactNode;
  variant?: FontSizeKey;
  style?: StyleProp<TextStyle>;
  fontWeight?: FontWeightKey;
  numberOfLines?: number;
  ellipsizeMode?: TextProps["ellipsizeMode"];
  // Caps system font scaling (large Android font sizes / low-res screens).
  maxFontSizeMultiplier?: number;
};

export default function AppText({
  children,
  variant = "md",
  style,
  numberOfLines,
  ellipsizeMode,
  fontWeight,
  maxFontSizeMultiplier,
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
      ellipsizeMode={ellipsizeMode ?? "tail"}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
    >
      {children}
    </Text>
  );
}
