import { Stack } from "expo-router";

export default function LocationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="regions" options={{ presentation: "formSheet" }} />
      <Stack.Screen name="[regionId]" options={{ presentation: "modal" }} />
    </Stack>
  );
}
