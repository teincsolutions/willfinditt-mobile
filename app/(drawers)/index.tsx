// screens/HomeScreen.tsx

import React, { useState } from "react";
import { FlatList, View } from "react-native";

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

  const ads: Ad[] = [];

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
        data={[]}
        renderItem={({ item }) => <CategoryCardCircular category={item} />}
      />

      {/* SLIDER */}
      <PromoSlider
        data={[
          {
            image: "https://i.imgur.com/kLOU0R8.png",
            title: "40–50% OFF",
            subtitle: "Now in all categories in WILLFINDITT",
          },
          {
            image: "https://i.imgur.com/EFltsW9.png",
            title: "Find products anywhere in Ghana",
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
        paddingHorizontal: spacing.lg,
      }}
      renderItem={({ item }) => (
        <View style={{ width: "48%" }}>
          <ProductCard ad={item} />
        </View>
      )}
      contentContainerStyle={{
        paddingBottom: spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
