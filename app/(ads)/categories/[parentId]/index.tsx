import CategoryCardLandscape from "@/components/category/CategoryCardLandscape";
import CategoryCardLandscapeSkeleton from "@/components/category/CategoryCardLandscapeSkeleton";
import { EmptyCategoryCard } from "@/components/category/EmptyCategoryCard";
import { SearchBar } from "@/components/search/SearchBar";
import AppView from "@/components/ui/AppView";
import { BackButton } from "@/components/ui/BackButton";
import { Header } from "@/components/ui/Header";
import { useCategory, useSubcategories } from "@/hooks/useCategories";
import { useCategorySelection } from "@/hooks/useCategorySelection";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList } from "react-native-gesture-handler";

export default function SubCategoriesScreen() {
  const { parentId = "" } = useLocalSearchParams() as { parentId: string };
  const { data: parentCategory } = useCategory(parentId);
  const { spacing, colors } = useTheme();
  const { data: categories, isLoading } = useSubcategories(parentId);
  const { setSelectedCategory, setSelectedParentCategory } =
    useCategorySelection();
  const [query, setQuery] = useState("");
  const filteredCategories =
    categories?.filter((cat) =>
      cat.name?.toLowerCase().includes(query.toLowerCase())
    ) || [];

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <Header
              left={<BackButton label="Cancel" showIcon={false} />}
              title={parentCategory?.name || "Categories"}
              navRowStyle={{ paddingHorizontal: spacing.md }}
              containerStyle={{
                paddingBottom: spacing.sm,
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
        showsHorizontalScrollIndicator={false}
        style={{ paddingTop: spacing.sm, backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          width: "100%",
        }}
        renderItem={({ item }) => (
          <CategoryCardLandscape
            category={item}
            onPress={() => {
              setSelectedCategory(item);
              setSelectedParentCategory(parentCategory);
              router.dismissAll();
            }}
          />
        )}
        ItemSeparatorComponent={() => (
          <AppView style={{ height: spacing.xs }} />
        )}
        ListEmptyComponent={() =>
          isLoading ? (
            <AppView style={{ gap: spacing.md }}>
              {Array(6)
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
