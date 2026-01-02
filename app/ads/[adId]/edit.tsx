import AdForm from "@/components/ads/AdForm";
import AppText from "@/components/ui/AppText";
import { useAd, useUpdateAd } from "@/hooks/useAds";
import { useResubmitAd } from "@/hooks/useSellerAds";
import { useTheme } from "@/hooks/useTheme";
import { UpdateAdRequest } from "@/types";
import { Feather } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { toast } from "sonner-native";

export default function EditAdScreen() {
  const { adId, resubmit } = useLocalSearchParams<{ adId: string; resubmit?: string }>();
  const { colors, spacing, icons } = useTheme();
  const isResubmitMode = resubmit === "true";

  const { data: ad, isLoading: loadingAd, error } = useAd(adId, !!adId);
  const updateMutation = useUpdateAd();
  const { resubmitAsync, isResubmitting } = useResubmitAd();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load ad");
      router.back();
    }
  }, [error]);

  const handleSubmit = async (formData: UpdateAdRequest) => {
    try {
      if (isResubmitMode) {
        // Resubmission flow
        await resubmitAsync({
          adId,
          data: {
            title: formData.title,
            description: formData.description,
            price: formData.price,
            condition: formData.condition,
            images: formData.images,
          },
        });
        router.back();
      } else {
        // Normal update flow
        const updateData: UpdateAdRequest = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          condition: formData.condition,
          images: formData.images,
          address: formData.address,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
          isNegotiable: formData.isNegotiable,
          categoryId: formData.categoryId,
          currency: formData.currency,
          cityId: formData.cityId,
          fieldValues: formData.fieldValues,
        };

        await updateMutation.mutateAsync({
          id: adId,
          data: updateData,
        });

        toast.success("Ad updated successfully!");
        router.back();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || `Failed to ${isResubmitMode ? "resubmit" : "update"} ad`);
      console.log(`Error ${isResubmitMode ? "resubmitting" : "updating"} ad:`, error);
    }
  };

  if (loadingAd) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack.Screen
          options={{
            title: isResubmitMode ? "Resubmit Ad" : "Edit Ad",
            headerShown: true,
            headerBackTitle: "Back",
          }}
        />
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText style={{ marginTop: spacing.md }}>Loading ad...</AppText>
      </View>
    );
  }

  if (!ad) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.xl,
        }}
      >
        <Stack.Screen
          options={{
            title: isResubmitMode ? "Resubmit Ad" : "Edit Ad",
            headerShown: true,
            headerBackTitle: "Back",
          }}
        />
        <AppText>Ad not found</AppText>
      </View>
    );
  }

  // Transform ad data to form data
  const initialData: UpdateAdRequest = {
    title: ad.title,
    description: ad.description,
    price: ad.price,
    currency: ad.currency,
    condition: ad.condition,
    categoryId: ad.categoryId,
    cityId: ad.cityId,
    images: ad.images,
    address: ad.address,
    contactPhone: ad.contactPhone,
    contactEmail: ad.contactEmail,
    isNegotiable: ad.isNegotiable,
    fieldValues:
      ad.fieldValues?.map((fv) => ({
        categoryFieldId: fv.categoryFieldId,
        value: fv.value,
      })) || [],
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: isResubmitMode ? "Resubmit Ad" : "Edit Ad",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
      
      {/* Rejection Banner */}
      {isResubmitMode && ad.rejectionReason && (
        <View
          style={{
            backgroundColor: colors.errorLight,
            borderLeftWidth: 4,
            borderLeftColor: colors.error,
            padding: spacing.md,
            marginHorizontal: spacing.md,
            marginTop: spacing.sm,
            borderRadius: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.xs }}>
            <Feather name="alert-circle" size={icons.sm} color={colors.error} />
            <AppText
              variant="sm"
              style={{
                fontWeight: "600",
                color: colors.error,
                marginLeft: spacing.xs,
              }}
            >
              Rejection Reason
            </AppText>
          </View>
          <AppText variant="sm" style={{ color: colors.text, marginBottom: spacing.sm }}>
            {ad.rejectionReason}
          </AppText>
          
          {ad.rejectionRecommendations && (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.xs }}>
                <Feather name="info" size={icons.sm} color={colors.primary} />
                <AppText
                  variant="sm"
                  style={{
                    fontWeight: "600",
                    color: colors.primary,
                    marginLeft: spacing.xs,
                  }}
                >
                  Recommendations
                </AppText>
              </View>
              <AppText variant="sm" style={{ color: colors.text }}>
                {ad.rejectionRecommendations}
              </AppText>
            </>
          )}
        </View>
      )}
      
      <AdForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending || isResubmitting}
        submitButtonText={isResubmitMode ? "Resubmit for Review" : "Update Ad"}
      />
    </View>
  );
}
