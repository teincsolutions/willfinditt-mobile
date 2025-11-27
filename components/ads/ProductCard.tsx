// components/home/ProductCard.tsx
import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { Ad } from "@/types";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function ProductCard({ ad }: { ad: Ad }) {
  const { spacing, radius, colors } = useTheme();

  const image = ad.images?.[0] || "";
  const isSaved = ad.isSaved === true;

  return (
    <Pressable
      style={[
        styles.card,
        { borderRadius: radius.lg, marginBottom: spacing.lg },
      ]}
    >
      {/* IMAGE */}
      <Image
        source={{ uri: image }}
        style={[styles.image, { borderRadius: radius.lg }]}
      />

      {/* CONTENT */}
      <View style={{ padding: spacing.md }}>
        <AppText variant="md" numberOfLines={1}>
          {ad.title}
        </AppText>

        {/* Supplier indication if needed */}
        {ad.price === 0 && (
          <AppText variant="sm" style={{ marginTop: 4, color: colors.primary }}>
            Contact for price
          </AppText>
        )}

        {ad.price ? (
          <AppText variant="md" style={{ marginTop: 4 }}>
            {ad.currency}
            {ad.price}
          </AppText>
        ) : null}
      </View>

      {/* SAVE HEART */}
      <Pressable style={styles.heart}>
        <Feather
          name={isSaved ? "heart" : "heart"}
          size={20}
          color={isSaved ? colors.primary : colors.text}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EEE",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 150,
  },
  heart: {
    position: "absolute",
    right: 12,
    top: 12,
  },
});
