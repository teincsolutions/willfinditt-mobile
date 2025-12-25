// components/Drawer/DrawerPromoCard.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import AppText from "../ui/AppText";
import IconButton from "../ui/IconButton";

export default function DrawerPromoCard({ onPress }: { onPress?: () => void }) {
  const { spacing, radius, colors, icons } = useTheme();

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
          paddingTop: spacing.md,
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
        Click here to open your shop
      </AppText>

      <Image
        source={require("@/assets/images/drawer-promo.png")}
        style={styles.image}
        contentFit="contain"
      />
      <IconButton
        style={{ position: "absolute", bottom: 10, right: 10 }}
        icon={<Feather name="arrow-right" size={icons.md} color={colors.iconBlack} />}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    height: 150,
  },
  image: {
    width: 150,
    height: 100,
    marginTop: -14,
  },
});
