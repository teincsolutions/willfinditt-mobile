import AppText from "@/components/ui/AppText";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";
import { View } from "react-native";

export default function ErrorPage() {
  const { colors, spacing } = useTheme();

  useEffect(() => {
    // Log error for debugging
    console.error("App Error Boundary caught an error");
  }, []);

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
        An unexpected error occurred
      </AppText>
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <PrimaryButton
          title="Try Again"
          onPress={() => {
            // Reload the app
            const { router } = require("expo-router");
            router.replace("/");
          }}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}
