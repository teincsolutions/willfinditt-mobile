import { useTheme } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";

export default function CategoryLayout() {
  const { spacing } = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="[parentId]/index"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
