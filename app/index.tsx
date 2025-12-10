import { mmkvStorage } from "@/utils/mmkvStorage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    // Check if this is the user's first time opening the app
    const checkFirstLaunch = () => {
      const firstLaunch = mmkvStorage.isFirstLaunch();
      setIsFirstLaunch(firstLaunch);
      setIsLoading(false);
    };

    checkFirstLaunch();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect to onboarding if first launch, otherwise to main app
  if (isFirstLaunch) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(drawers)" />;
}
