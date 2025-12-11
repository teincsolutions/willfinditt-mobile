import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="[parentId]/index"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
    </Stack>
  );
}
