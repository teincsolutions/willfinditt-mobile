import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: "modal" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[parentId]/index" />
    </Stack>
  );
}
