import ProductCard from "@/components/ads/ProductCard";
import ProductCardSkeleton from "@/components/ads/ProductCardSkeleton";
import { SelectableListSheet } from "@/components/bottom-sheet/SelectableBottomSheet";
import SheetRadioOptionItem from "@/components/bottom-sheet/SheetRadioOptionItem";
import HorizontalFilters from "@/components/search/HorizontalFilters";
import ResultsCount from "@/components/search/ResultsCount";
import { SearchBarPlaceholder } from "@/components/search/SearchBarPlaceholder";
import SortModal, { SortOption } from "@/components/search/SortModal";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useInfiniteSearchAds } from "@/hooks/useAds";
import { useCategory } from "@/hooks/useCategories";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { Ad, AdCondition, AdSearchRequest } from "@/types";
import BottomSheet from "@gorhom/bottom-sheet";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { FilterSearch, Grid2, RowVertical } from "iconsax-react-nativejs";
import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MasonryList from "reanimated-masonry-list";

const conditionOptions = [
  { id: AdCondition.NEW, name: "New", value: AdCondition.NEW },
  { id: AdCondition.LIKE_NEW, name: "Like New", value: AdCondition.LIKE_NEW },
  { id: AdCondition.GOOD, name: "Good", value: AdCondition.GOOD },
  { id: AdCondition.FAIR, name: "Fair", value: AdCondition.FAIR },
  { id: AdCondition.POOR, name: "Poor", value: AdCondition.POOR },
];

export default function ResultsScreen() {
  const { colors, spacing, icons, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const conditionSheetRef = useRef<BottomSheet>(null);
  const isInitialSync = useRef(true);

  const params = useLocalSearchParams<{
    query?: string;
    categoryId?: string;
  }>();

  const {
    filters,
    categoryId,
    cityId,
    activeFiltersCount,
    setQuery,
    setCategoryId,
    setSorting,
    setConditions,
    clearFilterOptions,
  } = useSearchFilters();

  const { data: selectedCategory } = useCategory(categoryId || "");

  // Local search state for input
  const [searchQuery, setSearchQuery] = useState(
    params.query || filters?.query || ""
  );

  // Modal states
  const [showSortModal, setShowSortModal] = useState(false);
  const [isGrid, setIsGrid] = useState(true);

  // Derived sort value for display
  const selectedSortValue = `${filters?.sortBy || "createdAt"}-${
    filters?.sortOrder || "desc"
  }`;

  // Update filters from URL params on mount only
  useEffect(() => {
    if (isInitialSync.current) {
      if (params.query && params.query !== filters?.query) {
        setQuery(params.query);
      }
      if (params.categoryId && params.categoryId !== categoryId) {
        setCategoryId(params.categoryId);
      }
      isInitialSync.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build search request from filters
  const searchRequest: AdSearchRequest = {
    search: {
      page: filters?.page || 1,
      limit: filters?.limit || 20,
      query: filters?.query || undefined,
      categoryIds: filters?.categoryIds,
      cityIds: filters?.cityIds,
      conditions: filters?.conditions,
      priceMin: filters?.priceMin,
      priceMax: filters?.priceMax,
      sortBy: filters?.sortBy || "createdAt",
      sortOrder: filters?.sortOrder || "desc",
      fieldValues: filters?.fieldValues,
    },
  };

  // Fetch ads
  const {
    data: adsData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteSearchAds(searchRequest);

  const ads: Ad[] = adsData?.pages.flatMap((page) => page.data) || [];
  const totalResults = adsData?.pages[0]?.meta?.total || 0;
  const showSkeletons = isLoading && ads.length === 0;

  const handleClearSearch = () => {
    setSearchQuery("");
    setQuery(undefined);
  };

  const handleSortSelect = (option: SortOption) => {
    setSorting(option.sortBy, option.sortOrder);
  };

  const clearAllFilters = () => {
    clearFilterOptions();
  };

  const renderHeader = () => (
    <>
      <SearchBarPlaceholder
        value={searchQuery}
        style={{ paddingHorizontal: spacing.md }}
        onClear={handleClearSearch}
        onPress={() =>
          router.replace({
            pathname: "/search",
            params: {
              q: searchQuery,
              categoryId: categoryId || undefined,
            },
          })
        }
        placeholder="Search for products..."
        rightIcon={
          <IconButton
            style={{
              marginRight: -spacing.sm,
              backgroundColor: colors.primary,
              borderWidth: 2,
              borderColor: colors.iconWhite,
            }}
            onPress={() => router.push({ pathname: "/filters" })}
            icon={<FilterSearch size={icons.md} color={colors.iconWhite} />}
          />
        }
      />

      <AppView
        style={{
          marginTop: spacing.md,
          backgroundColor: colors.background,
          paddingBottom: spacing.md,
        }}
      >
        {/* Results Count */}
        <ResultsCount
          totalResults={totalResults}
          activeFiltersCount={activeFiltersCount}
          onClearAll={clearAllFilters}
        />

        {/* Horizontal Filters */}
        <HorizontalFilters
          selectedSortValue={selectedSortValue}
          onSortPress={() => setShowSortModal(true)}
          minPrice={filters?.priceMin}
          maxPrice={filters?.priceMax}
          onPriceFilterPress={() => router.push({ pathname: "/filters" })}
          selectedCityId={cityId}
          onLocationPress={() =>
            router.push({ pathname: "/locations/regions" })
          }
          onConditionPress={() => conditionSheetRef.current?.expand()}
        />

        <AppText
          style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}
        >
          Search results for{" "}
          <AppText style={{ fontWeight: "600" }}>
            &quot;{searchQuery || selectedCategory?.name || ""}&quot;
          </AppText>
        </AppText>
      </AppView>
    </>
  );

  return (
    <AppView
      style={{
        flex: 1,
        backgroundColor: colors.backgroundPrimary,
        paddingBottom: insets.bottom,
      }}
    >
      <Stack.Screen
        options={{
          title: "",
          header: () => (
            <Header
              right={
                <IconButton
                  onPress={() => setIsGrid(!isGrid)}
                  icon={
                    isGrid ? (
                      <Grid2
                        onPress={() => setIsGrid(false)}
                        variant="Outline"
                        color={colors.iconBlack}
                        size={icons.md}
                      />
                    ) : (
                      <RowVertical
                        onPress={() => setIsGrid(true)}
                        variant="Outline"
                        color={colors.iconBlack}
                        size={icons.md}
                      />
                    )
                  }
                />
              }
              containerStyle={{ paddingHorizontal: spacing.md }}
            />
          ),
        }}
      />

      {/* Results Grid */}
      <MasonryList
        style={{
          paddingHorizontal: spacing.md,
        }}
        containerStyle={{
          backgroundColor: colors.background,
        }}
        ListHeaderComponentStyle={{
          backgroundColor: colors.backgroundPrimary,
          marginBottom: spacing.sm,
        }}
        data={showSkeletons ? Array(6).fill({}) : ads}
        numColumns={2}
        keyExtractor={(item, index) => item.id || `skeleton-${index}`}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item }: any) => {
          if (showSkeletons) {
            return <ProductCardSkeleton />;
          }
          return (
            <ProductCard
              onPress={() =>
                router.push({
                  pathname: "/ads/[adId]",
                  params: { adId: item.id },
                })
              }
              ad={item}
            />
          );
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.1}
        loading={isFetchingNextPage}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <AppView
              style={{
                padding: spacing.xl,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText
                variant="lg"
                style={{ color: colors.textGray, textAlign: "center" }}
              >
                No results found
              </AppText>
              <AppText
                variant="sm"
                style={{
                  color: colors.textGray,
                  textAlign: "center",
                  marginTop: spacing.sm,
                }}
              >
                Try adjusting your filters or search query
              </AppText>
            </AppView>
          ) : null
        }
      />

      {/* Sort Modal */}
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        selectedSort={selectedSortValue}
        onSelectSort={handleSortSelect}
      />

      <SelectableListSheet
        ref={conditionSheetRef}
        title="Condition"
        snapPoints={["50%"]}
        data={conditionOptions}
        onDone={() => {
          conditionSheetRef.current?.close();
        }}
        onClear={() => {
          setConditions([]);
          conditionSheetRef.current?.close();
        }}
        renderItem={({ item, index }) => (
          <SheetRadioOptionItem
            item={item}
            selected={filters?.conditions?.includes(item.value)}
            onPress={() => {
              setConditions([item.value]);
              conditionSheetRef.current?.close();
            }}
          />
        )}
      />
    </AppView>
  );
}
