import { useTheme } from "@/contexts/ThemeContext";
import { useAd, useSaveAd, useUnsaveAd } from "@/hooks/useAds";
import { formatCurrency } from "@/lib/formatCurrency";
import { Ad } from "@/types/ad";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import { FavouriteButton } from "../ui/FavouriteButton";

interface Props {
  ad?: Ad;
  adId?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const blurhash = "LKO2?U%2Tw=w]~RBVZRi};RPxuwH";

export function ProductCardSmallLandscape({ ad, adId, onPress, style }: Props) {
  const { colors, spacing } = useTheme();

  // Fetch ad if only adId is provided
  const { data: fetchedAd, isLoading } = useAd(adId || "", !!adId && !ad);
  const actualAd = ad || fetchedAd;

  if (isLoading) {
    return (
      <AppView
        style={[
          {
            padding: spacing.md,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.backgroundPrimary,
          },
          style,
        ]}
      >
        <ActivityIndicator size="small" color={colors.primary} />
      </AppView>
    );
  }

  if (!actualAd) {
    return null;
  }

  return <ProductCardContent ad={actualAd} onPress={onPress} style={style} />;
}

function ProductCardContent({
  ad,
  onPress,
  style,
}: {
  ad: Ad;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, spacing, radius } = useTheme();

  const [isSaved, setSaved] = useState(ad.isSaved === true);
  const saveAdMutation = useSaveAd();
  const unsaveAdMutation = useUnsaveAd();

  // Sync isSaved state with ad prop
  useEffect(() => {
    setSaved(ad.isSaved === true);
  }, [ad.isSaved]);

  const handleToggleSave = async (newState: boolean) => {
    setSaved(newState);
    try {
      if (newState) {
        await saveAdMutation.mutateAsync(ad.id);
      } else {
        await unsaveAdMutation.mutateAsync(ad.id);
      }
    } catch (error) {
      // Revert on error
      setSaved(!newState);
      console.error("Error toggling save:", error);
    }
  };

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
        placeholder={{ blurhash }}
      />

      <AppView style={styles.info}>
        <AppText style={[{ fontWeight: "600" }]} numberOfLines={2}>
          {ad.title}
        </AppText>

        <AppText style={[{ fontWeight: "700", marginTop: spacing.xs }]}>
          {ad.price ? formatCurrency(ad.price, 'en-GH', ad.currency) : "Contact for Price"}
        </AppText>
      </AppView>

      <FavouriteButton onToggle={handleToggleSave} active={isSaved} />
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
