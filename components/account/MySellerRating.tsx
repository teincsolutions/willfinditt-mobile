import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import { TextButton } from "../ui/TextButton";

type Props = {
  rating: number;
  totalReviews: number;
  style?: StyleProp<ViewStyle>;
  title?: string | React.ReactNode;
  onPress?: () => void;
};

export default function MySellerRating({
  rating,
  totalReviews,
  style,
  title,
  onPress,
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
          <Ionicons
            key={i}
            name="star"
            size={icons.xs}
            color={colors.primary}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons
            key={i}
            name="star-half"
            size={icons.xs}
            color={colors.primary}
          />
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
    <Pressable
      onPress={onPress}
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
          gap: 2,
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
        {title ? (
          <AppText variant="xs" style={{ fontWeight: "600" }}>
            {rating.toFixed(1)} <AppText variant="xs">({totalReviews})</AppText>
          </AppText>
        ) : null}
        <TextButton
          onPress={onPress}
          titleStyle={{ fontSize: fontSizes.xs }}
          style={{
            height: icons.md,
            paddingHorizontal: spacing.xs,
            minWidth: 50,
          }}
          title={
            title || (
              <>
                {rating.toFixed(1)}
                <AppText style={{ fontWeight: "400", fontSize: fontSizes.xs }}>
                  ({totalReviews})
                </AppText>
              </>
            )
          }
        />
      </AppView>
    </Pressable>
  );
}
