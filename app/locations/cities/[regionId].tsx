import CityList from "@/components/location/CityList";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import {
  useCitiesByState,
  useCityById,
  useStateById,
} from "@/hooks/useLocations";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { StackActions } from "@react-navigation/native";

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
  const navigation = useNavigation();

  const handleNavigateNext = () => {
    // Cities is always exactly two pushes deep (opener -> regions ->
    // cities), so pop twice to return to the opener (results, filters or
    // home). router.dismiss() only closes modals and left users stuck now
    // that these screens push as stack cards.
    navigation.dispatch(StackActions.pop(2));
  };

  // useEffect(() => {
  //  return () => {
  //    if (source === "filters") {
  //      router.replace("/locations/regions");
  //    }
  //  }
  // }, []);

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title={selectedState?.name || "Cities"} />
      <CityList
        cities={cities}
        selectedCity={selectedCity!}
        onSelectCity={(city) => {
          setCityId(city.id);
          handleNavigateNext();
        }}
        onClearLocation={() => {
          setCityId(undefined);
          handleNavigateNext();
        }}
        loading={isLoading}
      />
    </AppView>
  );
}
