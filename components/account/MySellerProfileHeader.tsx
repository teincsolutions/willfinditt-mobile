import { useTheme } from "@/contexts/ThemeContext";
import { SellerProfile, User } from "@/types/user";
import { Feather } from "@expo/vector-icons";
import { Edit } from "iconsax-react-nativejs";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import { Avatar } from "../ui/Avatar";
import IconButton from "../ui/IconButton";
import MySellerRating from "./MySellerRating";

interface MySellerProfileHeaderProps {
  user?: User;
  sellerProfile: SellerProfile;
  style?: StyleProp<ViewStyle>;
  onEditProfile: () => void;
  onShare: () => void;
  onViewProfile?: () => void;
  onReviewsPress?: () => void;
}

export default function MySellerProfileHeader({
  user,
  sellerProfile,
  style,
  onEditProfile,
  onShare,
  onViewProfile,
  onReviewsPress,
}: MySellerProfileHeaderProps) {
  const { colors, spacing, icons } = useTheme();

  return (
    <View
      style={[
        {
          gap: spacing.sm,
          padding: spacing.md,
        },
        style,
      ]}
    >
      {/* Avatar & Basic Info */}
      <View style={{ flexDirection: "row" }}>
        <Avatar
          backgroundColor={colors.iconWhite}
          uri={user?.avatar}
          verified={sellerProfile.isVerified}
          size="lg"
          borderSize={1}
          onPress={onViewProfile}
        />

        <AppView style={{ flex: 1, marginLeft: spacing.md, gap: spacing.xs }}>
          <AppText variant="lg" style={{ fontWeight: "700" }}>
            {sellerProfile.businessName}
          </AppText>
          <AppText variant="md">{sellerProfile.businessType}</AppText>

          {/* Rating */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MySellerRating
              onPress={onReviewsPress}
              rating={sellerProfile.rating || 2.5}
              totalReviews={sellerProfile.totalReviews || 1}
            />

            <View
              style={{
                flexDirection: "row",
                gap: spacing.sm,
                paddingBottom: spacing.md,
              }}
            >
              <IconButton
                icon={<Edit size={icons.md} color={colors.iconBlack} />}
                onPress={onEditProfile}
              />
              <IconButton
                icon={
                  <Feather name="share-2" size={18} color={colors.iconBlack} />
                }
                onPress={onShare}
              />
            </View>
          </View>
        </AppView>
      </View>
    </View>
  );
}
