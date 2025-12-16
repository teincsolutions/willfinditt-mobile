// components/Drawer/DrawerPromoCard.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import AppText from "../ui/AppText";

export default function DrawerPromoCard({ onPress }: { onPress?: () => void }) {
  const { spacing, radius, colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          marginTop: spacing.md,
          borderRadius: radius.xl,
          marginBottom: spacing.md,
          backgroundColor: colors.black,
          paddingTop: spacing.lg,
          paddingHorizontal: spacing.md,
          borderColor: colors.border,
          borderWidth: 1,
        },
      ]}
    >
      <AppText
        variant="lg"
        style={[{ color: colors.textWhite, textAlign: "center" }]}
      >
        Open your shop and sell here
      </AppText>

      <Image
        source={require("@/assets/images/drawer-promo.png")}
        style={styles.image}
        contentFit="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 120,
    marginBottom: -8,
  },
});
