import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useSellerRejectedAds } from "@/hooks/useSellerAds";
import { SellerRejectedAd } from "@/types/ad";
import { Feather } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RejectedAdsScreen() {
  const { colors, spacing, radius, icons } = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: rejectedAdsData,
    isLoading,
    refetch,
  } = useSellerRejectedAds({ limit: 50 });

  const rejectedAds = rejectedAdsData?.data || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleResubmit = (ad: SellerRejectedAd) => {
    if (!ad.canResubmit) {
      Alert.alert(
        "Cannot Resubmit",
        "This ad has reached the maximum resubmission limit or the deadline has passed.",
        [{ text: "OK" }]
      );
      return;
    }

    router.push({
      pathname: `/ads/edit/${ad.id}` as any,
      params: { resubmit: "true" },
    });
  };

  const handleViewDetails = (adId: string) => {
    router.push(`/ads/${adId}` as any);
  };

  const renderRejectedAd = ({ item }: { item: SellerRejectedAd }) => {
    const thumbnail = item.images?.[0];
    const daysAgo = item.rejectedAt
      ? formatDistanceToNow(new Date(item.rejectedAt), { addSuffix: true })
      : "";
    const canResubmit = item.canResubmit;
    const resubmissionDeadline = item.resubmissionDeadline
      ? new Date(item.resubmissionDeadline)
      : null;
    const isDeadlineSoon =
      resubmissionDeadline &&
      resubmissionDeadline.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days

    return (
      <TouchableOpacity
        onPress={() => handleViewDetails(item.id)}
        style={{
          backgroundColor: colors.backgroundSecondary,
          borderRadius: radius.md,
          marginHorizontal: spacing.md,
          marginBottom: spacing.md,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {/* Ad Header */}
        <View style={{ flexDirection: "row", marginBottom: spacing.md }}>
          {/* Thumbnail */}
          {thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              style={{
                width: 80,
                height: 80,
                borderRadius: radius.sm,
                backgroundColor: colors.backgroundSecondary,
              }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: radius.sm,
                backgroundColor: colors.backgroundSecondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="image" size={icons.lg} color={colors.textGray} />
            </View>
          )}

          {/* Ad Info */}
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <AppText
              variant="md"
              style={{ fontWeight: "600", marginBottom: spacing.xs }}
            >
              {item.title}
            </AppText>
            <AppText variant="sm" style={{ color: colors.textGray }}>
              {item.currency} {item.price.toLocaleString()}
            </AppText>
            <AppText
              variant="xs"
              style={{ color: colors.error, marginTop: spacing.xs }}
            >
              Rejected {daysAgo}
            </AppText>
            {item.resubmissionCount > 0 && (
              <AppText
                variant="xs"
                style={{ color: colors.textGray, marginTop: 2 }}
              >
                Resubmitted {item.resubmissionCount}x
              </AppText>
            )}
          </View>
        </View>

        {/* Rejection Reason */}
        <View
          style={{
            backgroundColor: colors.backgroundSecondary,
            padding: spacing.sm,
            borderRadius: radius.sm,
            marginBottom: spacing.md,
            borderLeftWidth: 3,
            borderLeftColor: colors.error,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: spacing.xs,
            }}
          >
            <Feather name="alert-circle" size={icons.xs} color={colors.error} />
            <AppText
              variant="xs"
              style={{
                fontWeight: "600",
                marginLeft: spacing.xs,
                color: colors.error,
              }}
            >
              Rejection Reason
            </AppText>
          </View>
          <AppText variant="sm" style={{ color: colors.text }}>
            {item.rejectionReason}
          </AppText>
        </View>

        {/* Recommendations */}
        {item.recommendations && (
          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: spacing.sm,
              borderRadius: radius.sm,
              marginBottom: spacing.md,
              borderLeftWidth: 3,
              borderLeftColor: colors.primary,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: spacing.xs,
              }}
            >
              <Feather name="info" size={icons.xs} color={colors.primary} />
              <AppText
                variant="xs"
                style={{
                  fontWeight: "600",
                  marginLeft: spacing.xs,
                  color: colors.primary,
                }}
              >
                Recommendations
              </AppText>
            </View>
            <AppText variant="sm" style={{ color: colors.text }}>
              {item.recommendations}
            </AppText>
          </View>
        )}

        {/* Resubmission Status */}
        {canResubmit && resubmissionDeadline && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: spacing.md,
              padding: spacing.sm,
              backgroundColor: isDeadlineSoon
                ? colors.warningLight
                : colors.backgroundSecondary,
              borderRadius: radius.sm,
            }}
          >
            <Feather
              name="clock"
              size={icons.xs}
              color={isDeadlineSoon ? colors.warning : colors.textGray}
            />
            <AppText
              variant="xs"
              style={{
                marginLeft: spacing.xs,
                color: isDeadlineSoon ? colors.warning : colors.textGray,
              }}
            >
              Resubmit by{" "}
              {formatDistanceToNow(resubmissionDeadline, { addSuffix: true })}
            </AppText>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          <PrimaryButton
            title={canResubmit ? "Resubmit" : "View Only"}
            onPress={() => handleResubmit(item)}
            disabled={!canResubmit}
            style={{ flex: 1 }}
          />
          <TouchableOpacity
            onPress={() => handleViewDetails(item.id)}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.sm,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="eye" size={icons.sm} color={colors.text} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <Header
              title="Rejected Ads"
              containerStyle={{
                paddingTop: insets.top + spacing.md,
                paddingBottom: spacing.md,
                paddingHorizontal: spacing.md,
              }}
            />
          ),
        }}
      />

      {isLoading && !refreshing ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={rejectedAds}
          keyExtractor={(item) => item.id}
          renderItem={renderRejectedAd}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: spacing.md,
            paddingBottom: insets.bottom + spacing.xl,
          }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: spacing.xl,
              }}
            >
              <Feather
                name="check-circle"
                size={60}
                color={colors.success}
                style={{ marginBottom: spacing.md }}
              />
              <AppText
                variant="lg"
                style={{
                  fontWeight: "600",
                  marginBottom: spacing.xs,
                  textAlign: "center",
                }}
              >
                No Rejected Ads
              </AppText>
              <AppText
                variant="sm"
                style={{
                  color: colors.textGray,
                  textAlign: "center",
                }}
              >
                All your ads meet our quality standards!
              </AppText>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </AppView>
  );
}
