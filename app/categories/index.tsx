import { CategoryCardCircular } from "@/components/category/CategoryCardCircular";
import { CategoryCardCircularSkeleton } from "@/components/category/CategoryCardCircularSkeleton";
import CategoryCardLandscape from "@/components/category/CategoryCardLandscape";
import CategoryCardLandscapeSkeleton from "@/components/category/CategoryCardLandscapeSkeleton";
import { EmptyCategoryCard } from "@/components/category/EmptyCategoryCard";
import { SearchBar } from "@/components/search/SearchBar";
import AppView from "@/components/ui/AppView";
import { BackButton } from "@/components/ui/BackButton";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { useParentCategories } from "@/hooks/useCategories";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack } from "expo-router";
import { Grid2, RowVertical } from "iconsax-react-nativejs";
import { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { icons, spacing, colors } = useTheme();
  const { data: categories, isLoading } = useParentCategories();
  const [query, setQuery] = useState("");
  const [isGrid, setIsGrid] = useState(true);
  const filteredCategories =
    categories?.filter((cat) =>
      cat.name?.toLowerCase().includes(query.toLowerCase())
    ) || [];

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          header: () => (
            <Header
              left={<BackButton label="Cancel" showIcon={false} />}
              right={
                <IconButton
                  onPress={() => setIsGrid(!isGrid)}
                  icon={
                    isGrid ? (
                      <Grid2
                        onPress={() => setIsGrid(false)}
                        variant="Outline"
                        color={colors.iconBlack}
                        size={icons.md}
                      />
                    ) : (
                      <RowVertical
                        onPress={() => setIsGrid(true)}
                        variant="Outline"
                        color={colors.iconBlack}
                        size={icons.md}
                      />
                    )
                  }
                />
              }
              navRowStyle={{ marginHorizontal: spacing.md }}
              title="All Categories"
              containerStyle={{
                paddingBottom: spacing.lg, 
              }}
            >
              <SearchBar
                style={{ marginHorizontal: spacing.md }}
                value={query}
                onChangeText={setQuery}
                onPressFilter={() => {
                  router.push("/(search)/filters");
                }}
              />
            </Header>
          ),
        }}
      />
      <FlatList
        data={filteredCategories}
        keyExtractor={(item, index) => item.id || index.toString()}
        numColumns={isGrid ? 4 : 1}
        showsHorizontalScrollIndicator={false}
        style={{ paddingTop: spacing.sm, backgroundColor: colors.background }}
        columnWrapperStyle={isGrid ? { gap: spacing.xs } : undefined}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          width: "100%",
        }}
        key={isGrid ? "grid" : "list"}
        extraData={isGrid}
        renderItem={({ item }) =>
          isGrid ? (
            <CategoryCardCircular
              category={item}
              onPress={() => {
                router.push({
                  pathname: "/categories/[parentId]",
                  params: { parentId: item.id },
                });
              }}
            />
          ) : (
            <CategoryCardLandscape
              category={item}
              onPress={() => {
                router.push({
                  pathname: "/categories/[parentId]",
                  params: { parentId: item.id },
                });
              }}
            />
          )
        }
        ItemSeparatorComponent={() => (
          <AppView style={{ height: spacing.xs }} />
        )}
        ListEmptyComponent={() =>
          isLoading ? (
            <AppView
              style={{
                gap: spacing.md,
                ...(isGrid
                  ? { flexDirection: "row", flexWrap: "wrap" }
                  : { flexDirection: "column" }),
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
                      <CategoryCardLandscapeSkeleton key={index} />
                    ))}
            </AppView>
          ) : (
            <EmptyCategoryCard />
          )
        }
      />
    </AppView>
  );
}
