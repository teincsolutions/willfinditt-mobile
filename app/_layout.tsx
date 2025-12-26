import { OTAUpdateBanner } from "@/components/ui/OTAUpdateBanner";
import { QueryProvider } from "@/contexts/QueryProvider";
import { AppThemeProvider } from "@/contexts/ThemeContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
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

export default function RootLayout() {
  return (
    <QueryProvider>
      <AppThemeProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <OTAUpdateBanner checkOnMount autoDownload={false} />
              <View style={{ flex: 1 }}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="(drawers)" />
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
                      title: "Filters",
                  headerBackTitle: "Search",
                }}
              />
              <Stack.Screen name="ads" />
              <Stack.Screen
                name="locations/regions"
                options={{
                  headerShown: true,
                  title: "Regions",
                }}
              />
              <Stack.Screen
                name="locations/cities/[regionId]"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="categories/index"
                options={{
                  title: "Categories",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="categories/[parentId]"
                options={{
                  title: "Categories",
                  headerShown: true,
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
