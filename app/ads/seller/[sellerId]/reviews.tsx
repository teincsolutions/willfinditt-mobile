import { ReportSheet } from "@/components/bottom-sheet/ReportSheet";
import { WriteReviewSheet } from "@/components/bottom-sheet/WriteReviewSheet";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { TextButton } from "@/components/ui/TextButton";
import { useReportReview } from "@/hooks/useModeration";
import { useSeller, useSellerReviews } from "@/hooks/useSeller";
import { useTheme } from "@/hooks/useTheme";
import { Feather, Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import { AddSquare } from "iconsax-react-nativejs";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SellerReviewScreen() {
  const { sellerId = "" } = useLocalSearchParams() as { sellerId: string };
  const { colors, spacing, icons, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const reviewSheetRef = useRef<BottomSheet>(null);

  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSellerReviews(sellerId, 20);
  const { sellerProfile } = useSeller(sellerId);
  console.log("Seller reviews data:", sellerProfile);
  // Flatten all pages into a single array
  const reviews = data?.pages.flatMap((page) => page.data) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons
            key={i}
            name="star"
            size={icons.xs}
            color={colors.yellow}
          />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons
            key={i}
            name="star-half"
            size={icons.xs}
            color={colors.yellow}
          />,
        );
      } else {
        stars.push(
          <Ionicons
            key={i}
            name="star-outline"
            size={icons.xs}
            color={colors.yellow}
          />,
        );
      }
    }

    return stars;
  };

  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <AppView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: spacing.xxl * 2,
        }}
      >
        <Feather
          name="message-circle"
          size={icons.xxl}
          color={colors.iconGray}
        />
        <AppText
          variant="lg"
          fontWeight="bold"
          style={{ color: colors.text, marginTop: spacing.md }}
        >
          No Reviews Yet
        </AppText>
        <AppText
          variant="sm"
          style={{
            color: colors.textGray,
            marginTop: spacing.xs,
            textAlign: "center",
          }}
        >
          This seller hasn&apos;t received any reviews yet
        </AppText>
      </AppView>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={{ paddingVertical: spacing.lg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  const renderHeader = () => (
    <AppView
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <AppView>
        <AppText variant="lg" fontWeight="bold" style={{ color: colors.text }}>
          {sellerProfile?.totalReviews} Reviews
        </AppText>
        <AppView style={{ flexDirection: "row", gap: spacing.xs }}>
          <AppText>{sellerProfile?.rating?.toFixed(1)}</AppText>
          <AppView style={{ flexDirection: "row" }}>
            {renderStars(sellerProfile?.rating || 0)}
          </AppView>
        </AppView>
      </AppView>
      <TextButton
        onPress={() => reviewSheetRef.current?.expand()}
        title="Add Review"
        style={{ backgroundColor: colors.primary, borderRadius: radius.sm }}
        titleStyle={{ color: colors.textWhite }}
        icon={<AddSquare size={icons.sm} color={colors.iconWhite} />}
      />
    </AppView>
  );

  if (isLoading && !data) {
    return (
      <AppView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </AppView>
    );
  }

  const { mutateAsync: reportReview, isPending: isReporting } =
    useReportReview();
  const reportSheetRef = useRef<BottomSheet>(null);
  const [selectedReview, setSelectedReview] = React.useState<any>(null);

  const handleReportPress = (review: any) => {
    setSelectedReview(review);
    reportSheetRef.current?.expand();
  };

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReviewCard review={item} onReport={handleReportPress} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.md,
          flexGrow: 1,
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      {sellerProfile?.user && (
        <WriteReviewSheet
          ref={reviewSheetRef}
          seller={sellerProfile.user}
          close={() => reviewSheetRef.current?.close()}
        />
      )}
      <ReportSheet
        ref={reportSheetRef}
        title="Report Review"
        onReport={async (values) => {
          if (selectedReview) {
            await reportReview({ reviewId: selectedReview.id, data: values });
          }
        }}
        isReporting={isReporting}
        close={() => reportSheetRef.current?.close()}
      />
    </AppView>
  );
}
