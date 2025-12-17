import BusinessProfileHeader from "@/components/account/BusinessProfileHeader";
import BusinessProfileSkeleton from "@/components/account/BusinessProfileSkeleton";
import StatsSection, { StatItem } from "@/components/account/StatsSection";
import { MyProductCardLandscape } from "@/components/ads/MyProductCardLandscape";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import SwipeableTabs, {
  TabDataset,
  TabItem,
} from "@/components/ui/SwipeableTabs";
import { TextButton } from "@/components/ui/TextButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useInfiniteMyAds } from "@/hooks/useAds";
import { useAuth } from "@/hooks/useAuth";
import { useMySeller } from "@/hooks/useSeller";
import { AdStatus } from "@/types";
import { Ad } from "@/types/ad";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { AddCircle } from "iconsax-react-nativejs";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const frontendUrl =
  process.env.EXPO_PUBLIC_FRONTEND_URL || "https://willfinditt.com";

export default function BusinessProfileScreen() {
  const { colors, spacing, icons } = useTheme();
  const insets = useSafeAreaInsets();

  const { user } = useAuth();
  const {
    sellerProfile,
    isLoading: isLoadingProfile,
    stats,
    isLoadingStats,
    refetch,
  } = useMySeller();

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
    const businessUrl = `${frontendUrl}/seller/${sellerProfile?.id}`;
    Share.share({
      message: `Check out my business on WillFindItt: ${businessUrl}`,
      url: businessUrl,
      title: "My Business on WillFindItt",
    });
  };

  const handleReviewPress = () => {
    router.push("/account/my-reviews");
  };

  if (isLoadingProfile) {
    return <BusinessProfileSkeleton />;
  }

  if (!sellerProfile) {
    return (
      <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[{ width: "100%" }]}>
          <Image
            style={{ width: "100%", height: "100%" }}
            source={require("@/assets/images/woman-running-small-business.png")}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.9)"]}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              {
                position: "absolute",
                alignItems: "center",
                gap: spacing.sm,
                bottom: insets.bottom + 120,
                paddingHorizontal: spacing.md,
              },
            ]}
          >
            <AppText
              variant="xxl"
              style={{
                fontWeight: "bold",
                color: colors.textWhite,
                textAlign: "center",
              }}
            >
              Become a Seller
            </AppText>
            <AppText
              variant="lg"
              style={{ color: colors.textWhite, textAlign: "center" }}
            >
              Create your shop on WillFindItt and start selling your products.
            </AppText>
          </View>
        </View>
        <View
          style={[
            {
              flexDirection: "row",
              position: "absolute",
              justifyContent: "flex-end",
              alignItems: "center",
              left: 0,
              right: 0,
              zIndex: 10,
              bottom: insets.bottom + 50,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <Feather
              onPress={() => router.back()}
              name="arrow-left-circle"
              size={icons.md}
              color={colors.iconWhite}
            />
            <TextButton title={"Get Started"} onPress={handleEditBusiness} />
          </View>
        </View>
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
      label: "Suspended",
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
          headerShown: true,
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
                  onPress={() => router.push({ pathname: "/ads/create" })}
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
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + spacing.md,
          backgroundColor: colors.backgroundPrimary,
        }}
        tabScrollStyle={{ paddingTop: 45 + spacing.md }}
        renderItem={({ item }: { item: Ad }) => (
          <MyProductCardLandscape
            ad={item}
            onPress={() => router.push(`/ads/${item.id}` as any)}
            style={{ marginHorizontal: spacing.md, marginVertical: spacing.xs }}
          />
        )}
        ListHeaderComponent={
          <AppView style={{ backgroundColor: colors.yellow }}>
            {/* Business Profile Header */}
            <BusinessProfileHeader
              user={user || undefined}
              sellerProfile={sellerProfile}
              onReviewsPress={handleReviewPress}
              onCall={function (): void {
                throw new Error("Function not implemented.");
              }}
            />

            {/* Stats Section */}
            <StatsSection
              stats={statsData}
              isLoading={isLoadingStats}
              columns={2}
              style={{ marginBottom: -45 }}
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
        onRefresh={handleRefresh}
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
