import { Stack } from "expo-router";

export default function ThreadLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"  />
      <Stack.Screen name="[threadId]" options={{ title:"Loading..."}} />
    </Stack>
  );
}
