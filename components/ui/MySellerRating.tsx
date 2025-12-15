import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import AppText from "./AppText";
import AppView from "./AppView";
import { TextButton } from "./TextButton";

type Props = {
  rating: number;
  totalReviews: number;
  onSeeReviews?: () => void;
  showReviewButton?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function MySellerRating({
  rating,
  totalReviews,
  onSeeReviews,
  showReviewButton = true,
  style,
}: Props) {
  const { colors, spacing, icons } = useTheme();

  // Render stars (5 total)
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Feather
            key={i}
            name="star"
            size={icons.md}
            color={colors.secondary}
            fill={colors.secondary}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <View key={i} style={{ position: "relative" }}>
            <Feather
              name="star"
              size={icons.md}
              color={colors.iconLightGray}
              fill={colors.iconLightGray}
            />
            <View
              style={{
                position: "absolute",
                overflow: "hidden",
                width: icons.md / 2,
              }}
            >
              <Feather
                name="star"
                size={icons.md}
                color={colors.secondary}
                fill={colors.secondary}
              />
            </View>
          </View>
        );
      } else {
        stars.push(
          <Feather
            key={i}
            name="star"
            size={icons.md}
            color={colors.iconLightGray}
            fill={colors.iconLightGray}
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
          gap: spacing.md,
        },
        style,
      ]}
    >
      {/* Left Side - Stars and Rating */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
        }}
      >
        <AppView style={{ gap: spacing.sm }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.xs,
            }}
          >
            {renderStars()}
          </View>

          <AppView
            style={{
              gap: spacing.xs,
              flexDirection: "row",
              alignItems: "baseline",
            }}
          >
            <AppText
              variant="md"
              fontWeight="medium"
              style={{ color: colors.text }}
            >
              {rating.toFixed(1)}
            </AppText>

            <AppText variant="sm" style={{ color: colors.textGray }}>
              ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
            </AppText>
          </AppView>
        </AppView>
      </View>

      {/* Right Side - See Reviews Button */}
      {showReviewButton && totalReviews > 0 && (
        <TextButton
          title="My Reviews"
          onPress={onSeeReviews}
          gradientColors={[colors.primary, colors.accent]}
          titleStyle={{
            color: colors.textWhite,
          }}
        />
      )}
    </View>
  );
}
