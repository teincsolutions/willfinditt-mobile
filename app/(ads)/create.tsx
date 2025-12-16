import AdForm, { AdFormData } from "@/components/ads/AdForm";
import { Header } from "@/components/ui/Header";
import { useCreateAd } from "@/hooks/useAds";
import { useTheme } from "@/hooks/useTheme";
import { CreateAdRequest } from "@/types";
import { router, Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { toast } from "sonner-native";

export default function CreateAdScreen() {
  const { colors, spacing } = useTheme();
  const createMutation = useCreateAd();

  const handleSubmit = async (formData: AdFormData) => {
    try {
      const adData: CreateAdRequest = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        condition: formData.condition,
        categoryId: formData.categoryId,
        images: formData.images,
        address: formData.address,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        isNegotiable: formData.isNegotiable,
        fieldValues: formData.fieldValues,
      };

      const newAd = await createMutation.mutateAsync(adData);

      toast.success("Ad created successfully!");

      // Navigate to the ad details page
      router.replace(`/(ads)/${newAd.id}`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create ad");
      console.error("Error creating ad:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: "Create Ad",
          headerShown: true,
          header: () => (
            <Header
              title="Create Ad"
              containerStyle={{ paddingHorizontal: spacing.md }}
            />
          ),
        }}
      />
      <AdForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        submitButtonText="Create Ad"
      />
    </View>
  );
}
