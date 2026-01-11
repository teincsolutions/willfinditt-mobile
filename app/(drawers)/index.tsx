import React, { useRef, useState } from "react";

import ProductCard from "@/components/ads/ProductCard";
import ProductCardSkeleton from "@/components/ads/ProductCardSkeleton";
import VerificationBanner from "@/components/auth/VerificationBanner";
import { CategoryCardCircular } from "@/components/category/CategoryCardCircular";
import { HomeCategoryList } from "@/components/category/HomeCategoryList";
import SectionHeader from "@/components/category/SectionHeader";
import DrawerHeaderRight from "@/components/drawer/DrawerHeaderRight";
import DrawerHeaderTitle from "@/components/drawer/DrawerHeaderTitle";
import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import { SearchBarPlaceholder } from "@/components/search/SearchBarPlaceholder";
import { PromoSlider } from "@/components/sliders/PromoSlider";
import AppView from "@/components/ui/AppView";
import CustomRefreshControl from "@/components/ui/CustomRefreshControl";
import FilterTabs from "@/components/ui/FilterTabs";
import { Header } from "@/components/ui/Header";
import SecondaryTextButton from "@/components/ui/SecondaryTextButton";
import { ToggleAction } from "@/components/ui/ToggleAction";
import { useTheme } from "@/contexts/ThemeContext";
import { useInfiniteSearchAds } from "@/hooks/useAds";
import { useAuth } from "@/hooks/useAuth";
import { useParentCategories } from "@/hooks/useCategories";
import { useCityById } from "@/hooks/useLocations";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { Ad, AdSearchRequest, Promo } from "@/types";
import { deduplicateAds } from "@/utils/deduplicate";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native";
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
  const { cityId } = useSearchFilters();
  const { data: city } = useCityById(cityId!);
  const { user } = useAuth();
  const [isVerificationBannerVisible, setIsVerificationBannerVisible] =
    useState(!user?.isVerified);

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
      case city?.name ?? "":
        return {
          search: {
            ...baseParams,
            cityIds: [city!.id],
            sortBy: "createdAt",
            sortOrder: "desc",
          },
        };
      default:
        return { search: baseParams };
    }
  };

  const searchRequest = getSearchRequest(selectedTab);

  // fetch categories
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
    isRefetching: isRefetchingCategories,
  } = useParentCategories();

  // fetch ads based on selected tab
  const {
    data: adsData,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingAds,
    isFetchingNextPage,
    isRefetching: isRefetchingAds,
    refetch: refetchAds,
  } = useInfiniteSearchAds(searchRequest);

  const ads: Ad[] = deduplicateAds(
    adsData?.pages.flatMap((page) => page.data) || []
  );

  // Only show skeletons on initial load when there's no data yet
  const showSkeletons = isLoadingAds && ads.length === 0;
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchAds(), refetchCategories()]);
    setRefreshing(false);
  };

  // Animation values for search bar
  const lastScrollY = useRef(0);
  const stickThreshold = insert.top;
  const [isSearchBarStuck, setIsSearchBarStuck] = useState(false);
  const [isHeaderStuck, setIsHeaderStuck] = useState(false);
  const pullToRefreshThreshold = -100; // Pull down 100 pixels to trigger refresh
  const isRefreshingRef = useRef(false);

  // Handle scroll events for search bar animation and pull-to-refresh
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    // Check for pull-to-refresh (when scrolled past top)
    if (currentScrollY < pullToRefreshThreshold && !isRefreshingRef.current && !refreshing) {
      isRefreshingRef.current = true;
      onRefresh().finally(() => {
        isRefreshingRef.current = false;
      });
    }

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
            router.push({ pathname: "/locations/regions" });
          }}
          filterValue={city?.name}
          style={{ marginHorizontal: spacing.md }}
        />

        {/* Verification Banner */}
        <VerificationBanner
          visible={isVerificationBannerVisible}
          onDismiss={() => setIsVerificationBannerVisible(false)}
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
                  pathname: "/categories/[parentId]",
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
            paddingBottom: spacing.md,
            paddingTop: 100 + spacing.md,
          }}
        >
          {/* FILTER TABS */}
          <FilterTabs
            selected={selectedTab}
            onSelect={setSelectedTab}
            tabs={[city?.name ?? "", "Trending", "Cheapest", "New"]}
          />
          {/* NEW ARRIVAL */}
          <SectionHeader
            title="New Arrival"
            left={
              <SecondaryTextButton
                variant="lg"
                onPress={() => {
                  router.replace({ pathname: "/results" });
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
        backgroundColor: colors.backgroundPrimary,
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
              router.push({ pathname: "/locations/regions" });
            }}
            filterValue={city?.name}
            style={{ marginHorizontal: spacing.md }}
          />
        </AppView>
      )}

      {/* Custom Refresh Indicator */}
      <CustomRefreshControl
        position="top-center"
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {/* Scrollable Content */}
      <MasonryList
        style={{
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
          backgroundColor: colors.background,
        }}
        contentContainerStyle={{
          paddingBottom: insert.bottom,
        }}
        data={showSkeletons ? Array(6).fill({}) : ads}
        numColumns={2}
        keyExtractor={(item, index) => item.id || index.toString()}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item, index }: any) => {
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
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListFooterComponent={
          <AppView
            style={{ paddingVertical: spacing.md, alignItems: "center" }}
          >
            {isFetchingNextPage && <ActivityIndicator />}
          </AppView>
        }
      />
    </AppView>
  );
}