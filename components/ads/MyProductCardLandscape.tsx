import { useTheme } from "@/contexts/ThemeContext";
import { useAd, useAdActions, useDeleteAd, useUpdateAd } from "@/hooks/useAds";
import { formatCurrency } from "@/lib/formatCurrency";
import { AdStatus } from "@/types";
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
import { toast } from "sonner-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import PopupMenu, { PopupMenuItem } from "../ui/PopupMenu";

interface Props {
  ad?: Ad;
  adId?: string;
  onPress?: () => void;
  onEdit?: (ad: Ad) => void;
  onDelete?: (adId: string) => void;
  onViewRejectionDetails?: (ad: Ad) => void;
  style?: StyleProp<ViewStyle>;
}

const blurhash = "LKO2?U%2Tw=w]~RBVZRi};RPxuwH";

export function MyProductCardLandscape({
  ad,
  adId,
  onPress,
  onEdit,
  onDelete,
  onViewRejectionDetails,
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
      onViewRejectionDetails={onViewRejectionDetails}
      style={style}
    />
  );
}

function MyProductCardContent({
  ad,
  onPress,
  onEdit,
  onDelete,
  onViewRejectionDetails,
  style,
}: {
  ad: Ad;
  onPress?: () => void;
  onEdit?: (ad: Ad) => void;
  onDelete?: (adId: string) => void;
  onViewRejectionDetails?: (ad: Ad) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, spacing, radius } = useTheme();
  const deleteAdMutation = useDeleteAd();
  const { handleShare } = useAdActions(ad, ad.user?.sellerProfile);
  const updateAdMutation = useUpdateAd();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(ad);
    } else {
      // Default navigation to edit screen
      router.push({ pathname: `/ads/[adId]/edit`, params: { adId: ad.id } });
    }
  };

  const handlePromote = () => {
    // Navigate to promote/boost ad screen
    router.push({ pathname: `/ads/[adId]/promote`, params: { adId: ad.id } });
  };

  const handleViewStats = () => {
    // Navigate to ad statistics screen
    router.push({ pathname: `/ads/[adId]/stats`, params: { adId: ad.id } });
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
    Alert.alert("Mark as Sold", `Mark this "${ad.title}" as sold?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Mark as Sold",
        onPress: async () => {
          try {
            await updateAdMutation.mutateAsync({
              id: ad.id,
              data: { status: AdStatus.SOLD },
            });
            toast.success("Ad marked as sold.");
          } catch (error: any) {
            console.error("Error marking ad as sold:", error);
            toast.error(
              error?.response?.data?.message ||
                error.message ||
                "Failed to mark ad as sold. Please try again."
            );
          }
        },
      },
    ]);
  };

  const handleMarkAsUnsold = () => {
    Alert.alert("Mark as Unsold", `Mark this "${ad.title}" as unsold?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Mark as Unsold",
        onPress: async () => {
          try {
            await updateAdMutation.mutateAsync({
              id: ad.id,
              data: { status: AdStatus.ACTIVE },
            });
            toast.success("Ad marked as unsold.");
          } catch (error: any) {
            console.error("Error marking ad as unsold:", error);
            toast.error(
              error?.response?.data?.message ||
                error.message ||
                "Failed to mark ad as unsold. Please try again."
            );
          }
        },
      },
    ]);
  };

  const handleSubmitForReview = () => {
    Alert.alert(
      "Submit for Review",
      `Submit "${ad.title}" for review? It will be published once approved.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Submit",
          onPress: async () => {
            try {
              await updateAdMutation.mutateAsync({
                id: ad.id,
                data: { status: AdStatus.PENDING },
              });
              toast.success("Ad submitted for review.");
            } catch (error: any) {
              console.error("Error submitting ad for review:", error);
              toast.error(
                error?.response?.data?.message ||
                  error.message ||
                  "Failed to submit ad for review. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const menuItems: PopupMenuItem[] = [
    {
      id: "edit",
      label: "Edit",
      icon: <Ionicons name="pencil" size={18} color={colors.text} />,
      onPress: handleEdit,
    },
    // {
    //   id: "promote",
    //   label: "Promote",
    //   icon: <Ionicons name="megaphone" size={18} color={colors.primary} />,
    //   onPress: handlePromote,
    // },
    // {
    //   id: "stats",
    //   label: "View Stats",
    //   icon: <Ionicons name="stats-chart" size={18} color={colors.text} />,
    //   onPress: handleViewStats,
    // },
    {
      id: "share",
      label: "Share",
      icon: <Ionicons name="share-social" size={18} color={colors.text} />,
      onPress: handleShare,
    },
    ...((ad.status === AdStatus.REJECTED || ad.status === AdStatus.SUSPENDED) && onViewRejectionDetails
      ? [
          {
            id: "view-details",
            label: ad.status === AdStatus.REJECTED ? "View Rejection Details" : "View Suspension Details",
            icon: (
              <Ionicons
                name={ad.status === AdStatus.REJECTED ? "alert-circle" : "ban"}
                size={18}
                color={colors.error}
              />
            ),
            onPress: () => onViewRejectionDetails(ad),
          },
        ]
      : []),
    ...(ad.status === AdStatus.DRAFT
      ? [
          {
            id: "submit-review",
            label: "Submit for Review",
            icon: (
              <Ionicons
                name="cloud-upload"
                size={18}
                color={colors.primary}
              />
            ),
            onPress: handleSubmitForReview,
          },
        ]
      : ad.status === AdStatus.ACTIVE
      ? [
          {
            id: "sold",
            label: "Mark as Sold",
            icon: (
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={colors.success}
              />
            ),
            onPress: handleMarkAsSold,
          },
        ]
      : ad.status === AdStatus.SOLD
      ? [
          {
            id: "un-sold",
            label: "Mark as Unsold",
            icon: (
              <Ionicons
                name="remove-circle"
                size={18}
                color={colors.warning}
              />
            ),
            onPress: handleMarkAsUnsold,
          },
        ]
      : []),
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
      case "REJECTED":
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
              top: 0,
              right: spacing.lg / 2,
              backgroundColor: colors.background,
              height: spacing.lg,
              width: spacing.lg,
              borderRadius: spacing.lg,
            },
          ]}
        >
          <View
            style={{
              backgroundColor: getStatusColor(),
              width: spacing.md,
              height: spacing.md,
              borderRadius: spacing.md,
              margin: (spacing.lg - spacing.md) / 2,
            }}
          />
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
            {ad.price
              ? formatCurrency(ad.price, "en-GH", ad.currency)
              : "Contact for Price"}
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
    position: "absolute",
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
