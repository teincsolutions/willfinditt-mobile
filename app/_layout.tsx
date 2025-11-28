import { AppThemeProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <GestureHandlerRootView>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawers)" />
          <Stack.Screen name="(auth)" />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </AppThemeProvider>
  );
}
