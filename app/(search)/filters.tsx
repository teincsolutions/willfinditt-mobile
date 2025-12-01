import { LocationBottomSheet } from "@/components/bottom-sheet/LocationBottomSheet";
import { LocationSheetButton } from "@/components/bottom-sheet/LocationSheetButton";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/hooks/useTheme";
import BottomSheet from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React, { useRef } from "react";
import { ScrollView } from "react-native";

export default function FiltersScreen() {
  const { colors, spacing } = useTheme();
  const locationSheetRef = useRef<BottomSheet>(null);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <Header
              containerStyle={{
                backgroundColor: colors.background,
              }}
            ></Header>
          ),
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: spacing.md,
          gap: spacing.md,
        }}
      >
        <LocationSheetButton
          onPress={() => locationSheetRef.current?.expand()}
        />
      </ScrollView>

      <LocationBottomSheet
        ref={locationSheetRef}
        onSelect={function (cityId: string): void {
          throw new Error("Function not implemented.");
        }}
        close={() => {
          locationSheetRef.current?.close();
        }}
        open={() => locationSheetRef.current?.expand()}
      />
    </>
  );
}
