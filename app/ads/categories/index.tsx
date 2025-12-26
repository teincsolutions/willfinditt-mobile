import CategoryList from "@/components/category/CategoryList";
import AppView from "@/components/ui/AppView";
import { useCategory, useParentCategories } from "@/hooks/useCategories";
import { useCategorySelection } from "@/hooks/useCategorySelection";
import { useTheme } from "@/hooks/useTheme";
import { Category } from "@/types";
import { router } from "expo-router";

export default function CategoriesScreen() {
  const {  colors } = useTheme();
  const { data: categories = [], isLoading } = useParentCategories();
  const { selectedParentCategoryId, setSelectedParentCategoryId } =
    useCategorySelection();
  const { data: selectedParentCategory } = useCategory(
    selectedParentCategoryId || ""
  );

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <CategoryList
        selected={selectedParentCategory!}
        data={categories}
        loading={isLoading}
        onSelect={(category: Category) => {
          setSelectedParentCategoryId(category.id);
          router.push({
            pathname: "/ads/categories/[parentId]",
            params: { parentId: category.id },
          });
        }}
      />
    </AppView>
  );
}
