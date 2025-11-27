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
import { useTheme } from "@/contexts/ThemeContext";
import { Ad, Category } from "@/types";

export default function HomeScreen({
  categories,
  ads,
}: {
  categories: Category[];
  ads: Ad[];
}) {
  const { spacing, colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState("Trending");

  const renderHeader = () => (
    <AppView
      style={{
        gap: spacing.md,
        backgroundColor: colors.backgroundPrimary,
      }}
    >
      {/* ALL CATEGORIES */}
      <SectionHeader title="All Categories" onPress={() => {}} />

      <CategoryList
        data={categories}
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
      <SectionHeader title="New Arrival" onPress={() => {}} />
    </AppView>
  );

  return (
    <FlatList
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
        backgroundColor: colors.background,
        paddingBottom: spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
