import { MyProductCardLandscape } from "@/components/ads/MyProductCardLandscape";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import BusinessProfileHeader from "@/components/ui/BusinessProfileHeader";
import { Header } from "@/components/ui/Header";
import PrimaryButton from "@/components/ui/PrimaryButton";
import StatsSection, { StatItem } from "@/components/ui/StatsSection";
import SwipeableTabs, {
  TabDataset,
  TabItem,
} from "@/components/ui/SwipeableTabs";
import { TextButton } from "@/components/ui/TextButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useInfiniteMyAds } from "@/hooks/useAds";
import { useAuth } from "@/hooks/useAuth";
import { useSeller, useSellerStats } from "@/hooks/useSeller";
import { AdStatus } from "@/types";
import { Ad } from "@/types/ad";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { AddCircle } from "iconsax-react-nativejs";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function BusinessProfileScreen() {
  const { colors, spacing, icons } = useTheme();
  const insets = useSafeAreaInsets();

  const { user } = useAuth();
  const { sellerProfile, isLoading: isLoadingProfile, refetch } = useSeller();
  const { data: stats, isLoading: isLoadingStats } = useSellerStats();

  const [activeTab, setActiveTab] = useState<AdStatus>(AdStatus.ACTIVE);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all user ads
  const {
    data: adsData,
    isLoading: isLoadingAds,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchAds,
  } = useInfiniteMyAds({ limit: 20 });

  const allAds = adsData?.pages.flatMap((page) => page.data) || [];
  const activeAds = allAds.filter((ad) => ad.status === activeTab);
  const soldAds = allAds.filter((ad) => ad.status === AdStatus.SOLD);
  const draftAds = allAds.filter((ad) => ad.status === AdStatus.DRAFT);
  const suspendedAds = allAds.filter((ad) => ad.status === AdStatus.SUSPENDED);

  const dataset: TabDataset<Ad>[] = [
    { key: AdStatus.ACTIVE, data: activeAds },
    { key: AdStatus.SOLD, data: soldAds },
    { key: AdStatus.DRAFT, data: draftAds },
    { key: AdStatus.SUSPENDED, data: suspendedAds },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchAds()]);
    setRefreshing(false);
  };

  const handleEditBusiness = () => {
    router.push("/account/edit-business");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    toast.info("Share functionality coming soon");
  };

  if (isLoadingProfile) {
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

  if (!sellerProfile) {
    return (
      <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
        <ScrollView
          contentContainerStyle={{
            padding: spacing.xl,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <AppView
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: spacing.lg,
            }}
          >
            <Ionicons
              name="briefcase-outline"
              size={80}
              color={colors.textGray}
            />
            <AppText
              style={{
                fontSize: 20,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              No Business Profile
            </AppText>
            <AppText
              style={{
                fontSize: 14,
                color: colors.textGray,
                textAlign: "center",
              }}
            >
              Create a business profile to start selling and showcase your
              products.
            </AppText>
            <PrimaryButton
              title="Create Business Profile"
              onPress={handleEditBusiness}
            />
          </AppView>
        </ScrollView>
      </AppView>
    );
  }

  // Prepare tabs
  const tabs: TabItem[] = [
    {
      key: AdStatus.ACTIVE,
      title: "Active",
      count: stats?.activeAds || 0,
    },
    {
      key: AdStatus.SOLD,
      title: "Sold",
      count: stats?.soldAds || 0,
    },
    {
      key: AdStatus.SUSPENDED,
      title: "Suspended",
      count: stats?.suspendedAds || 0,
    },
    {
      key: AdStatus.DRAFT,
      title: "Draft",
      count: stats?.draftAds || 0,
    },
  ];

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
      label: "Suspended Ads",
      value: stats?.suspendedAds || 0,
      color: colors.error,
    },
    {
      label: "Total Views",
      value: stats?.totalViews || 0,
      color: colors.text,
    },
  ];

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Stack.Screen
        options={{
          header: () => (
            <Header
              backgroundColor={colors.yellow}
              containerStyle={{
                paddingBottom: spacing.md,
                paddingHorizontal: spacing.md,
                paddingTop: insets.top + spacing.md,
              }}
              right={
                <TextButton
                  icon={<AddCircle size={icons.md} color={colors.iconBlack} />}
                  title="Create Ad"
                />
              }
            />
          ),
        }}
      />
      <SwipeableTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key as AdStatus)}
        data={dataset}
        keyExtractor={(item: Ad) => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.md }}
        renderItem={({ item }: { item: Ad }) => (
          <MyProductCardLandscape
            ad={item}
            onPress={() => router.push(`/(ads)/${item.id}` as any)}
            style={{ marginHorizontal: spacing.md, marginVertical: spacing.xs }}
          />
        )}
        ListHeaderComponent={
          <AppView style={{ backgroundColor: colors.yellow }}>
            {/* Business Profile Header */}
            <BusinessProfileHeader
              user={user || undefined}
              sellerProfile={sellerProfile}
              onEditProfile={handleEditBusiness}
              onShare={handleShare}
            />

            {/* Stats Section */}
            <StatsSection
              title="Statistics"
              stats={statsData}
              isLoading={isLoadingStats}
              columns={2}
            />
          </AppView>
        }
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
                  No {activeTab} ads
                </AppText>
                <AppText
                  style={{
                    fontSize: 14,
                    color: colors.textGray,
                    marginTop: spacing.xs,
                    textAlign: "center",
                  }}
                >
                  {activeTab === AdStatus.ACTIVE
                    ? "You don't have any active listings yet"
                    : activeTab === AdStatus.SOLD
                    ? "You haven't sold any items yet"
                    : "You don't have any draft listings"}
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
