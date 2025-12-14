import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="business"
        options={{
          title: "Account",
        }}
      />
    </Stack>
  );
}
