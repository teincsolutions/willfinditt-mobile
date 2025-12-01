import { BusinessType, BusinessTypes } from "@/types/enums";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo, useState } from "react";
import { SelectableListSheet } from "./SelectableBottomSheet";
import SheetRadioOptionItem from "./SheetRadioOptionItem";

export interface ChooseBusinessTypeSheetProps {
  selected?: BusinessType;
  onSelect?: (value: BusinessType) => void;
  loading?: boolean;
}

export const ChooseBusinessTypeSheet = forwardRef<
  BottomSheet,
  ChooseBusinessTypeSheetProps
>(({ selected, onSelect, loading }, ref) => {
  const snapPoints = useMemo(() => ["70%"], []);

  const options = useMemo(() => Object.values(BusinessTypes) as BusinessType[], []);

  const [current, setCurrent] = useState<BusinessType | undefined>(selected);

  return (
    <SelectableListSheet
      ref={ref}
      title="Choose Business Type"
      data={options}
      loading={loading}
      onDone={() => {
        if (current && onSelect) onSelect(current);
      }}
      renderItem={({ item }) => (
        <SheetRadioOptionItem
          key={item}
          item={item}
          selected={current === item}
          onPress={() => setCurrent(item)}
        />
      )}
    />
  );
});

ChooseBusinessTypeSheet.displayName = "ChooseBusinessTypeSheet";
