import { LocationBottomSheet } from "@/components/bottom-sheet/LocationBottomSheet";
import { LocationSheetButton } from "@/components/bottom-sheet/LocationSheetButton";
import { SelectableListSheet } from "@/components/bottom-sheet/SelectableBottomSheet";
import { SelectBoxSheet } from "@/components/bottom-sheet/SelectBoxSheet";
import SheetRadioOptionItem from "@/components/bottom-sheet/SheetRadioOptionItem";
import { BackButton } from "@/components/ui/BackButton";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import PlaceholderField from "@/components/ui/PlaceholderField";
import RangeInput from "@/components/ui/RangeInput";
import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { ScrollView } from "react-native";
const items = [
  { id: "all", name: "All Condition" },
  { id: "new", name: "New" },
  { id: "like_new", name: "Like New" },
  { id: "good", name: "Good" },
  { id: "fair", name: "Fair" },
  { id: "poor", name: "Poor" },
];

export default function FiltersScreen() {
  const { colors, spacing, radius, icons } = useTheme();
  const locationSheetRef = useRef<BottomSheet>(null);
  const [range, setRange] = useState({ low: 0, high: 100000 });
  const sheetRef = useRef<BottomSheet>(null);
  const [selected, setSelected] = useState<string | number | null>("all");

  return (
    <>
      <Header
        containerStyle={{
          backgroundColor: colors.background,
          paddingBottom: spacing.lg,
          paddingTop: spacing.md,
        }}
        left={<BackButton label="Cancel" showIcon={false} />}
        title="Filters"
        
        navRowStyle={{ marginHorizontal: spacing.md }}

      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: spacing.md,
          gap: spacing.md,
        }}
      >
        <PlaceholderField
          onPress={() => router.push("/categories")}
          placeholder={"Select a category"}
          label="Category"
          rightLabel="Reset"
          inputStyle={[
            {
              backgroundColor: colors.selectBg,
              paddingRight: spacing.sm,
            },
          ]}
          value={""}
          rightIcon={
            <IconButton
              onPress={() => router.push("/categories")}
              style={{
                backgroundColor: colors.iconLightGray,
                borderRadius: radius.sm,
              }}
              icon={
                <Feather
                  name="chevron-down"
                  size={icons.sm}
                  color={colors.iconGray}
                />
              }
            />
          }
        />

        <LocationSheetButton
          onPress={() => locationSheetRef.current?.expand()}
        />

        <RangeInput
          label="Price Range"
          minValue={range.low.toString()}
          maxValue={range.high.toString()}
          onMinChange={(value) =>
            setRange((prev) => ({ ...prev, low: Number(value) }))
          }
          onMaxChange={(value) =>
            setRange((prev) => ({ ...prev, high: Number(value) }))
          }
        />

        <SelectBoxSheet
          label="Condition"
          title="Select Condition"
          data={items}
          value={selected}
          onDone={() => {
            sheetRef.current?.close();
          }}
          renderItem={({ item, index }) => (
            <SheetRadioOptionItem
              item={item}
              selected={selected === item.id}
              onPress={() => {
                setSelected(item.id);
              }}
            />
          )}
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

      <SelectableListSheet
        ref={sheetRef}
        title="Condition"
        data={items}
        onDone={() => {
          sheetRef.current?.close();
        }}
        renderItem={({ item, index }) => (
          <SheetRadioOptionItem
            item={item}
            selected={selected === item.id}
            onPress={() => {
              setSelected(item.id);
            }}
          />
        )}
      />
    </>
  );
}
