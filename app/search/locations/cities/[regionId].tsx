import CityList from "@/components/location/CityList";
import AppView from "@/components/ui/AppView";
import {
  useCitiesByState,
  useCityById,
  useStateById,
} from "@/hooks/useLocations";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack, useLocalSearchParams } from "expo-router";

export default function CitiesScreen() {
  const { colors } = useTheme();
  const { regionId = "", source = "search" } = useLocalSearchParams() as {
    regionId: string;
    source?: string;
  };
  const { data: selectedState } = useStateById(regionId);
  const { data: cities = [], isLoading } = useCitiesByState(regionId);
  const { setCityId, cityId } = useSearchFilters();
  const { data: selectedCity } = useCityById(cityId!);

  const handleNavigateNext = () => {
    if (source === "filters") {
      router.back();
    } else {
      router.push({
        pathname: "/search/results",
        params: { source, cityId },
      });
    }
  };

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
          setCityId(city.id);
          handleNavigateNext();
        }}
        loading={isLoading}
      />
    </AppView>
  );
}
