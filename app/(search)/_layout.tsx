import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="filters"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen name="results" />
    </Stack>
  );
}
