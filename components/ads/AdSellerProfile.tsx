import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { Ad } from "@/types";
import { Feather } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { router } from "expo-router";
import { Call, Message } from "iconsax-react-nativejs";
import React from "react";
import { Linking, Share as RNShare } from "react-native";
import AppView from "../ui/AppView";
import { Avatar } from "../ui/Avatar";

export function AdSellerProfile({ ad }: { ad?: Ad }) {
  const { spacing, colors, icons } = useTheme();

  const handleCall = () => {
    if (ad?.user?.phone) Linking.openURL(`tel:${ad.user?.phone}`);
  };

  const handleMessage = () => {
    if (ad) router.push({ pathname: "/messages", params: { adId: ad.id } });
  };

  const handleShare = () => {
    RNShare.share({
      message: `Check out this ad from ${ad?.user?.firstName} ${ad?.user?.lastName}: ${ad?.title}`,
    });
  };

  if (ad?.user == null) {
    return null;
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
      />
      <AppView style={{ flex: 1, gap: spacing.xs }}>
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
      </AppView>
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
