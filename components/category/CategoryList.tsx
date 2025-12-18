import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/contexts/ThemeContext";
import { Category } from "@/types";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Pressable } from "react-native";
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
  const { colors, spacing, radius, icons } = useTheme();
  const [query, setQuery] = useState("");
  const filteredCategories =
    categories?.filter((cat) =>
      cat.name?.toLowerCase().includes(query.toLowerCase())
    ) || [];

  // Header showing selected city
  const renderHeader = React.useMemo(() => {
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
          <Pressable>
            <AppText
              variant="lg"
              fontWeight="bold"
              style={{ color: colors.primary, marginTop: spacing.xs }}
            >
              <Feather name="circle" size={icons.xs} /> {selected.name}
            </AppText>
          </Pressable>
        )}
      </AppView>
    );
  }, [query, selected, spacing, colors, icons]);

  const emptyState = React.useMemo(() => {
    return loading ? (
      <AppView style={{ gap: spacing.sm }}>
        {[...Array(10)].map((_, index) => (
          <CategoryCardLandscapeSkeleton key={index} />
        ))}
      </AppView>
    ) : (
      <EmptyCategoryCard />
    );
  }, [loading, spacing]);

  const renderItem = React.useCallback(
    ({ item }: { item: Category }) => (
      <CategoryCardLandscape
        category={item}
        selected={selected?.id === item.id}
        onPress={() => onSelect(item)}
      />
    ),
    [selected, onSelect]
  );

  const keyExtractor = React.useCallback((item: Category) => item.id, []);

  return (
    <FlatList
      data={filteredCategories}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
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
