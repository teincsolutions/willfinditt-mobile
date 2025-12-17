import React, { useRef, useState } from "react";

import ProductCard from "@/components/ads/ProductCard";
import ProductCardSkeleton from "@/components/ads/ProductCardSkeleton";
import { CategoryCardCircular } from "@/components/category/CategoryCardCircular";
import { HomeCategoryList } from "@/components/category/HomeCategoryList";
import SectionHeader from "@/components/category/SectionHeader";
import DrawerHeaderRight from "@/components/drawer/DrawerHeaderRight";
import DrawerHeaderTitle from "@/components/drawer/DrawerHeaderTitle";
import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import { SearchBarPlaceholder } from "@/components/search/SearchBarPlaceholder";
import { PromoSlider } from "@/components/sliders/PromoSlider";
import AppView from "@/components/ui/AppView";
import FilterTabs from "@/components/ui/FilterTabs";
import { Header } from "@/components/ui/Header";
import SecondaryTextButton from "@/components/ui/SecondaryTextButton";
import { ToggleAction } from "@/components/ui/ToggleAction";
import { useTheme } from "@/contexts/ThemeContext";
import { useInfiniteSearchAds } from "@/hooks/useAds";
import { useParentCategories } from "@/hooks/useCategories";
import { Ad, AdSearchRequest, Promo } from "@/types";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MasonryList from "reanimated-masonry-list";

const promo: Promo[] = [
  {
    source: require("@/assets/images/woman-with-shopping-bags.png"),
    title: "Independence Sale is Here!",
    subtitle: "Get more for less from our sellers.",
    color: "#FFE5E5",
  },
  {
    source: require("@/assets/images/independence-square.png"),
    title: "Find products anywhere in Ghana",
    positionRight: true,
    subtitle: "Choose your location to find items near you.",
  },
];

export default function HomeScreen() {
  const insert = useSafeAreaInsets();
  const { spacing, colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState("Trending");
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Function to get search params based on selected tab
  const getSearchRequest = (tab: string): AdSearchRequest => {
    const baseParams = { limit: 20 };

    switch (tab) {
      case "Trending":
        return {
          search: { ...baseParams, sortBy: "views", sortOrder: "desc" },
        };
      case "Cheapest":
        return { search: { ...baseParams, sortBy: "price", sortOrder: "asc" } };
      case "New":
        return {
          search: { ...baseParams, sortBy: "createdAt", sortOrder: "desc" },
        };
      default:
        return { search: baseParams };
    }
  };

  const searchRequest = getSearchRequest(selectedTab);

  // fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } =
    useParentCategories();

  // fetch ads based on selected tab
  const {
    data: adsData,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingAds,
    isFetchingNextPage,
  } = useInfiniteSearchAds(searchRequest);

  const ads: Ad[] = adsData?.pages.flatMap((page) => page.data) || [];

  // Only show skeletons on initial load when there's no data yet
  const showSkeletons = isLoadingAds && ads.length === 0;

  // Animation values for search bar
  const lastScrollY = useRef(0);
  const stickThreshold = insert.top;
  const [isSearchBarStuck, setIsSearchBarStuck] = useState(false);
  const [isHeaderStuck, setIsHeaderStuck] = useState(false);

  // Handle scroll events for search bar animation
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    // Stick search bar when scrolling past threshold
    if (currentScrollY > stickThreshold && !isSearchBarStuck) {
      setIsSearchBarStuck(true);
    } else if (currentScrollY <= stickThreshold && isSearchBarStuck) {
      setIsSearchBarStuck(false);
    }
    const diff = currentScrollY - lastScrollY.current;

    // Stick header when scrolling up
    if (diff < 0 && !isHeaderStuck) {
      setIsHeaderStuck(true);
    } else if (diff > 0 && isHeaderStuck && currentScrollY > stickThreshold) {
      setIsHeaderStuck(false);
    }

    lastScrollY.current = currentScrollY;
  };

  const renderHeader = () => (
    <>
      <Header
        left={<DrawerHeaderToggle />}
        right={<DrawerHeaderRight />}
        title={<DrawerHeaderTitle />}
        containerStyle={{ paddingVertical: spacing.sm }}
      />

      <AppView
        style={{
          gap: spacing.md,
          backgroundColor: colors.backgroundPrimary,
        }}
      >
        <SearchBarPlaceholder
          onPress={() => router.push({ pathname: "/search" })}
          onPressFilter={() => {
            router.push({ pathname: "/search/locations/regions" });
          }}
          style={{ marginHorizontal: spacing.md }}
        />
        {/* ALL CATEGORIES */}
        <SectionHeader
          title="All Categories"
          style={{ alignItems: "center" }}
          left={
            <ToggleAction
              toggle={showAllCategories}
              onToggle={setShowAllCategories}
            />
          }
        />

        <HomeCategoryList
          data={categories}
          isLoading={isLoadingCategories}
          isGrid={showAllCategories}
          renderItem={({ item }) => (
            <CategoryCardCircular
              onPress={() =>
                router.push({
                  pathname: "/search/categories/[parentId]",
                  params: { parentId: item.id, source: "home" },
                })
              }
              category={item}
            />
          )}
        />
        {/* SLIDER */}
        <PromoSlider data={promo} />
        <AppView
          style={{
            backgroundColor: colors.background,
            paddingBottom: spacing.lg,
            paddingTop: 100 + spacing.md,
          }}
        >
          {/* FILTER TABS */}
          <FilterTabs
            selected={selectedTab}
            onSelect={setSelectedTab}
            tabs={["Trending", "Kumasi", "Cheapest", "New"]}
          />
          {/* NEW ARRIVAL */}
          <SectionHeader
            title="New Arrival"
            left={
              <SecondaryTextButton
                variant="lg"
                onPress={() => {
                  router.push({ pathname: "/search/results" });
                }}
                title="See All"
                titleStyle={{ color: colors.textGray }}
              />
            }
          />
        </AppView>
      </AppView>
    </>
  );

  return (
    <AppView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingBottom: insert.bottom,
      }}
    >
      {/* Sticky Search Bar */}
      {isSearchBarStuck && (
        <AppView
          style={{
            position: "absolute",
            paddingTop: insert.top,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: colors.backgroundPrimary,
            paddingVertical: spacing.sm,
            height: "auto",
          }}
        >
          {isHeaderStuck && (
            <Header
              left={<DrawerHeaderToggle />}
              right={<DrawerHeaderRight />}
              title={<DrawerHeaderTitle />}
              containerStyle={{
                paddingVertical: spacing.sm,
                paddingTop: 10,
              }}
            />
          )}
          <SearchBarPlaceholder
            onPress={() => router.push({ pathname: "/search" })}
            onPressFilter={() => {
              router.push({ pathname: "/search/locations/regions" });
            }}
            style={{ marginHorizontal: spacing.md }}
          />
        </AppView>
      )}

      {/* Scrollable Content */}
      <MasonryList
        style={{
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
          backgroundColor: colors.background,
        }}
        data={showSkeletons ? Array(6).fill({}) : ads}
        numColumns={2}
        keyExtractor={(item, index) => item.id || `skeleton-${index}`}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item, index }: any) => {
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
        contentContainerStyle={{}}
        loading={isFetchingNextPage}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </AppView>
  );
}
