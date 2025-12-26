import { BackButton } from "@/components/ui/BackButton";
import { Stack } from "expo-router";

export default function PageLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerLeft: () => <BackButton />}}>
      <Stack.Screen name="about-us" options={{ title: "About Us" }} />
      <Stack.Screen
        name="privacy-policy"
        options={{ title: "Privacy Policy" }}
      />
      <Stack.Screen name="seller-policy" options={{ title: "Seller Policy" }} />
      <Stack.Screen name="terms" options={{ title: "Terms & Conditions" }} />
    </Stack>
  );
}
