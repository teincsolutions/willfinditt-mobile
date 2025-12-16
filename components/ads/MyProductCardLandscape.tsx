import { useTheme } from "@/contexts/ThemeContext";
import { useAd, useDeleteAd } from "@/hooks/useAds";
import { Ad } from "@/types/ad";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import PopupMenu, { PopupMenuItem } from "../ui/PopupMenu";

interface Props {
  ad?: Ad;
  adId?: string;
  onPress?: () => void;
  onEdit?: (ad: Ad) => void;
  onDelete?: (adId: string) => void;
  style?: StyleProp<ViewStyle>;
}

const blurhash = "LKO2?U%2Tw=w]~RBVZRi};RPxuwH";

export function MyProductCardLandscape({
  ad,
  adId,
  onPress,
  onEdit,
  onDelete,
  style,
}: Props) {
  const { colors, spacing } = useTheme();

  // Fetch ad if only adId is provided
  const { data: fetchedAd, isLoading } = useAd(adId || "", !!adId && !ad);
  const actualAd = ad || fetchedAd;

  if (isLoading) {
    return (
      <AppView
        style={[
          {
            padding: spacing.md,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.backgroundPrimary,
          },
          style,
        ]}
      >
        <ActivityIndicator size="small" color={colors.primary} />
      </AppView>
    );
  }

  if (!actualAd) {
    return null;
  }

  return (
    <MyProductCardContent
      ad={actualAd}
      onPress={onPress}
      onEdit={onEdit}
      onDelete={onDelete}
      style={style}
    />
  );
}

function MyProductCardContent({
  ad,
  onPress,
  onEdit,
  onDelete,
  style,
}: {
  ad: Ad;
  onPress?: () => void;
  onEdit?: (ad: Ad) => void;
  onDelete?: (adId: string) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, spacing, radius } = useTheme();
  const deleteAdMutation = useDeleteAd();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(ad);
    } else {
      // Default navigation to edit screen
      router.push(`/(ads)/${ad.id}/edit` as any);
    }
  };

  const handlePromote = () => {
    // Navigate to promote/boost ad screen
    router.push(`/(ads)/${ad.id}/promote` as any);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    Alert.alert("Share", "Share functionality coming soon");
  };

  const handleViewStats = () => {
    // Navigate to ad statistics screen
    router.push(`/(ads)/${ad.id}/stats` as any);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Ad",
      "Are you sure you want to delete this ad? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAdMutation.mutateAsync(ad.id);
              if (onDelete) {
                onDelete(ad.id);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete ad. Please try again.");
              console.error("Error deleting ad:", error);
            }
          },
        },
      ]
    );
  };

  const handleMarkAsSold = () => {
    Alert.alert("Mark as Sold", "Mark this item as sold?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Mark as Sold",
        onPress: () => {
          // TODO: Implement mark as sold functionality
          console.log("Mark as sold:", ad.id);
        },
      },
    ]);
  };

  const menuItems: PopupMenuItem[] = [
    {
      id: "edit",
      label: "Edit",
      icon: <Ionicons name="pencil" size={18} color={colors.text} />,
      onPress: handleEdit,
    },
    {
      id: "promote",
      label: "Promote",
      icon: <Ionicons name="megaphone" size={18} color={colors.primary} />,
      onPress: handlePromote,
    },
    {
      id: "stats",
      label: "View Stats",
      icon: <Ionicons name="stats-chart" size={18} color={colors.text} />,
      onPress: handleViewStats,
    },
    {
      id: "share",
      label: "Share",
      icon: <Ionicons name="share-social" size={18} color={colors.text} />,
      onPress: handleShare,
    },
    {
      id: "sold",
      label: "Mark as Sold",
      icon: (
        <Ionicons name="checkmark-circle" size={18} color={colors.success} />
      ),
      onPress: handleMarkAsSold,
      disabled: ad.status === "SOLD",
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Ionicons name="trash" size={18} color={colors.error} />,
      onPress: handleDelete,
      destructive: true,
    },
  ];

  const getStatusColor = () => {
    switch (ad.status) {
      case "ACTIVE":
        return colors.success;
      case "DRAFT":
        return colors.warning;
      case "SOLD":
        return colors.textGray;
      case "EXPIRED":
        return colors.warning;
      case "SUSPENDED":
        return colors.error;
      case "DELETED":
        return colors.textGray;
      default:
        return colors.iconLightGray;
    }
  };


  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.wrap,
        {
          backgroundColor: colors.background,
          padding: spacing.sm,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
      activeOpacity={0.9}
    >
      {/* Image */}
      <View>
        <Image
          source={{ uri: ad.images?.[0] || "" }}
          style={[
            styles.image,
            {
              borderRadius: radius.md,
              marginRight: spacing.md,
            },
          ]}
          placeholder={{ blurhash }}
        />

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            {
              top:0,
              right: spacing.lg/2,
              backgroundColor: colors.background,
              height: spacing.lg,
              width: spacing.lg,
              borderRadius: spacing.lg,
            },
          ]}
        >
          <View style={{
            backgroundColor: getStatusColor(),
            width: spacing.md,
            height: spacing.md,
            borderRadius: spacing.md,
            margin: (spacing.lg - spacing.md)/2,
          }} />
        </View>
      </View>
      {/* Info */}
      <View style={styles.info}>
        {/* Title & Status */}
        <View style={styles.titleRow}>
          <AppText style={[{ fontWeight: "600", flex: 1 }]} numberOfLines={2}>
            {ad.title}
          </AppText>
        </View>

        {/* Price & Stats */}
        <View style={styles.priceRow}>
          <AppText
            style={[
              {
                fontWeight: "700",
                marginTop: spacing.xs,
                color: colors.primary,
              },
            ]}
          >
            {ad.currency}
            {ad.price}
          </AppText>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={14} color={colors.textGray} />
              <AppText
                style={{ fontSize: 12, color: colors.textGray, marginLeft: 4 }}
              >
                {ad.views || 0}
              </AppText>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="heart" size={14} color={colors.textGray} />
              <AppText
                style={{ fontSize: 12, color: colors.textGray, marginLeft: 4 }}
              >
                {ad._count?.savedBy || 0}
              </AppText>
            </View>
          </View>
        </View>

        {/* Location & Date */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location" size={12} color={colors.textGray} />
            <AppText
              style={{
                fontSize: 11,
                color: colors.textGray,
                marginLeft: 4,
              }}
              numberOfLines={1}
            >
              {ad.city?.name || "Unknown"}
            </AppText>
          </View>

          <AppText
            style={{
              fontSize: 11,
              color: colors.textGray,
            }}
          >
            {new Date(ad.createdAt).toLocaleDateString()}
          </AppText>
        </View>
      </View>

      {/* Popup Menu */}
      <PopupMenu
        trigger={
          <View
            style={[
              styles.menuButton,
              {
                backgroundColor: colors.backgroundGray,
                padding: spacing.xs,
                borderRadius: radius.sm,
              },
            ]}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
          </View>
        }
        items={menuItems}
        placement="bottom-left"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  statusBadge: {
    position:"absolute"
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuButton: {
    marginLeft: 8,
  },
});
