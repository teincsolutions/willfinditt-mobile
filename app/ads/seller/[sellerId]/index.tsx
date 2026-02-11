import BusinessProfileHeader from "@/components/account/BusinessProfileHeader";
import SellerProfileSkeleton from "@/components/account/SellerProfileSkeleton";
import ProductCard from "@/components/ads/ProductCard";
import ProductCardSkeleton from "@/components/ads/ProductCardSkeleton";
import { ReportSheet } from "@/components/bottom-sheet/ReportSheet";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAdActions, useInfiniteAds } from "@/hooks/useAds";
import { useAuth } from "@/hooks/useAuth";
import { useBlockUser, useReportComment } from "@/hooks/useModeration";
import { useSeller } from "@/hooks/useSeller";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MasonryList from "reanimated-masonry-list";

export default function SellerProfileScreen() {
  const { colors, spacing, icons } = useTheme();
  const insets = useSafeAreaInsets();
  const { sellerId } = useLocalSearchParams<{ sellerId: string }>();
  const { user, isAuthenticated } = useAuth();
  const reportSheetRef = useRef<BottomSheet>(null);

  const { sellerProfile, isLoading: isLoadingProfile } = useSeller(sellerId);
  const { mutateAsync: blockUser, isPending: isBlocking } = useBlockUser();
  const { mutateAsync: reportUser, isPending: isReporting } =
    useReportComment();

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
    sellerProfile,
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
        ],
      );
      return;
    }

    router.push({
      pathname: "/ads/seller/[sellerId]/reviews",
      params: { sellerId },
    });
  };

  const handleBlockPress = () => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "You must be logged in to block a user.");
      return;
    }

    Alert.alert(
      "Block User",
      "Are you sure you want to block this user? You will no longer see their content.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            try {
              if (sellerProfile?.userId) {
                await blockUser({ userId: sellerProfile.userId });
                router.back();
              }
            } catch (error) {
              // Error handled in hook
            }
          },
        },
      ],
    );
  };

  const handleReportPress = () => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "You must be logged in to report a user.");
      return;
    }
    reportSheetRef.current?.expand();
  };

  if (isLoadingProfile) {
    return <SellerProfileSkeleton />;
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

  const isOwner = user?.id === sellerProfile?.userId;

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
                <View style={{ flexDirection: "row", gap: spacing.sm }}>
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
                  {!isOwner && (
                    <>
                      <IconButton
                        onPress={handleReportPress}
                        icon={
                          <MaterialIcons
                            name="report"
                            size={icons.md}
                            color={colors.error}
                          />
                        }
                      />
                      <IconButton
                        onPress={handleBlockPress}
                        icon={
                          <Feather
                            name="user-x"
                            size={icons.md}
                            color={colors.error}
                          />
                        }
                      />
                    </>
                  )}
                </View>
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

      {sellerProfile?.userId && (
        <ReportSheet
          ref={reportSheetRef}
          title="Report User"
          onReport={async (values) => {
            await reportUser({ commentId: sellerProfile.userId, data: values });
          }}
          isReporting={isReporting}
          close={() => {
            reportSheetRef.current?.close();
          }}
        />
      )}
    </AppView>
  );
}
