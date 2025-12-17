import StateList from "@/components/location/StateList";
import { SearchBar } from "@/components/search/SearchBar";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/hooks/useTheme";
import { State } from "@/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Dummy data
const states: State[] = [
  { id: "1", name: "Greater Accra", countryId: "1", createdAt: "" },
  { id: "2", name: "Ashanti", countryId: "1", createdAt: "" },
  { id: "3", name: "Eastern", countryId: "1", createdAt: "" },
  { id: "4", name: "Western", countryId: "1", createdAt: "" },
  { id: "5", name: "Northern", countryId: "1", createdAt: "" },
  { id: "6", name: "Volta", countryId: "1", createdAt: "" },
  { id: "7", name: "Central", countryId: "1", createdAt: "" },
  { id: "8", name: "Brong-Ahafo", countryId: "1", createdAt: "" },
  { id: "9", name: "Upper East", countryId: "1", createdAt: "" },
  { id: "10", name: "Upper West", countryId: "1", createdAt: "" },
];

export default function RegionsScreen() {
  const insets = useSafeAreaInsets();
  const { icons, spacing, colors } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState<State | undefined>(
    undefined
  );

  useEffect(() => {
    return () => Keyboard.dismiss();
  }, []);

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Header
        navRowStyle={{ marginHorizontal: spacing.md }}
        title="All States/Regions"
        containerStyle={{
          paddingBottom: spacing.md,
          paddingTop: insets.top,
        }}
      >
        <SearchBar
          style={{ marginHorizontal: spacing.md }}
          value={query}
          onChangeText={setQuery}
          onPressFilter={() => {
            router.push("/search/filters");
          }}
        />
      </Header>
      <StateList
        states={states}
        selectedState={selectedState}
        onSelectState={(state) => {
          setSelectedState(state);
          router.push({
            pathname: "/ads/locations/[regionId]",
            params: { regionId: state.id },
          });
        }}
        loading={false}
      />
    </AppView>
  );
}
