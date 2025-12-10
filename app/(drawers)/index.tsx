// screens/HomeScreen.tsx

import React, { useRef, useState } from "react";
import { Animated } from "react-native";

import ProductCard from "@/components/ads/ProductCard";
import ProductCardSkeleton from "@/components/ads/ProductCardSkeleton";
import { CategoryCardCircular } from "@/components/category/CategoryCardCircular";
import { CategoryList } from "@/components/category/CategoryList";
import SectionHeader from "@/components/category/SectionHeader";
import { SearchBarPlaceholder } from "@/components/search/SearchBarPlaceholder";
import { PromoSlider } from "@/components/sliders/PromoSlider";
import AppView from "@/components/ui/AppView";
import FilterTabs from "@/components/ui/FilterTabs";
import SecondaryTextButton from "@/components/ui/SecondaryTextButton";
import { ToggleAction } from "@/components/ui/ToggleAction";
import { useTheme } from "@/contexts/ThemeContext";
import { useInfiniteSearchAds } from "@/hooks/useAds";
import { useParentCategories } from "@/hooks/useCategories";
import { Ad, AdSearchRequest } from "@/types";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MasonryList from "reanimated-masonry-list";

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
  const searchBarOpacity = useRef(new Animated.Value(1)).current;

  // Handle scroll events for search bar animation
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const diff = currentScrollY - lastScrollY.current;

    // Detect scroll direction with minimal threshold
    if (Math.abs(diff) > 1) {
      if (diff > 0 && currentScrollY > 50) {
        // Scrolling down - hide search bar
        Animated.timing(searchBarOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (diff < 0) {
        // Scrolling up - show search bar
        Animated.timing(searchBarOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
      lastScrollY.current = currentScrollY;
    }
  };

  const renderHeader = () => (
    <AppView
      style={{
        gap: spacing.md,
        backgroundColor: colors.backgroundPrimary,
        paddingTop: 70, // Space for fixed search bar
      }}
    >
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

      <CategoryList
        data={categories}
        isLoading={isLoadingCategories}
        isGrid={showAllCategories}
        renderItem={({ item }) => (
          <CategoryCardCircular
            onPress={() =>
              router.push({
                pathname: "/categories/[parentId]",
                params: { parentId: item.id },
              })
            }
            category={item}
          />
        )}
      />
      {/* SLIDER */}
      <PromoSlider
        data={[
          {
            source: require("@/assets/images/woman-with-shopping-bags.png"),
            title: "Independence Sale is Here!",
            subtitle: "Get more for less from our sellers.",
            color: colors.text,
          },
          {
            source: require("@/assets/images/independence-square.png"),
            title: "Find products anywhere in Ghana",
            positionRight: true,
            subtitle: "Choose your location to find items near you.",
          },
        ]}
      />
      <AppView
        style={{
          backgroundColor: colors.background,
          paddingBottom: spacing.lg,
          paddingTop: 100,
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
              onPress={() => {}}
              title="See All"
              titleStyle={{ color: colors.textGray }}
            />
          }
        />
      </AppView>
    </AppView>
  );

  return (
    <AppView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingBottom: insert.bottom,
      }}
    >
      {/* Fixed Search Bar */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          paddingHorizontal: spacing.md,
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
          backgroundColor: colors.backgroundPrimary,
          opacity: searchBarOpacity,
        }}
      >
        <SearchBarPlaceholder
          onPress={() => router.push({ pathname: "/(search)" })}
          onPressFilter={() => {
            router.push({ pathname: "/regions" });
          }}
        />
      </Animated.View>

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
                router.push({ pathname: "/[adId]", params: { adId: item.id } })
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
