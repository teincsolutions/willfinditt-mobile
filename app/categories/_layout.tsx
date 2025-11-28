import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="[categoryId]/index" />
    </Stack>
  );
}
