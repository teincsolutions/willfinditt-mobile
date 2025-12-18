import CityList from "@/components/location/CityList";
import AppView from "@/components/ui/AppView";
import { useCitiesByState } from "@/hooks/useLocations";
import { useLocationSelection } from "@/hooks/useLocationSelection";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack, useLocalSearchParams } from "expo-router";

export default function CitiesScreen() {
  const { colors } = useTheme();
  const { regionId = "" } = useLocalSearchParams() as { regionId: string };
  const { data: cities = [], isLoading } = useCitiesByState(regionId);
  const { selectedCity, setSelectedCity, selectedState } = useLocationSelection();
  
  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Stack.Screen
        options={{
          title: selectedState?.name || "Cities",
        }}
      />
      <CityList
        cities={cities}
        selectedCity={selectedCity!}
        onSelectCity={(city) => {
          setSelectedCity(city);
          router.dismiss(2);
        }}
        loading={isLoading}
      />
    </AppView>
  );
}
