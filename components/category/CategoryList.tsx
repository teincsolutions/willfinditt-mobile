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

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      columnWrapperStyle={isGrid ? { gap: spacing.xs } : undefined}
      numColumns={isGrid ? 5 : 1}
      contentContainerStyle={{
        paddingHorizontal: isGrid ? spacing.md : spacing.lg,
        gap: spacing.xs,
        width: "100%",
      }}
      key={isGrid ? "grid" : "list"}
      extraData={isGrid}
      horizontal={!isGrid}
      initialNumToRender={isGrid ? 8 : 4}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        isLoading ? (
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
                  .map((_, index) => (
                    <CategoryCardCircularSkeleton key={index} />
                  ))
              : Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <CategoryCardCircularSkeleton key={index} />
                  ))}
          </AppView>
        ) : (
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
            {/* You can add a "No Categories Found" message here if needed */}
            <AppText style={{ textAlign: "center", color: colors.textGray }}>
              No Categories Found
            </AppText>
          </AppView>
        )
      }
    />
  );
}
