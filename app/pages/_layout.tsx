import { Stack } from "expo-router";

export default function PageLayout() {
  return (
    <Stack>
      <Stack.Screen name="about" options={{title:"About Us" }} />
      <Stack.Screen name="faq" options={{title:"FAQ" }} />
      <Stack.Screen name="privacy" options={{title:"Privacy Policy" }} />
      <Stack.Screen name="terms" options={{title:"Terms & Conditions" }} />
    </Stack>
  );
}
