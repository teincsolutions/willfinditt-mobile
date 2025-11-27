import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { Ad } from "@/types";
import { Image } from "expo-image";
import React from "react";
import { Pressable } from "react-native";

interface ProductCardSmallProps {
  ad: Ad;
  onPress?: () => void;
}

export function ProductCardSmall({ ad, onPress }: ProductCardSmallProps) {
  const { radius, spacing, card } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        { width: 120 },
        {
          padding: card.padding,
          gap: card.gap,
          borderRadius: card.radius,
        },
      ]}
    >
      <Image
        source={{ uri: ad.images?.[0] }}
        style={{ width: 120, height: 90, borderRadius: radius.md }}
      />
      {ad.price > 0 && (
        <AppText variant="sm" style={{ marginTop: 4 }}>
          {ad.currency}
          {ad.price}
        </AppText>
      )}

      {ad.price == 0 && (
        <AppText variant="sm" style={{ marginTop: 4 }}>
          Contact for price
        </AppText>
      )}
    </Pressable>
  );
}
