import StateList from "@/components/location/StateList";
import AppView from "@/components/ui/AppView";
import {
  useCityById,
  useStatesByCountry
} from "@/hooks/useLocations";
import { useLocationSelection } from "@/hooks/useLocationSelection";
import { useTheme } from "@/hooks/useTheme";
import { State } from "@/types";
import { router } from "expo-router";

// Default Ghana country ID - adjust if needed
const GHANA_COUNTRY_ID = "cmg8dfzhk0000pga392vf9568";

export default function RegionsScreen() {
  const { colors } = useTheme();
  const { data: states = [], isLoading } = useStatesByCountry(GHANA_COUNTRY_ID);
  const { selectedCityId } = useLocationSelection();
  const { data: selectedCityData } = useCityById(selectedCityId || "");

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <StateList
        states={states}
        selectedState={selectedCityData?.state}
        onSelectCity={(city) => {
          router.dismiss();
        }}
        onSelectState={(state: State) => {
          router.push({
            pathname: "/ads/locations/cities/[regionId]",
            params: { regionId: state.id },
          });
        }}
        loading={isLoading}
      />
    </AppView>
  );
}
