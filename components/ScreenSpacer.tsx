// ScreenSpacer.tsx
import React from "react";
import { View } from "react-native";

export default function ScreenSpacer({ size }: { size: number }) {
  return <View style={{ height: size }} />;
}
