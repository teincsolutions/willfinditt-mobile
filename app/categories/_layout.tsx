import { BackButton } from "@/components/ui/BackButton";
import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack screenOptions={{ presentation: "modal" }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Categories",
          headerLeft: () => <BackButton showIcon={false} label="Close" />,
        }}
      />
      <Stack.Screen
        name="[parentId]"
        options={{
          title: "Categories",
          headerLeft: () => <BackButton showIcon={false} label="Close" />,
        }}
      />
    </Stack>
  );
}
