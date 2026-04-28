import AdForm from "@/components/ads/AdForm";
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

  const handleSubmit = async (formData: CreateAdRequest) => {
    try {
      const adData: CreateAdRequest = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        currency: formData.currency,
        condition: formData.condition,
        categoryId: formData.categoryId,
        images: formData.images,
        address: formData.address,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        isNegotiable: formData.isNegotiable,
        fieldValues: formData.fieldValues,
        cityId: formData.cityId,
        status: formData.status,
      };

      const newAd = await createMutation.mutateAsync(adData);

      toast.success("Product created successfully!");

      // Navigate to the ad details page
      router.replace(`/ads/${newAd.id}`);
    } catch (error: any) {
      // Parse error response for better error messaging, especially for 400 errors
      let errorMessage = "Failed to create ad";

      if (error?.response?.data) {
        const errorData = error.response.data;
        // Handle backend validation errors (400)
        if (errorData.message) {
          if (Array.isArray(errorData.message)) {
            // Handle array of validation errors
            errorMessage = errorData.message.join("\n");
          } else {
            errorMessage = errorData.message;
          }
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      console.error("Error creating ad:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: "Create Product",
          headerShown: true,
          header: () => (
            <Header
              title="Create Product"
              containerStyle={{ paddingHorizontal: spacing.md }}
            />
          ),
        }}
      />
      <AdForm
        onSubmit={(data) => handleSubmit(data as CreateAdRequest)}
        isLoading={createMutation.isPending}
        submitButtonText="Create & Submit"
      />
    </View>
  );
}
