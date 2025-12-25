import CategoryList from "@/components/category/CategoryList";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/contexts/ThemeContext";
import { useCategory, useParentCategories } from "@/hooks/useCategories";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { router, useLocalSearchParams } from "expo-router";

export default function CategoriesScreen() {
  const { spacing } = useTheme();
  const { source = "home" } = useLocalSearchParams<{ source?: string }>();
  const { data: categories = [], isLoading } = useParentCategories();
  const { categoryId } = useSearchFilters();
  const { data: selectedCategory } = useCategory(categoryId || "");

  return (
    <AppView style={{ flex: 1 }}>
      <CategoryList
        loading={isLoading}
        selectedCategory={selectedCategory}
        selected={selectedCategory?.parent!}
        data={categories}
        onSelect={(cat) => {
          router.push({
            pathname: "/categories/[parentId]",
            params: { parentId: cat.id, source },
          });
        }}
      />
    </AppView>
  );
}
