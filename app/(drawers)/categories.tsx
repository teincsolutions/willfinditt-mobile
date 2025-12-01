import BottomSheetOptionItem from "@/components/bottom-sheet/BottomSheetOptionItem";
import { SelectableListSheet } from "@/components/bottom-sheet/SelectableBottomSheet";
import { SelectBoxSheet } from "@/components/bottom-sheet/SelectBoxSheet";
import { CategoryCardCircular } from "@/components/category/CategoryCardCircular";
import { CategoryCardCircularSkeleton } from "@/components/category/CategoryCardCircularSkeleton";
import CategoryCardLandscape from "@/components/category/CategoryCardLandscape";
import CategoryCardLandscapeSkeleton from "@/components/category/CategoryCardLandscapeSkeleton";
import { EmptyCategoryCard } from "@/components/category/EmptyCategoryCard";
import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import { SearchBar } from "@/components/search/SearchBar";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { useTheme } from "@/hooks/useTheme";
import { Category } from "@/types/category";
import BottomSheet from "@gorhom/bottom-sheet";
import { Grid2, RowVertical } from "iconsax-react-nativejs";
import { useRef, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const items = [
  { id: "all", name: "All Condition" },
  { id: "new", name: "New" },
  { id: "like_new", name: "Like New" },
  { id: "good", name: "Good" },
  { id: "fair", name: "Fair" },
  { id: "poor", name: "Poor" },
];

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

  const sheetRef = useRef<BottomSheet>(null);
  const [selected, setSelected] = useState<string | number | null>("all");
  const [isGrid, setIsGrid] = useState(true);
  const isLoading = true;

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        left={<DrawerHeaderToggle />}
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
        rightSideStyle={{ marginRight: spacing.md }}
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
            sheetRef.current?.expand();
            console.log("Open sheet");
          }}
        />
      </Header>
      <SelectBoxSheet
        label="Condition"
        title="Select Condition"
        data={items}
        value={selected}
        style={{ marginHorizontal: spacing.md }}
        onDone={() => {
          sheetRef.current?.close();
        }}
        renderItem={({ item, index }) => (
          <BottomSheetOptionItem
            item={item}
            selected={selected === item.id}
            onPress={() => {
              setSelected(item.id);
            }}
          />
        )}
      />

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

      <SelectableListSheet
        ref={sheetRef}
        title="Condition"
        data={items}
        onDone={() => {
          sheetRef.current?.close();
        }}
        renderItem={({ item, index }) => (
          <BottomSheetOptionItem
            item={item}
            selected={selected === item.id}
            onPress={() => {
              setSelected(item.id);
            }}
          />
        )}
      />
    </AppView>
  );
}
