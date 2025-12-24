import { Stack } from "expo-router";

export default function ResultLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false}}
      />
    </Stack>
  );
}
