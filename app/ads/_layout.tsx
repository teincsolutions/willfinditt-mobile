import { BackButton } from "@/components/ui/BackButton";
import { Stack } from "expo-router";

export default function AdsLayout() {
  return (
    <Stack>
      <Stack.Screen name="[adId]/index" options={{ headerShown: false }} />
      <Stack.Screen name="create" />
      <Stack.Screen name="[adId]/edit" />
      <Stack.Screen name="seller/[sellerId]" />
      <Stack.Screen name="[adId]/ads-reviews" />
      <Stack.Screen
        name="categories/index"
        options={{
          presentation: "pageSheet",
          title: "Categories",
          headerLeft: () => <BackButton showIcon={false} label="Close" />,
        }}
      />
      <Stack.Screen
        name="categories/[parentId]"
        options={{
          presentation: "pageSheet",
          title: "Categories",
          headerLeft: () => <BackButton showIcon={false} label="Close" />,
        }}
      />
      <Stack.Screen name="locations/regions" />
      <Stack.Screen name="locations/cities/[regionId]" />
    </Stack>
  );
}
