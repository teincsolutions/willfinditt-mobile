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
      <Stack.Screen name="create" />
      <Stack.Screen name="[adId]/edit" />
      <Stack.Screen name="seller/[sellerId]" />
    </Stack>
  );
}
