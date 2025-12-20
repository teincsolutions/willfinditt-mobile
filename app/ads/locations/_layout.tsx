import { BackButton } from "@/components/ui/BackButton";
import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack screenOptions={{ presentation: "modal" }}>
      <Stack.Screen
        name="regions"
        options={{
          title: "Regions",
          headerLeft: () => <BackButton showIcon={false} label="Close" />,
        }}
      />
      <Stack.Screen
        name="cities/[regionId]"
        options={{
          title: "Cities",
          headerLeft: () => <BackButton showIcon={false} label="Close" />,
        }}
      />
    </Stack>
  );
}
