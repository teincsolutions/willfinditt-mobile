import CategoryList from "@/components/category/CategoryList";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useCategory, useCategoryCounts, useSubcategories } from "@/hooks/useCategories";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { router, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { StackActions } from "@react-navigation/native";

export default function SubCategoriesScreen() {
  const { spacing } = useTheme();
  const { parentId = "", source = "search" } = useLocalSearchParams() as {
    parentId: string;
    source?: string;
  };
  const { data: parentCategory } = useCategory(parentId);
  const { data: categories = [], isLoading } = useSubcategories(parentId);
  const { setCategoryId, categoryId, cityId } = useSearchFilters();
  const { data: selectedCategory } = useCategory(categoryId || "");
  // Counts scoped to the selected location (visible ads only).
  const { data: counts } = useCategoryCounts(cityId ? { cityIds: cityId } : {});
  const navigation = useNavigation();

  const handleNavigateNext = (selectedCategoryId: string) => {
    if (source === "filters") {
      // Pop categories/index + this screen to return to the Filters sheet.
      navigation.dispatch(StackActions.pop(2));
    } else {
      // When navigating from category, pass categoryId param
      router.push({
        pathname: "/results",
        params: { categoryId: selectedCategoryId },
      });
    }
  };

  return (
    <AppView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title={parentCategory?.name || "Categories"} />
      <CategoryList
        loading={isLoading}
        selectedCategory={selectedCategory}
        selected={selectedCategory!}
        data={categories}
        counts={counts}
        onSelect={(cat) => {
          setCategoryId(cat.id);
          handleNavigateNext(cat.id);
        }}
      />
    </AppView>
  );
}
