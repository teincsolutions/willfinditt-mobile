import { Stack } from "expo-router";

export default function AdsLayout() {
  return (
    <Stack>
      <Stack.Screen name="create" />
      <Stack.Screen name="[adId]/index" options={{ headerShown: false }} />
      <Stack.Screen name="seller" options={{ headerShown: false }} />
      <Stack.Screen name="[adId]/ads-reviews" />
      <Stack.Screen name="categories/index" options={{ presentation: "modal", title: "Categories" }} />
      <Stack.Screen name="categories/[parentId]" options={{ presentation: "modal", title: "Categories" }} />
      <Stack.Screen name="locations/index" options={{ presentation: "modal", title: "Regions" }} />
      <Stack.Screen name="locations/cities/[regionId]" options={{ presentation: "modal", title: "Cities" }} />
    </Stack>
  );
}
