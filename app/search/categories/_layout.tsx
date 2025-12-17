import { BackButton } from "@/components/ui/BackButton";
import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack screenOptions={{ presentation: "pageSheet" }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Categories",
          presentation: "pageSheet",
          headerLeft: () => <BackButton showIcon={false} label="Close" />,
        }}
      />
      <Stack.Screen
        name="[parentId]"
        options={{
          title: "Categories",
          presentation: "pageSheet",
          headerLeft: () => <BackButton showIcon={false} label="Close" />,
        }}
      />
    </Stack>
  );
}
