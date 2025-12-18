import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/contexts/ThemeContext";
import { City } from "@/types/location";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchBar } from "../search/SearchBar";
import CityCard from "./CityCard";
import CityCardSkeleton from "./CityCardSkeleton";

interface Props {
  cities: City[];
  selectedCity?: City;
  onSelectCity: (city: City) => void;
  loading?: boolean;
}

export default function CityList({
  cities,
  selectedCity,
  onSelectCity,
  loading,
}: Props) {
  const { colors, spacing, radius, icons } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const filteredCities =
    cities?.filter((city) =>
      city.name?.toLowerCase().includes(query.toLowerCase())
    ) || [];

  // Header showing selected city
  const renderHeader = React.useMemo(() => {
    return (
      <AppView
        style={{
          backgroundColor: colors.background,
          paddingVertical: spacing.md,
        }}
      >
        <SearchBar
          value={query}
          onChangeText={setQuery}
          showSearchButton={false}
        />

        {selectedCity && (
          <Pressable onPress={() => onSelectCity(selectedCity)}>
            <AppText
              variant="lg"
              fontWeight="bold"
              style={{ color: colors.primary, marginTop: spacing.xs }}
            >
              <Feather name="circle" size={icons.xs} /> {selectedCity.name}
            </AppText>
          </Pressable>
        )}
      </AppView>
    );
  }, [query, selectedCity, spacing, colors, icons]);

  const emptyState = React.useMemo(() => {
    return loading ? (
      <AppView style={{ gap: spacing.xs }}>
        {[...Array(10)].map((_, index) => (
          <CityCardSkeleton key={index} />
        ))}
      </AppView>
    ) : null;
  }, [loading, spacing]);

  const renderItem = React.useCallback(
    ({ item }: { item: City }) => (
      <CityCard
        city={item}
        selected={selectedCity?.id === item.id}
        onPress={() => onSelectCity(item)}
      />
    ),
    [selectedCity, onSelectCity]
  );

  const keyExtractor = React.useCallback((item: City) => item.id, []);

  return (
    <FlatList
      data={filteredCities}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={emptyState}
      stickyHeaderIndices={[0]}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
        paddingBottom: insets.bottom + spacing.md,
        gap: spacing.xs,
      }}
      ListHeaderComponentStyle={{
        backgroundColor: colors.background,
        marginHorizontal: -spacing.md,
        paddingHorizontal: spacing.md,
        borderBottomEndRadius: radius.lg,
        borderBottomStartRadius: radius.lg,
      }}
      style={{
        backgroundColor: colors.backgroundPrimary,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  header: {},
});
