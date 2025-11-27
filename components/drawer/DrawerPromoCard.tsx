// components/Drawer/DrawerPromoCard.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet } from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";

export default function DrawerPromoCard() {
  const { spacing, radius, colors } = useTheme();

  return (
    <AppView
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
    </AppView>
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
