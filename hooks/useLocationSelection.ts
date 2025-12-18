import { City, State } from "@/types";
import { storage } from "@/utils/mmkvStorage";
import { useCallback } from "react";
import { useMMKVObject } from "react-native-mmkv";

const SELECTED_CITY_KEY = "selected-city";
const SELECTED_STATE_KEY = "selected-state";

/**
 * Hook for managing location selection state using MMKV storage
 * Used for creating or editing ads with location context, or for filtering
 */
export const useLocationSelection = () => {
  // Use MMKV reactive hooks for automatic re-renders
  const [selectedCity, setSelectedCity] = useMMKVObject<City>(
    SELECTED_CITY_KEY,
    storage
  );

  const [selectedState, setSelectedState] = useMMKVObject<State>(
    SELECTED_STATE_KEY,
    storage
  );

  // Clear all location selections
  const clearLocationSelection = useCallback(() => {
    setSelectedCity(undefined);
    setSelectedState(undefined);
  }, [setSelectedCity, setSelectedState]);

  return {
    selectedCity: selectedCity || null,
    selectedState: selectedState || null,
    setSelectedCity,
    setSelectedState,
    clearLocationSelection,
  };
};
