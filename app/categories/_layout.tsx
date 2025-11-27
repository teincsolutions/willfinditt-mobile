import { AppThemeProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <AppThemeProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="[categoryId]/index" />
      </Stack>
    </AppThemeProvider>
  );
}
