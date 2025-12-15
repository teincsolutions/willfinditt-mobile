import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { useSaveAd, useUnsaveAd } from "@/hooks/useAds";
import { Ad } from "@/types";
import { Image, useImage } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import AppView from "../ui/AppView";
import { FavouriteButton } from "../ui/FavouriteButton";
import { SelectButton } from "../ui/SelectButton";

const { width: DEVICE_WIDTH } = Dimensions.get("window");

const blurhash = "LKO2?U%2Tw=w]~RBVZRi};RPxuwH";

export default function ProductCard({
  ad,
  style,
  selectMode,
  isSelected,
  showFavoriteButton = true,
  onSelectToggle,
  onPress,
  onLongPress,
}: {
  ad: Ad;
  style?: StyleProp<ViewStyle>;
  selectMode?: boolean;
  isSelected?: boolean;
  showFavoriteButton?: boolean;
  onSelectToggle?: (selected: boolean) => void;
  onPress?: () => void;
  onLongPress?: () => void;
}) {
  const { spacing, radius, colors } = useTheme();
  const width = (DEVICE_WIDTH - spacing.md * 2 - spacing.xs) / 2;

  const image = ad.images?.[0] || "";
  const [isSaved, setSaved] = useState(ad.isSaved === true);

  const saveAdMutation = useSaveAd();
  const unsaveAdMutation = useUnsaveAd();

  // useImage hook returns image info once fetched and loaded
  const imageRef = useImage(image);

  const [calculatedHeight, setCalculatedHeight] = useState(150);

  useEffect(() => {
    if (imageRef?.width && imageRef?.height) {
      // Calculate the new height based on the fixed width and original aspect ratio
      const newHeight = imageRef.height * (width / imageRef.width);
      setCalculatedHeight(newHeight);
    }
  }, [imageRef?.width, imageRef?.height, width]);

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
    <Pressable
    onLongPress={onLongPress}
      style={[
        styles.card,
        {
          borderRadius: radius.lg,
          width: width,
          marginBottom: spacing.sm,
          backgroundColor: colors.background,
          borderColor: colors.border,
          overflow: "hidden",
        },
        style,
      ]}
      onPress={selectMode ? () => onSelectToggle?.(!isSelected) : onPress}
    >
      {/* IMAGE */}
      <Image
        source={{ uri: image }}
        contentFit="cover"
        style={[
          styles.image,
          {
            height: calculatedHeight,
            width: "100%",
            backgroundColor: undefined,
          },
        ]}
        placeholder={{ blurhash }}
      />
      {selectMode && (
        <SelectButton
          active={isSelected || false}
          onToggle={(selected) => onSelectToggle?.(selected)}
        />
      )}

      {/* CONTENT */}
      <View style={{ padding: spacing.md, gap: spacing.xs }}>
        <AppText variant="md" numberOfLines={2}>
          {ad.title}
        </AppText>

        <AppView style={[styles.row]}>
          <AppView>
            {/* Supplier indication if needed */}
            {ad.price === 0 && (
              <AppText
                variant="sm"
                style={{ marginTop: 4, color: colors.primary }}
              >
                Contact for price
              </AppText>
            )}

            {ad.price ? (
              <AppText variant="md" style={{ marginTop: 4 }}>
                {ad.currency}
                {ad.price}
              </AppText>
            ) : null}
          </AppView>
          {/* SAVE HEART */}
          {showFavoriteButton && (
            <FavouriteButton active={isSaved} onToggle={handleToggleSave} />
          )}
        </AppView>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    position: "relative",
  },
  image: {},
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heart: {},
});
