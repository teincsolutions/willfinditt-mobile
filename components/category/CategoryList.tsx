import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/contexts/ThemeContext";
import { Category } from "@/types";
import React, { useState } from "react";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchBar } from "../search/SearchBar";
import CategoryCardLandscape from "./CategoryCardLandscape";
import CategoryCardLandscapeSkeleton from "./CategoryCardLandscapeSkeleton";
import { EmptyCategoryCard } from "./EmptyCategoryCard";

interface Props {
  data: Category[];
  selected?: Category;
  onSelect: (category: Category) => void;
  loading?: boolean;
}

export default function CategoryList({
  data: categories,
  selected,
  onSelect,
  loading,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius } = useTheme();
  const [query, setQuery] = useState("");
  const filteredCategories =
    categories?.filter((cat) =>
      cat.name?.toLowerCase().includes(query.toLowerCase())
    ) || [];

  // Header showing selected city
  const renderHeader = () => {
    return (
      <AppView
        style={[
          {
            gap: spacing.xs,
            marginVertical: spacing.md,
          },
        ]}
      >
        <SearchBar
          value={query}
          onChangeText={setQuery}
          showSearchButton={false}
        />

        {selected && (
          <AppText
            variant="lg"
            fontWeight="bold"
            style={{ color: colors.primary, marginTop: spacing.xs }}
          >
            {selected.name}
          </AppText>
        )}
      </AppView>
    );
  };

  const emptyState = () => {
    return loading ? (
      <AppView style={{ paddingHorizontal: spacing.md }}>
        {[...Array(10)].map((_, index) => (
          <CategoryCardLandscapeSkeleton key={index} />
        ))}
      </AppView>
    ) : (
      <EmptyCategoryCard />
    );
  };

  return (
    <FlatList
      data={filteredCategories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CategoryCardLandscape
          category={item}
          selected={selected?.id === item.id}
          onPress={() => onSelect(item)}
        />
      )}
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
