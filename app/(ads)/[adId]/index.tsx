import AdDetailsSkeleton from "@/components/ads/AdDetailsSkeleton";
import { AdInfoBlock } from "@/components/ads/AdInfoBlock";
import { AdSellerProfile } from "@/components/ads/AdSellerProfile";
import DescriptionHTML from "@/components/ads/DescriptionHTML";
import { ImageCarousel } from "@/components/ads/ImageCarousel";
import MoreFromSellerCarousel from "@/components/ads/MoreFromSellerCarousel";
import ProductAttributesSection from "@/components/ads/ProductAttributesSection";
import { WriteReviewSheet } from "@/components/bottom-sheet/WriteReviewSheet";
import AppView from "@/components/ui/AppView";
import BottomActionBar from "@/components/ui/ButtomActionBar";
import { Header } from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import SellerRating from "@/components/ui/SellerRating";
import { TextButton } from "@/components/ui/TextButton";
import { useAd, useInfiniteAds } from "@/hooks/useAds";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import { Entypo } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { formatDistanceToNow } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { Eye } from "iconsax-react-nativejs";
import React, { useRef } from "react";
import { Animated, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdDetailsScreen() {
  const { adId } = useLocalSearchParams() as { adId: string };
  const { spacing, colors, icons } = useTheme();
  const inserts = useSafeAreaInsets();

  const { data: ad, isLoading } = useAd(adId, !!adId);
  const { data: ads } = useInfiniteAds({
    limit: 10,
    userId: ad?.userId,
  });
  const relatedAds = ads?.pages.flatMap((page) => page.data) || [];

  const reviewSheetRef = useRef<BottomSheet>(null);
  const { data: user } = useUser(ad?.userId);

  // Animation values for header
  const lastScrollY = useRef(0);
  const headerOpacity = useRef(new Animated.Value(1)).current;

  // Handle scroll events for header animation
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const diff = currentScrollY - lastScrollY.current;

    // Detect scroll direction with minimal threshold
    if (Math.abs(diff) > 1) {
      if (diff > 0 && currentScrollY > 50) {
        // Scrolling down - hide header
        Animated.timing(headerOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (diff < 0) {
        // Scrolling up - show header
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
      lastScrollY.current = currentScrollY;
    }
  };

  const renderMainSection = () => {
    return (
      <>
        <AppView
          style={{
            gap: spacing.lg,
            paddingBottom: spacing.lg,
            backgroundColor: colors.background,
            marginBottom: spacing.md,
          }}
        >
          <ImageCarousel
            renderFooter={
              <AppView
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: spacing.md,
                }}
              >
                <TextButton
                  title={formatDistanceToNow(
                    new Date(ad?.createdAt || Date.now())
                  )}
                />
              </AppView>
            }
            images={ad?.images}
            showPagination={false}
          />
          <AdInfoBlock ad={ad} />
          <SellerRating
            style={{ marginHorizontal: spacing.md }}
            rating={user?.sellerProfile?.rating || 0}
            totalReviews={user?.sellerProfile?.totalReviews || 0}
            onReviewPress={() => reviewSheetRef.current?.expand()}
          />
          <ProductAttributesSection ad={ad} />
          <DescriptionHTML html={ad?.description || ""} />
        </AppView>
        {/* Seller Profile Section */}
        <AppView
          style={{
            backgroundColor: colors.background,
          }}
        >
          <AdSellerProfile ad={ad} />
          <MoreFromSellerCarousel ads={relatedAds} />
        </AppView>
      </>
    );
  };

  return (
    <AppView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      {/* Fixed Header */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          opacity: headerOpacity,
        }}
      >
        <Header
          left={
            <IconButton
              onPress={() => router.back()}
              icon={
                <Entypo
                  color={colors.iconBlack}
                  name="chevron-with-circle-left"
                  size={icons.md}
                />
              }
            />
          }
          right={
            <TextButton
              backgroundColor={colors.backgroundGray}
              isLeft
              icon={<Eye size={icons.sm} color={colors.iconBlack} />}
              titleStyle={{ color: colors.text }}
              title={String(ad?.views)}
            />
          }
          containerStyle={{
            backgroundColor: "transparent",
            paddingHorizontal: spacing.md,
          }}
        />
      </Animated.View>

      <ScrollView
        style={{ backgroundColor: colors.backgroundGray }}
        contentContainerStyle={{ paddingBottom: spacing.md, gap: spacing.sm }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {isLoading ? <AdDetailsSkeleton /> : renderMainSection()}
      </ScrollView>
      <BottomActionBar
        style={{ paddingBottom: inserts.bottom }}
        onMessage={function (): void {
          throw new Error("Function not implemented.");
        }}
        onCall={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <WriteReviewSheet
        ref={reviewSheetRef}
        sellerId="seller-id-123"
        onSubmit={(review) => {
          // Handle review submission
          console.log(review);
          reviewSheetRef.current?.close();
        }}
      />
    </AppView>
  );
}
