import { MyProductCardLandscape } from "@/components/ads/MyProductCardLandscape";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Avatar } from "@/components/ui/Avatar";
import SellerRating from "@/components/ui/SellerRating";
import StatsSection, { StatItem } from "@/components/ui/StatsSection";
import { useTheme } from "@/contexts/ThemeContext";
import { useInfiniteAds } from "@/hooks/useAds";
import { useSeller } from "@/hooks/useSeller";
import { useUser } from "@/hooks/useUser";
import { Ad } from "@/types/ad";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function SellerProfileScreen() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [refreshing, setRefreshing] = useState(false);

  // Get user data
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useUser(userId);

  // Get seller profile and stats
  const {
    sellerProfile,
    isLoading: isLoadingProfile,
    stats,
    isLoadingStats,
    refetch: refetchSeller,
  } = useSeller(userId);

  // Fetch seller's ads
  const {
    data: adsData,
    isLoading: isLoadingAds,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchAds,
  } = useInfiniteAds({
    userId: userId,
  });

  const ads = adsData?.pages.flatMap((page) => page.data) || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchUser(), refetchSeller(), refetchAds()]);
    setRefreshing(false);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    toast.info("Share functionality coming soon");
  };

  const handleCall = () => {
    if (user?.phone) {
      Linking.openURL(`tel:${user.phone}`);
    } else {
      toast.error("Phone number not available");
    }
  };

  const handleWriteReview = () => {
    if (sellerProfile) {
      router.push(`/(ads)/seller/${sellerProfile.id}/write-review` as any);
    }
  };

  if (isLoadingUser || isLoadingProfile) {
    return (
      <AppView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AppView>
    );
  }

  if (!user || !sellerProfile) {
    return (
      <AppView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: spacing.xl,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <Ionicons
            name="person-circle-outline"
            size={80}
            color={colors.textGray}
          />
          <AppText
            style={{
              fontSize: 20,
              fontWeight: "600",
              marginTop: spacing.lg,
              textAlign: "center",
            }}
          >
            Seller Not Found
          </AppText>
          <AppText
            style={{
              fontSize: 14,
              color: colors.textGray,
              marginTop: spacing.sm,
              textAlign: "center",
            }}
          >
            This seller profile could not be found or does not exist.
          </AppText>
        </ScrollView>
      </AppView>
    );
  }

  // Prepare stats
  const statsData: StatItem[] = [
    {
      label: "Total Ads",
      value: stats?.totalAds || 0,
      color: colors.primary,
    },
    {
      label: "Active Ads",
      value: stats?.activeAds || 0,
      color: colors.success,
    },
    {
      label: "Total Views",
      value: stats?.totalViews || 0,
      color: colors.text,
    },
    {
      label: "Messages",
      value: stats?.totalMessages || 0,
      color: colors.text,
    },
  ];

  return (
    <AppView style={{ flex: 1 }}>
      {/* Top Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: spacing.md,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <AppText
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginLeft: spacing.md,
            }}
          >
            Seller Profile
          </AppText>
        </View>
      </View>

      <FlatList
        data={ads}
        keyExtractor={(item: Ad) => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.md }}
        ListHeaderComponent={
          <View>
            {/* Seller Profile Header */}
            <View
              style={[
                styles.header,
                {
                  backgroundColor: colors.background,
                  padding: spacing.lg,
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
                    <SellerRating
                      rating={sellerProfile.rating}
                      totalReviews={sellerProfile.totalReviews}
                      onReviewPress={handleWriteReview}
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
                  onPress={handleCall}
                >
                  <Ionicons name="call" size={18} color="#fff" />
                  <AppText
                    style={{
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: "600",
                      marginLeft: 6,
                    }}
                  >
                    Call
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
                  onPress={handleShare}
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
                    Linking.openURL(sellerProfile.website!);
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

            {/* Stats Section */}
            <StatsSection
              title="Statistics"
              stats={statsData}
              isLoading={isLoadingStats}
              columns={2}
            />

            {/* Listings Header */}
            <View
              style={{
                backgroundColor: colors.background,
                padding: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <AppText style={{ fontSize: 16, fontWeight: "600" }}>
                Active Listings ({stats?.activeAds || 0})
              </AppText>
            </View>
          </View>
        }
        renderItem={({ item }: { item: Ad }) => (
          <MyProductCardLandscape
            ad={item}
            onPress={() => router.push(`/(ads)/${item.id}` as any)}
            style={{ marginHorizontal: spacing.md, marginVertical: spacing.xs }}
          />
        )}
        ListEmptyComponent={
          <View
            style={{
              padding: spacing.xl,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoadingAds ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <>
                <Ionicons
                  name="albums-outline"
                  size={60}
                  color={colors.textGray}
                />
                <AppText
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: spacing.md,
                    color: colors.textGray,
                  }}
                >
                  No Active Listings
                </AppText>
                <AppText
                  style={{
                    fontSize: 14,
                    color: colors.textGray,
                    marginTop: spacing.xs,
                    textAlign: "center",
                  }}
                >
                  This seller does not have any active listings at the moment.
                </AppText>
              </>
            )}
          </View>
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ padding: spacing.md }}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : undefined
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </AppView>
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
