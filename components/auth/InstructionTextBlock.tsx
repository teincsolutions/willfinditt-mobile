// InstructionTextBlock.tsx
import React from "react";
import { View } from "react-native";
import AppText from "../ui/AppText";

type Props = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function InstructionTextBlock({
  title,
  subtitle,
  align = "left",
}: Props) {
  return (
    <View>
      <AppText variant="xl" style={{ textAlign: align }}>
        {title}
      </AppText>
      {subtitle && (
        <AppText variant="sm" style={{ marginTop: 4, textAlign: align }}>
          {subtitle}
        </AppText>
      )}
    </View>
  );
}
