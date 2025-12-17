import CityList from "@/components/location/CityList";
import { SearchBar } from "@/components/search/SearchBar";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/hooks/useTheme";
import { City } from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function CitiesScreen() {
  const insets = useSafeAreaInsets();
  const {  spacing, colors } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | undefined>(
    undefined
  );

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Header
        navRowStyle={{ marginHorizontal: spacing.md }}
        title="All Cities"
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
      <CityList
        cities={[]}
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
        }}
        loading={false}
      />
    </AppView>
  );
}
