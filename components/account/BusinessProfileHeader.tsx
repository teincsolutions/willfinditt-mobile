import { useTheme } from "@/contexts/ThemeContext";
import { SellerProfile, User } from "@/types/user";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import { Avatar } from "../ui/Avatar";
import IconButton from "../ui/IconButton";
import MySellerRating from "./MySellerRating";

interface BusinessProfileHeaderProps {
  user?: User;
  sellerProfile: SellerProfile;
  style?: StyleProp<ViewStyle>;
  onCall: () => void;
  onViewProfile?: () => void;
  onMessage?: () => void;
  onReviewsPress?: () => void;
}

export default function BusinessProfileHeader({
  user,
  sellerProfile,
  style,
  onCall,
  onViewProfile,
  onReviewsPress,
  onMessage,
}: BusinessProfileHeaderProps) {
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
      <View style={{ flexDirection: "row", alignItems:"flex-start" }}>
        <Avatar
          backgroundColor={colors.iconWhite}
          uri={user?.avatar}
          verified={sellerProfile.isVerified}
          size="lg"
          borderSize={1}
          name={sellerProfile.businessName}
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
              alignItems: "flex-start",
            }}
          >
            <MySellerRating
              rating={sellerProfile.rating}
              totalReviews={sellerProfile.totalReviews}
              title="Reviews"
              onPress={onReviewsPress}
            />
           
          </View>
        </AppView>
         <View
              style={{
                gap: spacing.sm,
              }}
            >
              <IconButton
                icon={<Feather name="message-circle" size={icons.md} color={colors.iconBlack} />}
                onPress={onMessage}
              />
              <IconButton
                icon={
                  <Feather name="phone" size={18} color={colors.iconBlack} />
                }
                onPress={onCall}
              />
            </View>
      </View>
    </View>
  );
}
