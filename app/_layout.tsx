import { OTAUpdateBanner } from "@/components/ui/OTAUpdateBanner";
import { QueryProvider } from "@/contexts/QueryProvider";
import { AppThemeProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <QueryProvider>
      <AppThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <OTAUpdateBanner checkOnMount autoDownload={false} />
          <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(drawers)" />
              <Stack.Screen name="(auth)" />
            </Stack>
          </View>
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </AppThemeProvider>
    </QueryProvider>
  );
}
