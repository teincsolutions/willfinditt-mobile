// screens/HomeScreen.tsx

import React, { useRef, useState } from "react";
import { Animated } from "react-native";

import ProductCard from "@/components/ads/ProductCard";
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
import { Ad, Category } from "@/types";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MasonryList from "reanimated-masonry-list";

export default function HomeScreen() {
  const insert = useSafeAreaInsets();
  const { spacing, colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState("Trending");
  const [showAllCategories, setShowAllCategories] = useState(false);

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

  // Dummy data
  const categories: Category[] = [
    { id: "1", name: "Electronics", icon: "https://i.imgur.com/1.png" },
    { id: "2", name: "Fashion", icon: "https://i.imgur.com/2.png" },
    { id: "3", name: "Home", icon: "https://i.imgur.com/3.png" },
    { id: "4", name: "Books", icon: "https://i.imgur.com/4.png" },
    { id: "5", name: "Toys", icon: "https://i.imgur.com/5.png" },
    { id: "6", name: "Sports", icon: "https://i.imgur.com/6.png" },
  ];

  const ads: Ad[] = [
    {
      id: "1",
      title: "Smartphone",
      price: 299.99,
      images: [
        "https://images-na.ssl-images-amazon.com/images/I/61zIwprkyhL._SX355_.jpg",
      ],
      description: "A great smartphone with awesome features.",
      currency: "GHS",
      views: 150,
      isNegotiable: true,
      userId: "user1",
      categoryId: "1",
    },
    {
      id: "2",
      title: "Running Shoes",
      price: 79.99,
      images: ["http://img.wfrcdn.com/lf/50/hash/1888/3170512/1/1159583.jpg"],
      description: "Comfortable and durable running shoes.",
      currency: "GHS",
      views: 85,
      isNegotiable: false,
      userId: "user2",
      categoryId: "6",
    },
    {
      id: "3",
      title: "Coffee Maker",
      price: 49.99,
      images: [
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      description: "Brew the perfect cup of coffee every morning.",
      currency: "GHS",
      views: 60,
      isNegotiable: true,
      userId: "user3",
      categoryId: "3",
    },

    {
      id: "4",
      title: "Wireless Headphones",
      price: 99.99,
      images: [
        "https://images.unsplash.com/photo-1704307068094-c2c88c467014?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      description: "Experience high-quality sound without the wires.",
      currency: "GHS",
      views: 120,
      isNegotiable: false,
      userId: "user4",
      categoryId: "1",
    },
    {
      id: "5",
      title: "Mountain Bike",
      price: 499.99,
      images: [
        "https://images.unsplash.com/photo-1699528136769-d795893462c6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      description: "Conquer any terrain with this rugged mountain bike.",
      currency: "GHS",
      views: 45,
      isNegotiable: true,
      userId: "user5",
      categoryId: "6",
    },
  ];

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
        isGrid={showAllCategories}
        renderItem={({ item }) => <CategoryCardCircular category={item} />}
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
            router.push({ pathname: "/(search)/locations" });
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
        data={ads}
        numColumns={2}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item, index }: { item: Ad; index: number }) => (
          <ProductCard
            onPress={() =>
              router.push({ pathname: "/[adId]", params: { adId: item.id } })
            }
            ad={item}
          />
        )}
        contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </AppView>
  );
}
