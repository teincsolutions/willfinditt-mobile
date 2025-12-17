import ProductCard from "@/components/ads/ProductCard";
import ProductCardSkeleton from "@/components/ads/ProductCardSkeleton";
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
import { Ad, AdCondition, AdSearchRequest } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { Grid2, RowVertical } from "iconsax-react-nativejs";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MasonryList from "reanimated-masonry-list";

export default function ResultsScreen() {
  const { colors, spacing, icons } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    query?: string;
    categoryId?: string;
  }>();

  // Search state
  const [searchQuery, setSearchQuery] = useState(params.query || "");
  const [activeQuery, setActiveQuery] = useState(params.query || "");

  // Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(params.categoryId);
  const [selectedCityId, setSelectedCityId] = useState<string | undefined>(
    undefined
  );
  const [selectedConditions, setSelectedConditions] = useState<AdCondition[]>(
    []
  );
  const [minPrice, setMinPrice] = useState<number | undefined>(0);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(1000000);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedSortValue, setSelectedSortValue] = useState("recent");

  // Modal states
  const [showSortModal, setShowSortModal] = useState(false);

  // Build search request
  const searchRequest: AdSearchRequest = {
    search: {
      limit: 20,
      query: activeQuery || undefined,
      categoryIds: selectedCategoryId ? [selectedCategoryId] : undefined,
      cityIds: selectedCityId ? [selectedCityId] : undefined,
      conditions:
        selectedConditions.length > 0 ? selectedConditions : undefined,
      priceMin: minPrice,
      priceMax: maxPrice,
      sortBy,
      sortOrder,
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
  const [isGrid, setIsGrid] = useState(true);

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveQuery("");
  };

  const handleSortSelect = (option: SortOption) => {
    setSortBy(option.sortBy);
    setSortOrder(option.sortOrder);
    setSelectedSortValue(option.value);
  };

  const clearAllFilters = () => {
    setSelectedCategoryId(undefined);
    setSelectedCityId(undefined);
    setSelectedConditions([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
  };

  const activeFiltersCount =
    (selectedCategoryId ? 1 : 0) +
    (selectedCityId ? 1 : 0) +
    selectedConditions.length +
    (minPrice || maxPrice ? 1 : 0);

  const renderHeader = () => (
    <>
      <Header
        containerStyle={{ paddingHorizontal: spacing.md }}
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
      >
        <SearchBarPlaceholder
          style={{ flex: 1 }}
          value={searchQuery}
          onClear={handleClearSearch}
          onPress={() =>
            router.push({
              pathname: "/search",
              params: {
                query: searchQuery,
                categoryId: selectedCategoryId || undefined,
              },
            })
          }
          placeholder="Search for products..."
        />
      </Header>

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
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceFilterPress={() =>
            router.push({ pathname: "/search/filters" })
          }
          selectedCityId={selectedCityId}
          onLocationPress={() => router.push({ pathname: "/search/locations/regions" })}
        />

        <AppText
          style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}
        >
          Search results for{" "}
          <AppText style={{ fontWeight: "600" }}>"{searchQuery}"</AppText>
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
                router.push({ pathname: "/ads/[adId]", params: { adId: item.id } })
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
    </AppView>
  );
}
