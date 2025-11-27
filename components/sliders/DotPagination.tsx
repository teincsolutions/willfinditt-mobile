// components/home/DotPagination.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { View } from "react-native";

export function DotPagination({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginTop: spacing.md,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 8,
            marginHorizontal: 4,
            backgroundColor: i === index ? colors.primary : colors.border,
          }}
        />
      ))}
    </View>
  );
}
