import CategoryList from "@/components/category/CategoryList";
import AppView from "@/components/ui/AppView";
import { useParentCategories } from "@/hooks/useCategories";
import { useCategorySelection } from "@/hooks/useCategorySelection";
import { useTheme } from "@/hooks/useTheme";
import { Category } from "@/types";
import { router } from "expo-router";

export default function CategoriesScreen() {
  const { spacing, colors } = useTheme();
  const { data: categories = [], isLoading } = useParentCategories();
  const { selectedParentCategory, setSelectedParentCategory } =
    useCategorySelection();

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <CategoryList
        selected={selectedParentCategory!}
        data={categories}
        loading={isLoading}
        onSelect={(category: Category) => {
          setSelectedParentCategory(category);
          router.push({
            pathname: "/ads/categories/[parentId]",
            params: { parentId: category.id },
          });
        }}
      />
    </AppView>
  );
}
