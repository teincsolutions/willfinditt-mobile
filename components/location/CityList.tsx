import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/contexts/ThemeContext";
import { City } from "@/types/location";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
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
  const { colors, spacing } = useTheme();

  // Header showing selected city
  const renderHeader = () => {
    if (!selectedCity) return null;

    return (
      <AppView
        style={[
          styles.header,
          {
            backgroundColor: colors.backgroundPrimary,
            padding: spacing.md,
            marginBottom: spacing.md,
            borderRadius: spacing.sm,
          },
        ]}
      >
        <AppText variant="sm" style={{ color: colors.textGray }}>
          Selected City
        </AppText>
        <AppText
          variant="lg"
          fontWeight="bold"
          style={{ color: colors.primary, marginTop: spacing.xs }}
        >
          {selectedCity.name}
        </AppText>
      </AppView>
    );
  };

  if (loading) {
    return (
      <AppView style={{ paddingHorizontal: spacing.md }}>
        {[...Array(10)].map((_, index) => (
          <CityCardSkeleton key={index} />
        ))}
      </AppView>
    );
  }

  return (
    <FlatList
      data={cities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CityCard
          city={item}
          selected={selectedCity?.id === item.id}
          onPress={() => onSelectCity(item)}
        />
      )}
      ListHeaderComponent={renderHeader}
      stickyHeaderIndices={selectedCity ? [0] : []}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xl,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  header: {},
});
