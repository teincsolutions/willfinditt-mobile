import { Stack } from "expo-router";

export default function ResultLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen
        name="locations/cities/[regionId]"
        options={{ presentation: "modal", headerShown: true }}
      />
      <Stack.Screen
        name="locations/regions"
        options={{
          title: "Regions",
          presentation: "modal",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
