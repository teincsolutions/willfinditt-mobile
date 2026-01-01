import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import truncate from "truncate-html";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import { TextButton } from "../ui/TextButton";

export default function DescriptionHTML({ html }: { html?: string }) {
  const { width } = useWindowDimensions();
  const { colors, fontSizes, spacing } = useTheme();
  const [showFull, setShowFull] = useState(false);

  if (!html) return null;

  const plainText = html.replace(/<[^>]*>/g, "");
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;

  const contentHtml = wordCount > 20 && !showFull
    ? truncate(html, { length: 20, byWords: true, ellipsis: "..." })
    : html;

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
        source={{ html: contentHtml }}
        baseStyle={{
          color: colors.text,
          fontSize: fontSizes.md,
          lineHeight: 22,
        }}
      />
      {wordCount > 20 && (
        <TextButton
          title={showFull ? "Read Less" : "Read More"}
          onPress={() => setShowFull(!showFull)}
          style={{ marginTop: spacing.sm }}
        />
      )}
    </AppView>
  );
}
