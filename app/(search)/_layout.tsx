import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="filters" options={{ presentation: "modal" }} />
      <Stack.Screen name="results" />
    </Stack>
  );
}
