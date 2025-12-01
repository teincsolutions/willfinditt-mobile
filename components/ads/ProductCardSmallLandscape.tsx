import { useTheme } from "@/contexts/ThemeContext";
import { Ad } from "@/types/ad";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import { FavouriteButton } from "../ui/FavouriteButton";

interface Props {
  ad: Ad;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ProductCardSmallLandscape({ ad, onPress, style }: Props) {
  const { colors, spacing, radius } = useTheme();

  const [toggle, onToggleWishlist] = useState(false);

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
        style,
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

      <FavouriteButton onToggle={onToggleWishlist} active={toggle} />
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
