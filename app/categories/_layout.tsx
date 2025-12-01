import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ presentation: "formSheet" }} />
      <Stack.Screen name="[categoryId]/index" />
    </Stack>
  );
}
