import { useTheme } from "@/contexts/ThemeContext";
import { Category } from "@/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ReactElement } from "react";
import { FlatList } from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import { CategoryCardCircularSkeleton } from "./CategoryCardCircularSkeleton";

export function CategoryList({
  data,
  renderItem,
  isGrid = false,
  onEndReached,
  isLoading,
}: {
  data: Category[];
  renderItem: ({ item }: { item: Category }) => ReactElement;
  isGrid?: boolean;
  onEndReached?: () => void;
  isLoading?: boolean;
}) {
  const { spacing, colors, icons } = useTheme();

  // Render loading state
  if (isLoading) {
    return (
      <AppView
        style={{
          paddingHorizontal: isGrid ? spacing.md : spacing.lg,
          gap: spacing.md,
          ...(isGrid
            ? { flexDirection: "row", flexWrap: "wrap" }
            : { flexDirection: "row" }),
        }}
      >
        {isGrid
          ? Array(8)
              .fill(null)
              .map((_, index) => <CategoryCardCircularSkeleton key={index} />)
          : Array(4)
              .fill(null)
              .map((_, index) => <CategoryCardCircularSkeleton key={index} />)}
      </AppView>
    );
  }

  // Render empty state
  if (data.length === 0) {
    return (
      <AppView
        style={{
          alignItems: "center",
          flex: 1,
          gap: spacing.md,
        }}
      >
        <MaterialCommunityIcons
          name="package-variant-closed-remove"
          size={icons.xl}
          color={colors.iconGray}
        />
        <AppText style={{ textAlign: "center", color: colors.textGray }}>
          No Categories Found
        </AppText>
      </AppView>
    );
  }

  // Grid layout - render in a simple View without ScrollView
  if (isGrid) {
    return (
      <AppView
        style={{
          paddingHorizontal: spacing.md,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing.xs,
        }}
      >
        {data.map((item, key) => <AppView key={key}>{renderItem({ item })}</AppView>)}
      </AppView>
    );
  }

  // Horizontal list layout - use FlatList
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.lg,
        gap: spacing.xs,
      }}
      horizontal
      initialNumToRender={4}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}
