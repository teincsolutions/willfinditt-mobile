import ProductCard from "@/components/ads/ProductCard";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/hooks/useTheme";
import { Ad } from "@/types/ad";
import { useState } from "react";
import { FlatList } from "react-native";
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

export default function FavoritesScreen() {
  const { icons, spacing, colors } = useTheme();
  const [query, setQuery] = useState("");

  const renderProduct = ({ item }: { item: Ad }) => (
    <AppView style={{ width: "48%", paddingHorizontal: spacing.sm }}>
      <ProductCard ad={item} />
    </AppView>
  );

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={ads}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingTop: spacing.md,
          paddingBottom: spacing.lg,
        }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
      />
    </AppView>
  );
}
