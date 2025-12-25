// components/home/FilterTabs.tsx
import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Pressable, ScrollView } from "react-native";

export default function FilterTabs({
  selected,
  onSelect,
  tabs,
}: {
  selected: string;
  onSelect: (id: string) => void;
  tabs: string[];
}) {
  const { colors, spacing, radius } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg }}
    >
      {tabs.filter((val) => !!val).map((t) => {
        const active = selected === t;
        return (
          <Pressable
            key={t}
            onPress={() => onSelect(t)}
            style={{
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: radius.lg,
              backgroundColor: active ? colors.primary : "transparent",
              borderWidth: 1,
              borderColor: active ? colors.primary : colors.border,
              marginRight: spacing.md,
            }}
          >
            <AppText style={{ color: active ? colors.textWhite : colors.text }}>
              {t}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
