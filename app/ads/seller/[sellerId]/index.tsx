import BusinessProfileHeader from "@/components/account/BusinessProfileHeader";
import BusinessProfileSkeleton from "@/components/account/BusinessProfileSkeleton";
import ProductCard from "@/components/ads/ProductCard";
import ProductCardSkeleton from "@/components/ads/ProductCardSkeleton";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAdActions, useInfiniteAds } from "@/hooks/useAds";
import { useAuth } from "@/hooks/useAuth";
import { useSeller } from "@/hooks/useSeller";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React from "react";
import { Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MasonryList from "reanimated-masonry-list";

export default function SellerProfileScreen() {
  const { colors, spacing, icons } = useTheme();
  const insets = useSafeAreaInsets();
  const { sellerId } = useLocalSearchParams<{ sellerId: string }>();
  const { user, isAuthenticated } = useAuth();

  const { sellerProfile, isLoading: isLoadingProfile } = useSeller(sellerId);

  // Fetch all user ads
  const {
    data: adsData,
    isLoading: isLoadingAds,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAds({ limit: 20, userId: sellerProfile?.userId });

  const allAds = adsData?.pages.flatMap((page) => page.data) || [];
  const { handleCall, handleMessage, handleShare } = useAdActions(
    undefined,
    sellerProfile
  );

  const handleReviewPress = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "Please log in to view seller reviews.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Log In",
            onPress: () =>
              router.push({
                pathname: "/login",
                params: {
                  redirectTo: `/ads/seller/[sellerId]/reviews`,
                  sellerId,
                },
              }),
          },
        ]
      );
      return;
    }

    router.push({
      pathname: "/ads/seller/[sellerId]/reviews",
      params: { sellerId },
    });
  };

  if (isLoadingProfile) {
    return <BusinessProfileSkeleton />;
  }

  if (!sellerProfile) {
    return (
      <AppView
        style={{
          flex: 1,
          backgroundColor: colors.backgroundPrimary,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
              />
            ),
          }}
        />
        <AppText>
          <Feather
            name="alert-circle"
            size={icons.lg}
            color={colors.textGray}
          />
          {"  "}
          Seller profile not found.
        </AppText>
      </AppView>
    );
  }

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.yellow }}>
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
                <IconButton
                  icon={
                    <Ionicons
                      name="share-social"
                      size={icons.md}
                      color={colors.iconBlack}
                    />
                  }
                  onPress={handleShare}
                />
              }
            />
          ),
        }}
      />
      <MasonryList
        style={{
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
        }}
        contentContainerStyle={{
          paddingBottom: spacing.md + insets.bottom,
          backgroundColor: colors.background,
          flexGrow: 1,
        }}
        data={isLoadingAds ? Array(6).fill({}) : allAds}
        numColumns={2}
        keyExtractor={(item, index) => item.id || `skeleton-${index}`}
        ListHeaderComponentStyle={{
          backgroundColor: colors.yellow,
          marginBottom: spacing.md,
        }}
        ListHeaderComponent={
          <BusinessProfileHeader
            user={user || undefined}
            sellerProfile={sellerProfile}
            onCall={handleCall}
            onReviewsPress={handleReviewPress}
            onMessage={handleMessage}
          />
        }
        renderItem={({ item, index }: any) => {
          if (isLoadingAds) {
            return <ProductCardSkeleton />;
          }
          return (
            <ProductCard
              onPress={() =>
                router.push({
                  pathname: "/ads/[adId]",
                  params: { adId: item.id },
                })
              }
              ad={item}
            />
          );
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.1}
        loading={isFetchingNextPage}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
    </AppView>
  );
}
