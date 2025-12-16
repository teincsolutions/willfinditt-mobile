import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import { TextButton } from "../ui/TextButton";

type Props = {
  rating: number;
  totalReviews: number;
  onReviewPress?: () => void;
  showReviewButton?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function SellerRating({
  rating,
  totalReviews,
  onReviewPress,
  showReviewButton = true,
  style,
}: Props) {
  const { colors, spacing, icons, fontSizes } = useTheme();

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
            size={icons.sm}
            color={colors.secondary}
            fill={colors.secondary}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <View key={i} style={{ position: "relative" }}>
            <Feather
              name="star"
              size={icons.sm}
              color={colors.iconLightGray}
              fill={colors.iconLightGray}
            />
            <View
              style={{
                position: "absolute",
                overflow: "hidden",
                width: icons.sm / 2,
              }}
            >
              <Feather
                name="star"
                size={icons.sm}
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
            size={icons.sm}
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
          alignItems: "flex-end",
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
        <AppView style={{ gap: spacing.sm}}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.xs,
            }}
          >
            {renderStars()}
          </View>

          <AppView style={{ gap: spacing.xs, flexDirection: "row", alignItems: "baseline" }}>
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

      {/* Right Side - Review Button */}
      {showReviewButton && (
        <TextButton
          title="Write Review"
          onPress={onReviewPress}
          gradientColors={[colors.primary, colors.accent]}
          style={{ height: 32 }}
          titleStyle={{ fontSize: fontSizes.sm, color: colors.textWhite, fontWeight: "600" }}
    
        />
      )}
    </View>
  );
}
