import { BackButton } from "@/components/ui/BackButton";
import { Stack } from "expo-router";

export default function SellerLayout() {
  return (
    <Stack>
      <Stack.Screen name="[sellerId]/index" />
      <Stack.Screen
        name="[sellerId]/reviews"
        options={{
          title: "Reviews",
          presentation: "pageSheet",
          headerLeft: () => (
            <BackButton
              showIcon={false}
              label="Close"
              style={{ marginRight: 4 }}
            />
          ),
        }}
      />
    </Stack>
  );
}
