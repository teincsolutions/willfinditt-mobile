import { LocationSheetButton } from "@/components/bottom-sheet/LocationSheetButton";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

export default function ResultsScreen() {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          header: () => (
            <Header
              containerStyle={{
                paddingHorizontal: spacing.md,
                backgroundColor: colors.background,
              }}
            ></Header>
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: spacing.md,
          gap: spacing.md,
        }}
      >
        <LocationSheetButton />
      </ScrollView>
    </View>
  );
}
