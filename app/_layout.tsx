// FCM Background Message Handler - MUST be imported first
import "@/services/fcmBackgroundHandler";

// Firebase App Initialization - MUST be imported early
import "@react-native-firebase/app";

import { OTAUpdateBanner } from "@/components/ui/OTAUpdateBanner";
import { QueryProvider } from "@/contexts/QueryProvider";
import { AppThemeProvider } from "@/contexts/ThemeContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "@/hooks/useAuth";
import {
    useFCMInitialization,
    useSyncPushNotifications,
} from "@/hooks/useOneNightNotifications";
import { processPendingNotification } from "@/utils/notificationRouting";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Toaster } from "sonner-native";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  scopes: ["profile", "email"],
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

// FCM Initializer Component
function FCMInitializer() {
  const { user } = useAuth();
  const syncNotifications = useSyncPushNotifications();

  console.log("🔔 FCMInitializer: Component mounted/updated");
  console.log(
    "🔔 FCMInitializer: user",
    user?.id ? "logged in" : "not logged in",
    user?.id,
  );

  const onRegistered = useCallback(() => {
    // Callback when device is registered
    console.log("🔔 FCMInitializer: onRegistered callback triggered");
    if (user?.id) {
      console.log(
        "🔔 FCMInitializer: Device registered, now syncing notifications for user",
        user.id,
      );
      syncNotifications.mutate({ userId: user.id });
    } else {
      console.log(
        "🔔 FCMInitializer: Device registered for anonymous user (no userId)",
      );
    }
  }, [user?.id, syncNotifications]);

  // Initialize FCM when app starts, passing user ID if available
  console.log(
    "🔔 FCMInitializer: Calling useFCMInitialization with userId:",
    user?.id || "(anonymous)",
  );
  useFCMInitialization(user?.id, onRegistered);

  return null;
}

export default function RootLayout() {
  useEffect(() => {
    // Process any pending notification routing after app is fully loaded
    const timer = setTimeout(() => {
      processPendingNotification();
    }, 1500); // Slightly longer delay to ensure navigation is ready

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryProvider>
      <AppThemeProvider>
        <FCMInitializer />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <OTAUpdateBanner checkOnMount autoDownload={true} />
          <View style={{ flex: 1 }}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(drawers)" options={{ title: "Home" }} />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="account" />

              <Stack.Screen
                name="search"
                options={{
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="filters"
                options={{
                  headerShown: true,
                  presentation: "modal",
                  title: "Filters",
                  headerBackTitle: "Search",
                }}
              />
              <Stack.Screen name="ads" />
              <Stack.Screen
                name="locations/regions"
                options={{
                  headerShown: true,
                  presentation: "modal",
                  title: "Regions",
                }}
              />
              <Stack.Screen
                name="locations/cities/[regionId]"
                options={{ headerShown: true, presentation: "modal" }}
              />
              <Stack.Screen
                name="categories/index"
                options={{
                  title: "Categories",
                  headerShown: true,
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="categories/[parentId]"
                options={{
                  title: "Categories",
                  headerShown: true,
                  presentation: "modal",
                }}
              />
              <Stack.Screen name="chats" />
              <Stack.Screen name="threads" />
              <Stack.Screen name="pages" />
            </Stack>
          </View>
          <Toaster />
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </AppThemeProvider>
    </QueryProvider>
  );
}
