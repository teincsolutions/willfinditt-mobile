import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { Ad } from "@/types";
import { Feather } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Call, Message } from "iconsax-react-nativejs";
import React from "react";
import { Pressable } from "react-native";
import AppView from "../ui/AppView";
import { Avatar } from "../ui/Avatar";
import { ProductCardSmallLandscapeSkeleton } from "./ProductCardSmallLandscapeSkeleton";

export function AdSellerProfile({
  ad,
  handleProfilePress,
  handleCall,
  handleMessage,
  handleShare,
}: {
  ad?: Ad;
  handleProfilePress?: () => void;
  handleCall?: () => void;
  handleMessage?: () => void;
  handleShare?: () => void;
}) {
  const { spacing, colors, icons } = useTheme();

  if (ad?.user == null) {
    return <ProductCardSmallLandscapeSkeleton />;
  }

  return (
    <AppView
      style={{
        padding: spacing.md,
        flexDirection: "row",
        gap: spacing.sm,
        alignItems: "center",
      }}
    >
      <Avatar
        verified={ad?.user?.isVerified}
        size="lg"
        uri={ad?.user?.avatar}
        onPress={handleProfilePress}
      />
      <Pressable
        onPress={handleProfilePress}
        style={{ flex: 1, gap: spacing.xs }}
      >
        <AppText
          variant="lg"
          style={{ fontWeight: "700", color: colors.primary }}
        >
          {ad.user?.sellerProfile
            ? `${ad.user.sellerProfile.businessName}`
            : `${ad.user?.firstName} ${ad.user?.lastName}`}
        </AppText>
        <AppText variant="md" style={{ fontWeight: "400" }}>
          @{ad.user?.username}
        </AppText>
        <AppText variant="sm" style={{ color: colors.textLightGray }}>
          {ad.user?.createdAt ||
            (ad.user?.sellerProfile?.createdAt &&
              `Member since ${formatDistanceToNow(
                ad.user?.createdAt || ad.user.sellerProfile.createdAt,
                {
                  addSuffix: true,
                }
              )}`)}
        </AppText>
      </Pressable>
      <AppView style={{ flexDirection: "row", gap: spacing.sm }}>
        <Call onPress={handleCall} size={icons.lg} color={colors.iconBlack} />
        <Message
          onPress={handleMessage}
          size={icons.lg}
          color={colors.iconBlack}
        />
        <Feather
          onPress={handleShare}
          name="share-2"
          size={icons.lg}
          color={colors.iconBlack}
        />
      </AppView>
    </AppView>
  );
}
