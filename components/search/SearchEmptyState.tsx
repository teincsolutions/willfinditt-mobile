import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function SearchEmptyState() {
  const { spacing, colors } = useTheme();

  return (
    <View style={[styles.wrap, { paddingTop: spacing.xxl }]}>
      <Image
        source={require("@/assets/icons/search-empty.png")}
        style={{ width: 180, height: 180, opacity: 0.9 }}
        contentFit="contain"
      />

      <AppText
        variant="lg"
        style={[{ fontWeight: "600", marginTop: spacing.lg }]}
      >
        Nothing in search
      </AppText>

      <AppText style={[{ color: colors.textGray, marginTop: spacing.sm }]}>
        Please search for a product
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
