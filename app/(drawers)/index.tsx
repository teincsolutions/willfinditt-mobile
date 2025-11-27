// screens/HomeScreen.tsx

import React, { useState } from "react";
import { Dimensions, FlatList } from "react-native";

import ProductCard from "@/components/ads/ProductCard";
import { CategoryCardCircular } from "@/components/category/CategoryCardCircular";
import { CategoryList } from "@/components/category/CategoryList";
import SectionHeader from "@/components/category/SectionHeader";
import { PromoSlider } from "@/components/sliders/PromoSlider";
import AppView from "@/components/ui/AppView";
import FilterTabs from "@/components/ui/FilterTabs";
import SecondaryTextButton from "@/components/ui/SecondaryTextButton";
import { ToggleAction } from "@/components/ui/ToggleAction";
import { useTheme } from "@/contexts/ThemeContext";
import { Ad, Category } from "@/types";

const { width: DEVICE_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const { spacing, colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState("Trending");
  const [showAllCategories, setShowAllCategories] = useState(false);

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
      }}
    >
      {/* ALL CATEGORIES */}
      <SectionHeader
        title="All Categories"
        left={
          <ToggleAction
            toggle={showAllCategories}
            onToggle={setShowAllCategories}
          />
        }
      />

      <CategoryList
        data={categories}
        renderItem={({ item }) => <CategoryCardCircular category={item} />}
      />

      {/* SLIDER */}
      <PromoSlider
        data={[
          {
            source: require("@/assets/images/woman-with-shopping-bags.png"),
            title: "40–50% OFF",
            subtitle: "Now in all categories in WILLFINDITT",
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
  );

  return (
    <FlatList
      style={{ backgroundColor: colors.backgroundPrimary }}
      data={ads}
      numColumns={2}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      columnWrapperStyle={{
        justifyContent: "space-between",
        paddingHorizontal: spacing.md,
      }}
      renderItem={({ item }) => <ProductCard ad={item} />}
      contentContainerStyle={{
        paddingBottom: spacing.lg,
        gap: spacing.xs,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
