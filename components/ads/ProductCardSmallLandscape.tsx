import { useTheme } from "@/contexts/ThemeContext";
import { Ad } from "@/types/ad";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import IconButton from "../ui/IconButton";

interface Props {
  ad: Ad;
  onPress?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
}

export function ProductCardSmallLandscape({
  ad,
  onPress,
  onToggleWishlist,
  isWishlisted = false,
}: Props) {
  const { colors, spacing, radius, icons } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.wrap,
        {
          backgroundColor: colors.background,
          padding: spacing.md,
          borderRadius: radius.lg,
        },
      ]}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: ad.images?.[0] || "" }}
        style={[
          styles.image,
          {
            borderRadius: radius.md,
            marginRight: spacing.md,
          },
        ]}
      />

      <AppView style={styles.info}>
        <AppText style={[{ fontWeight: "600" }]} numberOfLines={2}>
          {ad.title}
        </AppText>

        <AppText style={[{ fontWeight: "700", marginTop: spacing.xs }]}>
          {ad.currency}
          {ad.price}
        </AppText>
      </AppView>

      <IconButton
        icon={
          <Feather
            name="heart"
            size={icons.md}
            color={isWishlisted ? colors.primary : colors.iconBlack}
          />
        }
        onPress={onToggleWishlist}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
  },
  info: {
    flex: 1,
  },
});
