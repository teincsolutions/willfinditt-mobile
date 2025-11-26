import { AppThemeProvider } from "@/contexts/ThemeContext";
import { hasOpenedApp } from "@/lib/storage";
import { router, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

export default function RootLayout() {
  const segments = useSegments();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    // Determine initial route based on whether user has opened app
    const checkInitialRoute = async () => {
      const hasOpened = await hasOpenedApp();

      if (!hasOpened) {
        setInitialRoute("/(auth)/login");
      } else {
        setInitialRoute("/(tabs)");
      }
    };

    checkInitialRoute();
  }, []);

  useEffect(() => {
    if (initialRoute === null) return; // Still determining initial route

    const handleNavigation = async () => {
      const inAuthGroup = segments[0] === "(auth)";
      const hasOpened = await hasOpenedApp();

      if (!hasOpened && !inAuthGroup && segments.length > 0) {
        // First time user not in auth, redirect to auth
        router.replace("/(auth)/login");
      } else if (hasOpened && inAuthGroup && segments.length > 0) {
        // User has opened app before but in auth, redirect to tabs
        router.replace("/(tabs)");
      }
    };

    handleNavigation();
  }, [segments, initialRoute]);

  if (initialRoute === null) {
    // Don't render anything until we determine the initial route
    return null;
  }

  return (
    <AppThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </AppThemeProvider>
  );
}
