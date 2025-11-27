import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import AppView from "../ui/AppView";

export default function DescriptionHTML({ html }: { html?: string }) {
  const { width } = useWindowDimensions();
  const { colors, fontSizes, spacing } = useTheme();

  if (!html) return null;

  return (
    <AppView style={{ paddingHorizontal: spacing.md }}>
      <RenderHTML
        contentWidth={width - 32}
        source={{ html }}
        baseStyle={{
          color: colors.text,
          fontSize: fontSizes.md,
          lineHeight: 22,
        }}
      />
    </AppView>
  );
}
