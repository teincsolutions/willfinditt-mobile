// components/home/HomeSectionHeader.tsx
import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

export default function SectionHeader({
  title,
  style,
  left,
}: {
  title: string;
  style?: StyleProp<ViewStyle>;
  left?: React.ReactNode;
}) {
  const { spacing } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          marginTop: spacing.lg,
        },
        style,
      ]}
    >
      <AppText variant="lg" style={{ fontWeight: "bold" }}>
        {title}
      </AppText>
      {left && left}
    </View>
  );
}
