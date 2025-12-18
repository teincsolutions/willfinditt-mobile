import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/contexts/ThemeContext";
import { State } from "@/types/location";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchBar } from "../search/SearchBar";
import StateCard from "./StateCard";
import StateCardSkeleton from "./StateCardSkeleton";

interface Props {
  states: State[];
  selectedState?: State;
  onSelectState: (state: State) => void;
  loading?: boolean;
}

export default function StateList({
  states,
  selectedState,
  onSelectState,
  loading,
}: Props) {
  const { colors, spacing, radius, icons } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const filteredStates =
    states?.filter((state) =>
      state.name?.toLowerCase().includes(query.toLowerCase())
    ) || [];

  // Header showing selected state
  const renderHeader = React.useMemo(() => {
    return (
      <AppView
        style={[
          {
            gap: spacing.xs,
            paddingVertical: spacing.md,
          },
        ]}
      >
        <SearchBar
          value={query}
          onChangeText={setQuery}
          showSearchButton={false}
        />

        {selectedState && (
          <Pressable onPress={() => onSelectState(selectedState)}>
            <AppText
              variant="lg"
              fontWeight="bold"
              style={{ color: colors.primary, marginTop: spacing.xs }}
            >
              <Feather name="circle" size={icons.xs} /> {selectedState.name}
            </AppText>
          </Pressable>
        )}
      </AppView>
    );
  }, [query, selectedState, spacing, colors, icons]);

  const emptyState = React.useMemo(() => {
    return loading ? (
      <AppView style={{ gap: spacing.xs }}>
        {[...Array(15)].map((_, index) => (
          <StateCardSkeleton key={index} />
        ))}
      </AppView>
    ) : null;
  }, [loading, spacing]);

  const renderItem = React.useCallback(
    ({ item }: { item: State }) => (
      <StateCard
        state={item}
        selected={selectedState?.id === item.id}
        onPress={() => onSelectState(item)}
      />
    ),
    [selectedState, onSelectState]
  );

  const keyExtractor = React.useCallback((item: State) => item.id, []);

  return (
    <FlatList
      data={filteredStates}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={emptyState}
      stickyHeaderIndices={[0]}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
        paddingBottom: insets.bottom + spacing.md,
        gap: spacing.sm,
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
