import { BackButton } from "@/components/ui/BackButton";
import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="filters"
        options={{
          title: "Filters",
          presentation: "pageSheet",
          headerLeft: () => <BackButton showIcon={false} label="Close" />,
        }}
      />
      <Stack.Screen name="results" options={{ headerShown: false }} />
      <Stack.Screen name="categories" options={{ headerShown: false }} />
      <Stack.Screen name="locations/regions" />
      <Stack.Screen name="locations/cities/[regionId]" />
    </Stack>
  );
}
