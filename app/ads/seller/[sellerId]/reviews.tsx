import { ReviewCard } from "@/components/reviews/ReviewCard";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { TextButton } from "@/components/ui/TextButton";
import { useSeller, useSellerReviews } from "@/hooks/useSeller";
import { useTheme } from "@/hooks/useTheme";
import { SellerReview } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { AddSquare } from "iconsax-react-nativejs";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DummyReviews: SellerReview[] = [
  {
    id: "1",
    rating: 5,
    comment: "Great seller! Fast response and smooth transaction.",
    reviewer: {
      firstName: "Alice",
      lastName: "W.",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    sellerId: "seller-id-123",
    reviewerId: "user-id-456",
    seller: {
      firstName: "Seller",
      lastName: "One",
      avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    rating: 3.5,
    comment: "Item as described. Would buy again.",
    reviewer: {
      firstName: "Bob",
      lastName: "K.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    reviewerId: "user-id-789",
    sellerId: "seller-id-123",
    seller: {
      firstName: "Seller",
      lastName: "One",
      avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    rating: 3,
    comment: "Average experience. Communication could be better.",
    seller: {
      firstName: "Seller",
      lastName: "One",
      avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    },
    reviewerId: "user-id-101",
    sellerId: "seller-id-123",
    reviewer: {
      firstName: "Cathy",
      lastName: "L.",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function SellerReviewScreen() {
  const { sellerId = "" } = useLocalSearchParams() as { sellerId: string };
  const { colors, spacing, icons, radius } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSellerReviews(sellerId, 20);

  const { sellerProfile, isLoading: isLoadingProfile } = useSeller(sellerId);
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
          <Ionicons key={i} name="star" size={icons.xs} color={colors.yellow} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons
            key={i}
            name="star-half"
            size={icons.xs}
            color={colors.yellow}
          />
        );
      } else {
        stars.push(
          <Ionicons
            key={i}
            name="star-outline"
            size={icons.xs}
            color={colors.yellow}
          />
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
        onPress={() => {}}
        title="Add Review"
        style={{ backgroundColor: colors.primary, borderRadius:radius.sm }}
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

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={DummyReviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewCard review={item} />}
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
    </AppView>
  );
}
