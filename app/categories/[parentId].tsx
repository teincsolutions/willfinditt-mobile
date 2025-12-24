import CategoryList from "@/components/category/CategoryList";
import AppView from "@/components/ui/AppView";
import { useCategory, useSubcategories } from "@/hooks/useCategories";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function SubCategoriesScreen() {
  const { parentId = "", source = "search" } = useLocalSearchParams() as {
    parentId: string;
    source?: string;
  };
  const { data: parentCategory } = useCategory(parentId);
  const { data: categories = [], isLoading } = useSubcategories(parentId);
  const { setCategoryId, categoryId } = useSearchFilters();
  const { data: selectedCategory } = useCategory(categoryId || "");

  const handleNavigateNext = () => {
    router.dismiss(2);
  };

  useEffect(() => {
    return () => {
      if (source !== "filters") router.push("/results");
    };
  }, []);

  return (
    <AppView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: parentCategory?.name || "Categories",
        }}
      />
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
