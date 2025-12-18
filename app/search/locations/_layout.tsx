import { BackButton } from "@/components/ui/BackButton";
import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack screenOptions={{ presentation: "pageSheet" }}>
      <Stack.Screen
        name="regions"
        options={{
          presentation: "pageSheet",
          title: "Regions",
          headerLeft: () => <BackButton showIcon={false} label="Close" />,
        }}
      />
      <Stack.Screen
        name="cities/[regionId]"
        options={{
          presentation: "pageSheet",
          title: "Cities",
          headerLeft: () => <BackButton showIcon={false} label="Close" />,
        }}
      />
    </Stack>
  );
}
