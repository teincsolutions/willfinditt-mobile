import { useTheme } from "@/hooks/useTheme";
import BottomSheet from "@gorhom/bottom-sheet";
import { forwardRef, Ref, useRef, useState } from "react";
import { SearchBar } from "../search/SearchBar";
import { SelectableListSheet } from "./SelectableBottomSheet";
import SheetRadioOptionItem from "./SheetRadioOptionItem";

interface LocationBottomSheetProps {
  onSelect: (cityId: string) => void;
  close: () => void;
  open: () => void;
}

const regions = [
  { id: "1", name: "Greater Accra" },
  { id: "2", name: "Ashanti" },
  { id: "3", name: "Eastern" },
  { id: "4", name: "Northern" },
  { id: "5", name: "Volta" },
  { id: "6", name: "Western" },
  { id: "7", name: "Central" },
  { id: "8", name: "Brong-Ahafo" },
  { id: "9", name: "Upper East" },
  { id: "10", name: "Upper West" },
];

const cities = [
  { id: "1", regionId: "1", name: "Accra" },
  { id: "2", regionId: "1", name: "Tema" },
  { id: "3", regionId: "2", name: "Kumasi" },
  { id: "4", regionId: "3", name: "Koforidua" },
  { id: "5", regionId: "4", name: "Tamale" },
  { id: "6", regionId: "5", name: "Ho" },
  { id: "7", regionId: "6", name: "Takoradi" },
  { id: "8", regionId: "7", name: "Cape Coast" },
  { id: "9", regionId: "8", name: "Sunyani" },
  { id: "10", regionId: "9", name: "Bolgatanga" },
  { id: "11", regionId: "10", name: "Wa" },
];

export const LocationBottomSheet = forwardRef<
  BottomSheet,
  LocationBottomSheetProps
>(({ onSelect, close, open }, ref: Ref<BottomSheet>) => {
  const { spacing } = useTheme();
  const citySheetRef = useRef<BottomSheet>(null);

  const [queryRegion, setQueryRegion] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "Select a region" });
  const [regionLoading, setRegionLoading] = useState(false);

  const [queryCity, setQueryCity] = useState("");
  const [selectedCity, setSelectedCity] = useState<{
    id: string;
    regionId: string;
    name: string;
  }>({ id: "", regionId: "", name: "Select a city" });
  const [cityLoading, setCityLoading] = useState(false);

  return (
    <>
      <SelectableListSheet
        ListHeaderComponent={
          <SearchBar
            value={queryRegion}
            placeholder={"Search a state or region..."}
            onChangeText={setQueryRegion}
            showSearchButton={false}
          />
        }
        ListHeaderComponentStyle={{
          marginBottom: spacing.md,
        }}
        ref={ref}
        title={"Select Region or State"}
        data={regions}
        loading={regionLoading}
        renderItem={({ item }) => (
          <SheetRadioOptionItem
            item={item}
            selected={selectedRegion.id === item.id}
            onPress={() => {
              setSelectedRegion(item);
              citySheetRef.current?.expand();
              close();
            }}
          />
        )}
      />
      <SelectableListSheet
        ListHeaderComponent={
          <SearchBar
            value={queryCity}
            placeholder={"Search a city..."}
            onChangeText={setQueryCity}
            showSearchButton={false}
          />
        }
        ListHeaderComponentStyle={{
          marginBottom: spacing.md,
        }}
        ref={citySheetRef}
        title={"Select City"}
        data={cities}
        loading={cityLoading}
        renderItem={({ item }) => (
          <SheetRadioOptionItem
            item={item}
            selected={selectedCity.id === item.id}
            onPress={() => {
              setSelectedCity(item);
              citySheetRef.current?.close();
            }}
          />
        )}
      />
    </>
  );
});

LocationBottomSheet.displayName = "LocationBottomSheet";
