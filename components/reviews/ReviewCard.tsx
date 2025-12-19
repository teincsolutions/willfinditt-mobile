import { useTheme } from "@/hooks/useTheme";
import { formatTime } from "@/lib/formatTime";
import { SellerReview } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Clock } from "iconsax-react-nativejs";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import { Avatar } from "../ui/Avatar";

interface Props {
  review: SellerReview;
}

export function ReviewCard({ review }: Props) {
  const { colors, spacing, radius, icons } = useTheme();

  // Render stars (5 total)
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={icons.xs} color={colors.yellow} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons
            key={i}
            name="star-half"
            size={icons.xs}
            color={colors.yellow}
          />
        );
      } else {
        stars.push(
          <Ionicons
            key={i}
            name="star-outline"
            size={icons.xs}
            color={colors.yellow}
          />
        );
      }
    }

    return stars;
  };

  return (
    <AppView
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderRadius: radius.md,
          padding: spacing.md,
        },
      ]}
    >
      {/* Header: Avatar, Name, Rating */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            size="sm"
            uri={review.reviewer?.avatar}
            name={review.reviewer?.firstName || "U"}
          />
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            <AppText
              variant="md"
              style={{ color: colors.text, fontWeight: "600" }}
            >
              {review.reviewer?.firstName} {review.reviewer?.lastName}
            </AppText>
            <AppText
              variant="sm"
              style={{ color: colors.textGray, marginTop: 2 }}
            >
              <Clock size={12} color={colors.iconGray} />{" "}
              {formatTime(review.createdAt)}
            </AppText>
          </View>
        </View>
        <AppView style={{ alignItems: "center" }}>
          <AppText style={{ fontWeight: "600" }}>
            {review.rating.toFixed(1)}{" "}
            <AppText style={{ color: colors.textLightGray }}>rating</AppText>
          </AppText>
          <AppView style={{ flexDirection: "row" }}>
            {renderStars(review.rating)}
          </AppView>
        </AppView>
      </View>

      {/* Comment */}
      {review.comment && (
        <AppText
          variant="md"
          style={{
            color: colors.textGray,
            marginTop: spacing.sm,
            lineHeight: 20,
          }}
        >
          {review.comment}
        </AppText>
      )}
    </AppView>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
