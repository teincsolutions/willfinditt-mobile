import CityList from "@/components/location/CityList";
import { SearchBar } from "@/components/search/SearchBar";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/hooks/useTheme";
import { City } from "@/types";
import { router, Stack } from "expo-router";
import { useState } from "react";

// Dummy data
const cities: City[] = [
  { id: "1", name: "Accra", stateId: "1", createdAt: "" },
  { id: "2", name: "Kumasi", stateId: "2", createdAt: "" },
  { id: "3", name: "Tema", stateId: "1", createdAt: "" },
  { id: "4", name: "Cape Coast", stateId: "7", createdAt: "" },
  { id: "5", name: "Tamale", stateId: "5", createdAt: "" },
  { id: "6", name: "Takoradi", stateId: "4", createdAt: "" },
  { id: "7", name: "Ho", stateId: "6", createdAt: "" },
  { id: "8", name: "Sunyani", stateId: "8", createdAt: "" },
  { id: "9", name: "Bolgatanga", stateId: "9", createdAt: "" },
  { id: "10", name: "Wa", stateId: "10", createdAt: "" },
];

export default function CitiesScreen() {
  const { icons, spacing, colors } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | undefined>(undefined);

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Stack.Screen
        options={{
          header: () => (
            <Header
              navRowStyle={{ marginHorizontal: spacing.md }}
              title={"All Cities"}
              containerStyle={{
                paddingBottom: spacing.md,
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
          ),
        }}
      />
      <CityList
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
        }}
        loading={false}
      />
    </AppView>
  );
}
