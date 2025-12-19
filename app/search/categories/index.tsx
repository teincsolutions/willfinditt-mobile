import CategoryList from "@/components/category/CategoryList";
import AppView from "@/components/ui/AppView";
import { useCategory, useParentCategories } from "@/hooks/useCategories";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { router, Stack, useLocalSearchParams } from "expo-router";

export default function CategoriesScreen() {
  const { source = "search" } = useLocalSearchParams<{ source?: string }>();
  const { data: categories = [], isLoading } = useParentCategories();
  const { categoryId } = useSearchFilters();
  const { data: selectedCategory } = useCategory(categoryId || "");

  return (
    <AppView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Categories" }} />
      <CategoryList
        loading={isLoading}
        selected={selectedCategory!}
        data={categories}
        onSelect={(cat) => {
          if (source === "filters") {
            router.replace({
              pathname: "/search/categories/[parentId]",
              params: { parentId: cat.id, source },
            });
          } else {
            router.push({
              pathname: "/search/categories/[parentId]",
              params: { parentId: cat.id, source },
            });
          }
        }}
      />
    </AppView>
  );
}
