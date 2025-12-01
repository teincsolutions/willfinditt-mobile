import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";

export default function DescriptionHTML({ html }: { html?: string }) {
  const { width } = useWindowDimensions();
  const { colors, fontSizes, spacing } = useTheme();

  if (!html) return null;

  return (
    <AppView style={{ marginHorizontal: spacing.md }}>
      <AppText
        variant="lg"
        style={{ fontWeight: "700", marginBottom: spacing.md }}
      >
        Description
      </AppText>
      <RenderHTML
        contentWidth={width - spacing.md * 2}
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
