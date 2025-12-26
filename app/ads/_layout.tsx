import { BackButton } from "@/components/ui/BackButton";
import { CategorySelectionProvider } from "@/contexts/CategorySelectionContext";
import { LocationSelectionProvider } from "@/contexts/LocationSelectionContext";
import { Stack } from "expo-router";

export default function AdsLayout() {
  return (
    <CategorySelectionProvider>
      <LocationSelectionProvider>
        <Stack screenOptions={{ headerLeft: () => <BackButton /> }}>
          <Stack.Screen name="create" />
          <Stack.Screen name="[adId]/index" options={{ headerShown: false }} />
          <Stack.Screen name="seller" options={{ headerShown: false }} />
          <Stack.Screen
            name="categories/index"
            options={{ presentation: "modal", title: "Categories" }}
          />
          <Stack.Screen
            name="categories/[parentId]"
            options={{ presentation: "modal", title: "Categories" }}
          />
          <Stack.Screen
            name="locations/regions"
            options={{ presentation: "modal", title: "Regions" }}
          />
          <Stack.Screen
            name="locations/cities/[regionId]"
            options={{ presentation: "modal", title: "Cities" }}
          />
        </Stack>
      </LocationSelectionProvider>
    </CategorySelectionProvider>
  );
}
