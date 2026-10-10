import AdForm from "@/components/ads/AdForm";
import BecomeSellerBanner from "@/components/auth/BecomeSellerBanner";
import { Header } from "@/components/ui/Header";
import { useCreateAd } from "@/hooks/useAds";
import { useAuth } from "@/hooks/useAuth";
import { useMySeller } from "@/hooks/useSeller";
import { useTheme } from "@/hooks/useTheme";
import {
  clearAdDraft,
  loadAdDraft,
  type AdCreateDraft,
} from "@/hooks/useAdDraft";
import { useCategorySelection } from "@/hooks/useCategorySelection";
import { useLocationSelection } from "@/hooks/useLocationSelection";
import { CreateAdRequest } from "@/types";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import AppText from "@/components/ui/AppText";
import { toast } from "sonner-native";

export default function CreateAdScreen() {
  const { colors, spacing } = useTheme();
  const { user } = useAuth();
  const { sellerProfile, isLoading: isLoadingSeller } = useMySeller();
  const createMutation = useCreateAd();
  const { clearCategorySelection } = useCategorySelection();
  const { clearLocationSelection } = useLocationSelection();

  // Load any unfinished listing once per mount (MMKV survives restarts).
  const [draft, setDraft] = useState<AdCreateDraft | null>(() => loadAdDraft());
  // Bump to remount the form blank after "Discard draft".
  const [formKey, setFormKey] = useState(0);

  const showBanner =
    !!user && !isLoadingSeller && !sellerProfile;

  const discardDraft = () => {
    clearAdDraft();
    clearCategorySelection();
    clearLocationSelection();
    setDraft(null);
    setFormKey((k) => k + 1);
    toast.success("Draft discarded");
  };

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

      // Listing published — the autosaved draft has served its purpose.
      clearAdDraft();
      clearCategorySelection();
      clearLocationSelection();
      setDraft(null);

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
      <BecomeSellerBanner visible={showBanner} />
      {draft && (
        <Pressable
          onPress={discardDraft}
          style={{
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          }}
        >
          <AppText style={{ color: "#D92D20", fontSize: 14 }}>
            Discard restored draft
          </AppText>
        </Pressable>
      )}
      <AdForm
        key={formKey}
        draft={draft}
        autosaveDraft
        onSubmit={(data) => handleSubmit(data as CreateAdRequest)}
        isLoading={createMutation.isPending}
        submitButtonText="Create & Submit"
      />
    </View>
  );
}
