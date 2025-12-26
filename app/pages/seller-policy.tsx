import AppText from "@/components/ui/AppText";
import { usePage } from "@/hooks/usePage";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SellerPolicyScreen() {
  const insets = useSafeAreaInsets();
  const { data: page, isLoading, error } = usePage("seller-policy");
  const { colors, fontSizes, spacing } = useTheme();
  const { width } = useWindowDimensions();

  const htmlStyles = {
    p: {
      color: colors.text,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.5,
      marginBottom: spacing.sm,
    },
    h1: {
      color: colors.text,
      fontSize: fontSizes.xxl,
      fontWeight: "700" as const,
      marginBottom: spacing.md,
    },
    h2: {
      color: colors.text,
      fontSize: fontSizes.xl,
      fontWeight: "700" as const,
      marginBottom: spacing.md,
    },
    h3: {
      color: colors.text,
      fontSize: fontSizes.lg,
      fontWeight: "700" as const,
      marginBottom: spacing.sm,
    },
    ul: {
      marginBottom: spacing.sm,
    },
    li: {
      color: colors.text,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.5,
      marginBottom: spacing.xs,
    },
    strong: {
      fontWeight: "700" as const,
    },
    em: {
      fontStyle: "italic" as const,
    },
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AppText>Failed to load page</AppText>
      </View>
    );
  }

  if (!page) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AppText>Page not found</AppText>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ padding: spacing.md }}
      contentContainerStyle={{
        paddingBottom: insets.bottom + spacing.lg,
      }}
    >
      <RenderHTML
        contentWidth={width - spacing.lg * 2}
        source={{ html: page.content }}
        tagsStyles={htmlStyles}
      />
    </ScrollView>
  );
}
