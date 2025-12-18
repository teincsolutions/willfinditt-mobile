import StateList from "@/components/location/StateList";
import AppView from "@/components/ui/AppView";
import { useCityById, useStatesByCountry } from "@/hooks/useLocations";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { useTheme } from "@/hooks/useTheme";
import { State } from "@/types";
import { router, useLocalSearchParams } from "expo-router";

// Default Ghana country ID - adjust if needed
const GHANA_COUNTRY_ID = "cmg8dfzhk0000pga392vf9568";

export default function RegionsScreen() {
  const { colors } = useTheme();
  const { source = "search" } = useLocalSearchParams<{ source?: string }>();
  const { data: states = [], isLoading } = useStatesByCountry(GHANA_COUNTRY_ID);
  const { cityId } = useSearchFilters();
  const { data: selectedCity } = useCityById(cityId!);

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <StateList
        states={states}
        selectedState={selectedCity?.state!}
        onSelectState={(state: State) => {
          router.replace({
            pathname: "/search/locations/cities/[regionId]",
            params: { regionId: state.id, source },
          });
        }}
        loading={isLoading}
      />
    </AppView>
  );
}
