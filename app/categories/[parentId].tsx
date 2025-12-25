import CategoryList from "@/components/category/CategoryList";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/contexts/ThemeContext";
import { useCategory, useSubcategories } from "@/hooks/useCategories";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { router, Stack, useLocalSearchParams } from "expo-router";

export default function SubCategoriesScreen() {
  const { spacing } = useTheme();
  const { parentId = "", source = "search" } = useLocalSearchParams() as {
    parentId: string;
    source?: string;
  };
  const { data: parentCategory } = useCategory(parentId);
  const { data: categories = [], isLoading } = useSubcategories(parentId);
  const { setCategoryId, categoryId } = useSearchFilters();
  const { data: selectedCategory } = useCategory(categoryId || "");

  const handleNavigateNext = () => {
    if (source === "filters") {
      router.dismiss(2);
    } else {
      router.replace({
        pathname: "/results",
        params: { parentId: categoryId, source },
      });
    }
  };

  return (
    <AppView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: parentCategory?.name || "Categories" }} />
      <CategoryList
        loading={isLoading}
        selectedCategory={selectedCategory}
        selected={selectedCategory!}
        data={categories}
        onSelect={(cat) => {
          setCategoryId(cat.id);
          handleNavigateNext();
        }}
      />
    </AppView>
  );
}
