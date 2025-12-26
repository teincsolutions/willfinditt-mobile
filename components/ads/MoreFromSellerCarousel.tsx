import { useTheme } from "@/contexts/ThemeContext";
import { Ad } from "@/types";
import { router } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import AppText from "../ui/AppText";
import { ProductCardSmall } from "./ProductCardSmall";

export default function MoreFromSellerCarousel({ ads = [] }: { ads?: Ad[] }) {
  const { spacing } = useTheme();
  return (
    <View style={{ marginTop: spacing.md }}>
      <AppText
        variant="lg"
        style={{
          fontWeight: "700",
          marginBottom: spacing.md,
          marginStart: spacing.md,
        }}
      >
        More from seller
      </AppText>
      <FlatList
        data={ads}
        horizontal
        contentContainerStyle={{ gap: spacing.sm }}
        keyExtractor={(a) => a.id}
        renderItem={({ item }) => (
          <ProductCardSmall
            onPress={() =>
              router.push({
                pathname: "/ads/[adId]",
                params: { adId: item.id },
              })
            }
            ad={item}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
