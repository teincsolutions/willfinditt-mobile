import { ReviewCard } from "@/components/reviews/ReviewCard";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import { useMySeller, useSellerReviews } from "@/hooks/useSeller";
import { useTheme } from "@/hooks/useTheme";
import { PaginatedResponse, SellerReview } from "@/types";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyReviewsScreen() {
  const { colors, spacing, icons } = useTheme();
  const insets = useSafeAreaInsets();

  const { sellerProfile } = useMySeller();
  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSellerReviews(sellerProfile?.id || "", 20);

  // Flatten all pages into a single array
  const reviews = data?.pages.flatMap((page: PaginatedResponse<SellerReview>) => page.data) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
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
          You haven&apos;t received any reviews yet
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
      }}
    >
      <AppText variant="lg" fontWeight="bold" style={{ color: colors.text }}>
        My Reviews ({reviews.length})
      </AppText>
      <AppText
        variant="sm"
        style={{
          color: colors.textGray,
          marginTop: spacing.xs,
        }}
      >
        Reviews from your customers
      </AppText>
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
      <Stack.Screen
        options={{
          header: () => (
            <Header
              title="My Reviews"
              containerStyle={{
                paddingBottom: spacing.sm,
                paddingHorizontal: spacing.md,
              }}
            />
          ),
        }}
      />
      <FlatList
        data={reviews}
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
