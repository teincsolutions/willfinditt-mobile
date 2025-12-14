import { Stack } from "expo-router";

export default function AdsLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "fade",
        headerShown: false,
      }}
    >
      <Stack.Screen name="[adId]/index" />
      <Stack.Screen name="create-ad" />
      <Stack.Screen name="seller" />
    </Stack>
  );
}
