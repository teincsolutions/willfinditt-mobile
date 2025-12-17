import CategoryList from "@/components/category/CategoryList";
import AppView from "@/components/ui/AppView";
import { useCategory, useSubcategories } from "@/hooks/useCategories";
import { useCategorySelection } from "@/hooks/useCategorySelection";
import { router, Stack, useLocalSearchParams } from "expo-router";

export default function SubCategoriesScreen() {
  const { parentId = "" } = useLocalSearchParams() as { parentId: string };
  const { data: parentCategory } = useCategory(parentId);
  const { data: categories = [], isLoading } = useSubcategories(parentId);
  const { selectedCategory, setSelectedCategory } = useCategorySelection();
  return (
    <AppView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: parentCategory?.name || "Categories",
        }}
      />
      <CategoryList
        loading={isLoading}
        selected={selectedCategory!}
        data={categories}
        onSelect={(cat) => {
          setSelectedCategory(cat);
          router.dismiss(2);
        }}
      />
    </AppView>
  );
}
