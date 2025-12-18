import { useTheme } from "@/hooks/useTheme";
import { formatTime } from "@/lib/formatTime";
import { SellerReview } from "@/types";
import { Feather } from "@expo/vector-icons";
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

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Feather
          key={i}
          name="star"
          size={icons.sm}
          color={i <= rating ? colors.warning : colors.iconGray}
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={styles.starsRow}>{stars}</View>;
  };

  return (
    <AppView
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderRadius: radius.md,
          padding: spacing.md,
          marginBottom: spacing.sm,
        },
      ]}
    >
      {/* Header: Avatar, Name, Rating */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            size={42}
            uri={review.reviewer?.avatar}
            name={review.reviewer?.firstName || "U"}
          />
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            <AppText variant="md" fontWeight="semibold" style={{ color: colors.text }}>
              {review.reviewer?.firstName} {review.reviewer?.lastName}
            </AppText>
            <AppText variant="xs" style={{ color: colors.textGray, marginTop: 2 }}>
              {formatTime(review.createdAt)}
            </AppText>
          </View>
        </View>
        {renderStars(review.rating)}
      </View>

      {/* Comment */}
      {review.comment && (
        <AppText
          variant="sm"
          style={{
            color: colors.text,
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
