import AdForm, { AdFormData } from "@/components/ads/AdForm";
import AppText from "@/components/ui/AppText";
import { useAd, useUpdateAd } from "@/hooks/useAds";
import { useTheme } from "@/hooks/useTheme";
import { UpdateAdRequest } from "@/types";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { toast } from "sonner-native";

export default function EditAdScreen() {
  const { adId } = useLocalSearchParams<{ adId: string }>();
  const { colors, spacing } = useTheme();

  const { data: ad, isLoading: loadingAd, error } = useAd(adId, !!adId);
  const updateMutation = useUpdateAd();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load ad");
      router.back();
    }
  }, [error]);

  const handleSubmit = async (formData: AdFormData) => {
    try {
      const updateData: UpdateAdRequest = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        condition: formData.condition,
        images: formData.images,
        address: formData.address,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        isNegotiable: formData.isNegotiable,
        fieldValues: formData.fieldValues,
      };

      await updateMutation.mutateAsync({
        id: adId,
        data: updateData,
      });

      toast.success("Ad updated successfully!");
      router.back();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update ad");
      console.error("Error updating ad:", error);
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
            title: "Edit Ad",
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
            title: "Edit Ad",
            headerShown: true,
            headerBackTitle: "Back",
          }}
        />
        <AppText>Ad not found</AppText>
      </View>
    );
  }

  // Transform ad data to form data
  const initialData: Partial<AdFormData> = {
    title: ad.title,
    description: ad.description,
    price: ad.price.toString(),
    currency: ad.currency,
    condition: ad.condition,
    categoryId: ad.categoryId,
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
          title: "Edit Ad",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
      <AdForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        submitButtonText="Update Ad"
      />
    </View>
  );
}
