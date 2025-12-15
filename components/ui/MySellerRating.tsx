import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import AppText from "./AppText";
import AppView from "./AppView";
import { TextButton } from "./TextButton";

type Props = {
  rating: number;
  totalReviews: number;
  style?: StyleProp<ViewStyle>;
};

export default function MySellerRating({ rating, totalReviews, style }: Props) {
  const { colors, spacing, icons, fontSizes } = useTheme();

  // Render stars (5 total)
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons
            key={i}
            name="star"
            size={icons.xs}
            color={colors.primary}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons name="star-half" size={icons.xs} color={colors.primary} />
        );
      } else {
        stars.push(
          <Ionicons
            key={i}
            name="star-outline"
            size={icons.xs}
            color={colors.primary}
          />
        );
      }
    }

    return stars;
  };

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
        },
        style,
      ]}
    >
      {/* Left Side - Stars and Rating */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap:2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          {renderStars()}
        </View>
      </View>
      <AppView
        style={{
          gap: spacing.sm,
          flexDirection: "row",
          alignItems: "baseline",
        }}
      >
        <AppText
          variant="sm"
          fontWeight="medium"
          style={{ color: colors.text }}
        >
          {rating.toFixed(1)}
        </AppText>

        <TextButton
          titleStyle={{ fontSize: fontSizes.xs }}
          style={{ height: 32, paddingHorizontal: spacing.xs }}
          title={`(${totalReviews}) My Reviews`}
        />
      </AppView>
    </View>
  );
}
