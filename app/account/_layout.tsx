import { Header } from "@/components/ui/Header";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";

export default function AccountLayout() {
  const { spacing, colors } = useTheme();
  return (
    <Stack>
      <Stack.Screen name="business" options={{title:"Business Profile"}} />
      <Stack.Screen name="edit-business" options={{title:"Edit Business Profile"}} />
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
      <Stack.Screen name="my-reviews" options={{title:"My Reviews"}} />
    </Stack>
  );
}
