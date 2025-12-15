import { Header } from "@/components/ui/Header";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";

export default function AccountLayout() {
  const { spacing, colors } = useTheme();
  return (
    <Stack>
      <Stack.Screen name="business" />
      <Stack.Screen name="edit-business" />
      <Stack.Screen
        name="verification"
        options={{
          header: () => (
            <Header
              backgroundColor={colors.background}
              containerStyle={{
                paddingBottom: spacing.md,
                paddingHorizontal: spacing.md,
              }}
            />
          ),
        }}
      />
    </Stack>
  );
}
