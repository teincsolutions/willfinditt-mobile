import AppText from "@/components/ui/AppText";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";
import { View, StyleProp, ViewStyle } from "react-native";

interface ErrorFallbackProps {
  error: Error;
  retry: () => void;
}

export function ErrorFallback({ error, retry }: ErrorFallbackProps) {
  const { colors, spacing } = useTheme();

  useEffect(() => {
    console.error("App Error Boundary caught:", error);
  }, [error]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.lg,
      }}
    >
      <AppText
        variant="xl"
        style={{ marginBottom: spacing.md, textAlign: "center" }}
      >
        Something went wrong
      </AppText>
      <AppText
        variant="sm"
        style={{
          color: colors.text,
          marginBottom: spacing.xl,
          textAlign: "center",
        }}
      >
        {error.message || "An unexpected error occurred"}
      </AppText>
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <PrimaryButton
          title="Try Again"
          onPress={retry}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          title="Go Home"
          onPress={() => {
            // Use expo-router navigation
            const { router } = require("expo-router");
            router.replace("/");
          }}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}
