import { useTheme } from "@/contexts/ThemeContext";
import { SellerProfile, User } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";
import AppText from "./AppText";
import { Avatar } from "./Avatar";
import MySellerRating from "./MySellerRating";

interface BusinessProfileHeaderProps {
  user?: User;
  sellerProfile: SellerProfile;
  onEditProfile: () => void;
  onShare: () => void;
}

export default function BusinessProfileHeader({
  user,
  sellerProfile,
  onEditProfile,
  onShare,
}: BusinessProfileHeaderProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.background,
          padding: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Avatar & Basic Info */}
      <View style={styles.headerTop}>
        <Avatar
          uri={user?.avatar}
          verified={sellerProfile.isVerified}
          size="xl"
        />

        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <AppText style={{ fontSize: 20, fontWeight: "700" }}>
            {sellerProfile.businessName}
          </AppText>
          <AppText
            style={{
              fontSize: 14,
              color: colors.textGray,
              marginTop: 2,
            }}
          >
            {sellerProfile.businessType}
          </AppText>

          {/* Rating */}
          <View style={{ marginTop: spacing.xs }}>
            <MySellerRating
              rating={sellerProfile.rating}
              totalReviews={sellerProfile.totalReviews || 1}
              showReviewButton={true}
              onSeeReviews={() => {}}
              style={{ paddingRight: spacing.md }}
            />
          </View>

          {/* Verification Badge */}
          {sellerProfile.isVerified && (
            <View
              style={[
                styles.verifiedBadge,
                {
                  backgroundColor: colors.success + "20",
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 4,
                  borderRadius: radius.sm,
                  marginTop: spacing.xs,
                  alignSelf: "flex-start",
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={colors.success}
              />
              <AppText
                style={{
                  color: colors.success,
                  fontSize: 12,
                  fontWeight: "600",
                  marginLeft: 4,
                }}
              >
                Verified Seller
              </AppText>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View
        style={[
          styles.actionButtons,
          { marginTop: spacing.md, gap: spacing.sm },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.primary,
              flex: 1,
              padding: spacing.sm,
              borderRadius: radius.md,
              alignItems: "center",
            },
          ]}
          onPress={onEditProfile}
        >
          <Ionicons name="pencil" size={18} color="#fff" />
          <AppText
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "600",
              marginLeft: 6,
            }}
          >
            Edit Profile
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.backgroundGray,
              flex: 1,
              padding: spacing.sm,
              borderRadius: radius.md,
              alignItems: "center",
            },
          ]}
          onPress={onShare}
        >
          <Ionicons name="share-social" size={18} color={colors.text} />
          <AppText
            style={{
              color: colors.text,
              fontSize: 14,
              fontWeight: "600",
              marginLeft: 6,
            }}
          >
            Share
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Description */}
      {sellerProfile.description && (
        <View style={{ marginTop: spacing.md }}>
          <AppText
            style={{
              fontSize: 14,
              color: colors.textGray,
              lineHeight: 20,
            }}
          >
            {sellerProfile.description}
          </AppText>
        </View>
      )}

      {/* Location */}
      {sellerProfile.city && (
        <View
          style={[
            styles.locationRow,
            {
              marginTop: spacing.sm,
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          <Ionicons name="location" size={16} color={colors.textGray} />
          <AppText
            style={{
              fontSize: 14,
              color: colors.textGray,
              marginLeft: 4,
            }}
          >
            {sellerProfile.city.name}
          </AppText>
        </View>
      )}

      {/* Website */}
      {sellerProfile.website && (
        <TouchableOpacity
          style={[
            styles.websiteRow,
            {
              marginTop: spacing.xs,
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
          onPress={() => {
            // TODO: Open website
            toast.info("Opening website");
          }}
        >
          <Ionicons name="globe" size={16} color={colors.primary} />
          <AppText
            style={{
              fontSize: 14,
              color: colors.primary,
              marginLeft: 4,
            }}
          >
            {sellerProfile.website}
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {},
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  locationRow: {},
  websiteRow: {},
});
