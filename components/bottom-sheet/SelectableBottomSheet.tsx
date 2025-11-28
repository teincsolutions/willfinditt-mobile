// components/sheets/SelectableListSheet.tsx

import { useTheme } from "@/contexts/ThemeContext";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import { View } from "react-native";
import AppText from "../ui/AppText";
import PrimaryButton from "../ui/PrimaryButton";

export interface SelectableListSheetRef {
  open: () => void;
  close: () => void;
}

interface Props<T> {
  title: string;
  data: T[];
  selectedId?: string | number | null;
  onSelect: (item: T) => void;
  onDone?: (item: T | null) => void;
  renderItem: (params: { item: T; selected: boolean }) => React.ReactNode;
}

function SelectableListSheetInner<T>(
  { title, data, selectedId, onSelect, onDone, renderItem }: Props<T>,
  ref: any
) {
  const { spacing, colors } = useTheme();

  const snapPoints = useMemo(() => ["70%"], []);

  const selectedItem = data.find((d: any) => d?.id === selectedId) || null;

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      enablePanDownToClose
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
      }}
    >
      <BottomSheetView style={{ paddingHorizontal: spacing.md }}>
        {/* TITLE */}
        <AppText
          variant="xl"
          style={{
            textAlign: "center",
            fontWeight: "700",
            marginBottom: spacing.md,
          }}
        >
          {title}
        </AppText>

        {/* LIST — using BottomSheetFlatList */}
        <BottomSheetFlatList
          data={data}
          keyExtractor={(item: T, index: number) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: spacing.xl,
          }}
          renderItem={({ item }: { item: T }) =>
            renderItem({
              item,
              selected: (item as any)?.id === selectedId,
            })
          }
        />

        {/* DONE BUTTON */}
        <View style={{ marginTop: spacing.md }}>
          <PrimaryButton title="Done" onPress={() => onDone?.(selectedItem)} />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

export const SelectableListSheet = forwardRef(SelectableListSheetInner) as <T>(
  p: Props<T> & { ref?: React.Ref<SelectableListSheetRef> }
) => React.ReactElement;
