import { useTheme } from "@/contexts/ThemeContext";
import { SellerProfile, User } from "@/types/user";
import { Edit, Export } from "iconsax-react-nativejs";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import AppText from "./AppText";
import { Avatar } from "./Avatar";
import IconButton from "./IconButton";
import MySellerRating from "./MySellerRating";

interface BusinessProfileHeaderProps {
  user?: User;
  sellerProfile: SellerProfile;
  style?: StyleProp<ViewStyle>;
  onEditProfile: () => void;
  onShare: () => void;
}

export default function BusinessProfileHeader({
  user,
  sellerProfile,
  style,
  onShare,
}: BusinessProfileHeaderProps) {
  const { colors, spacing, radius, icons } = useTheme();

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
        />

        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <AppText variant="lg" style={{ fontWeight: "700" }}>
            {sellerProfile.businessName}
          </AppText>
          <AppText variant="md">{sellerProfile.businessType}</AppText>

          {/* Rating */}
          <View style={{ marginTop: spacing.xs }}>
            <MySellerRating
              rating={sellerProfile.rating || 2.5}
              totalReviews={sellerProfile.totalReviews || 1}
              style={{ paddingRight: spacing.md }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            paddingBottom: spacing.md,
          }}
        >
          <IconButton
            icon={<Edit size={icons.md} color={colors.iconBlack} />}
            onPress={onShare}
          />
          <IconButton
            icon={<Export size={icons.md} color={colors.iconBlack} />}
            onPress={onShare}
          />
        </View>
      </View>
    </View>
  );
}
