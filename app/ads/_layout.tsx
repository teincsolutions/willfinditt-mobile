import { Stack } from "expo-router";

export default function AdsLayout() {
  return (
    <Stack>
      <Stack.Screen name="create" />
      <Stack.Screen name="[adId]/index" options={{ headerShown: false }} />
      <Stack.Screen name="seller" options={{ headerShown: false }} />
      <Stack.Screen name="[adId]/ads-reviews" />
      <Stack.Screen name="categories" options={{ presentation: "modal" }} />
      <Stack.Screen name="locations" options={{ presentation: "modal" }} />
    </Stack>
  );
}
