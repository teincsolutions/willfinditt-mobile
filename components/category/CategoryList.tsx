import { useTheme } from "@/contexts/ThemeContext";
import { Category } from "@/types";
import { ReactElement } from "react";
import { FlatList } from "react-native";
import AppView from "../ui/AppView";
import { CategoryCardCircularSkeleton } from "./CategoryCardCircular";

export function CategoryList({
  data,
  renderItem,
  isGrid = false,
  onEndReached,
}: {
  data: Category[];
  renderItem: ({ item }: { item: Category }) => ReactElement;
  isGrid?: boolean;
  onEndReached?: () => void;
}) {
  const { spacing } = useTheme();

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      numColumns={isGrid ? 4 : 1}
      contentContainerStyle={{
        paddingHorizontal: isGrid ? spacing.md : spacing.lg,
        gap: spacing.md,
      }}
      key={isGrid ? "grid" : "list"}
      horizontal={!isGrid}
      initialNumToRender={isGrid ? 8 : 4}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
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
            : Array(3)
                .fill(null)
                .map((_, index) => (
                  <CategoryCardCircularSkeleton key={index} />
                ))}
        </AppView>
      }
    />
  );
}
