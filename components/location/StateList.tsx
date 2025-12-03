import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/contexts/ThemeContext";
import { State } from "@/types/location";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import StateCard from "./StateCard";
import StateCardSkeleton from "./StateCardSkeleton";

interface Props {
  states: State[];
  selectedState?: State;
  onSelectState: (state: State) => void;
  loading?: boolean;
}

const allState: State = {
  id: "all",
  name: "All Regions in Ghana",
  countryId: "1",
  createdAt: "",
};

export default function StateList({
  states,
  selectedState,
  onSelectState,
  loading,
}: Props) {
  const { colors, spacing } = useTheme();

  // Header showing selected state
  const renderHeader = () => {
    if (!selectedState) return null;

    return (
      <>
        <AppView
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
              padding: spacing.md,
              marginBottom: spacing.md,
              borderRadius: spacing.sm,
            },
          ]}
        >
          <AppText
            variant="lg"
            fontWeight="bold"
            style={{ color: colors.primary, marginTop: spacing.xs }}
          >
            {selectedState.name}
          </AppText>
        </AppView>
        <StateCard
          state={allState}
          selected={selectedState.id === "all"}
          onPress={() => {
            onSelectState(allState);
          }}
        />
      </>
    );
  };

  if (loading) {
    return (
      <AppView style={{ paddingHorizontal: spacing.md }}>
        {[...Array(8)].map((_, index) => (
          <StateCardSkeleton key={index} />
        ))}
      </AppView>
    );
  }

  return (
    <FlatList
      data={states}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <StateCard
          state={item}
          selected={selectedState?.id === item.id}
          onPress={() => onSelectState(item)}
        />
      )}
      ListHeaderComponent={renderHeader}
      stickyHeaderIndices={selectedState ? [0] : []}
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
