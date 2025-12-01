import { CategoryCardCircular } from "@/components/category/CategoryCardCircular";
import { CategoryCardCircularSkeleton } from "@/components/category/CategoryCardCircularSkeleton";
import CategoryCardLandscape from "@/components/category/CategoryCardLandscape";
import CategoryCardLandscapeSkeleton from "@/components/category/CategoryCardLandscapeSkeleton";
import { EmptyCategoryCard } from "@/components/category/EmptyCategoryCard";
import { SearchBar } from "@/components/search/SearchBar";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { useTheme } from "@/hooks/useTheme";
import { Category } from "@/types/category";
import { router } from "expo-router";
import { Grid2, RowVertical } from "iconsax-react-nativejs";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Dummy data
const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    icon: "https://i.imgur.com/1.png",
    _count: { ads: 120 },
  },
  {
    id: "2",
    name: "Fashion",
    icon: "https://i.imgur.com/2.png",
    _count: { ads: 80 },
  },
  { id: "3", name: "Home", icon: "https://i.imgur.com/3.png" },
  { id: "4", name: "Books", icon: "https://i.imgur.com/4.png" },
  { id: "5", name: "Toys", icon: "https://i.imgur.com/5.png" },
  { id: "6", name: "Sports", icon: "https://i.imgur.com/6.png" },
];

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { icons, spacing, colors } = useTheme();
  const [query, setQuery] = useState("");
  const [isGrid, setIsGrid] = useState(true);
  const isLoading = true;

  useEffect(() => {
    return () => Keyboard.dismiss();
  }, []);

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        right={
          <IconButton
            onPress={() => setIsGrid(!isGrid)}
            icon={
              isGrid ? (
                <Grid2
                  variant="Outline"
                  color={colors.iconBlack}
                  size={icons.md}
                />
              ) : (
                <RowVertical
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
          paddingTop: insets.top,
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

      <FlatList
        data={categories}
        keyExtractor={(_, index) => index.toString()}
        numColumns={isGrid ? 4 : 1}
        showsHorizontalScrollIndicator={false}
        style={{ paddingTop: spacing.sm }}
        columnWrapperStyle={isGrid ? { gap: spacing.xs } : undefined}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          gap: spacing.sm,
          width: "100%",
        }}
        key={isGrid ? "grid" : "list"}
        renderItem={({ item }) =>
          isGrid ? (
            <CategoryCardCircular category={item} />
          ) : (
            <CategoryCardLandscape category={item} onPress={() => {}} />
          )
        }
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
