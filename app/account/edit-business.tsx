import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { BackButton } from "@/components/ui/BackButton";
import { Header } from "@/components/ui/Header";
import InputField from "@/components/ui/InputField";
import TextAreaField from "@/components/ui/TextAreaField";
import { TextButton } from "@/components/ui/TextButton";
import { useAuth } from "@/hooks/useAuth";
import { useSeller } from "@/hooks/useSeller";
import { useTheme } from "@/hooks/useTheme";
import { CreateSellerProfileRequest } from "@/types";
import { Feather } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { useFormik } from "formik";
import { useRef } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import * as Yup from "yup";

// -------------------------
// VALIDATION SCHEMA
// -------------------------
const BusinessProfileSchema = Yup.object().shape({
  businessName: Yup.string()
    .min(2, "Business name must be at least 2 characters")
    .required("Business name is required"),
  businessType: Yup.string()
    .min(2, "Business type must be at least 2 characters")
    .required("Business type is required"),
  description: Yup.string().optional(),
  website: Yup.string().url("Invalid URL").optional(),
  facebook: Yup.string().url("Invalid URL").optional(),
  instagram: Yup.string().url("Invalid URL").optional(),
  twitter: Yup.string().url("Invalid URL").optional(),
  linkedin: Yup.string().url("Invalid URL").optional(),
  agreeToTerms: Yup.boolean().oneOf(
    [true],
    "You must agree to the terms and conditions"
  ),
});

export default function SetupBusinessProfileScreen() {
  const { icons, spacing, colors, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    createSellerProfileAsync,
    isCreating,
    updateSellerProfileAsync,
    isUpdating,
  } = useSeller();
  const router = useRouter();

  const sellerProfile = user?.sellerProfile;
  const isEditMode = !!sellerProfile;

  const businessTypeRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);
  const streetRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const countryRef = useRef<TextInput>(null);
  const postalCodeRef = useRef<TextInput>(null);

  const {
    values,
    handleChange,
    setFieldValue,
    handleBlur,
    errors,
    touched,
    handleSubmit,
  } = useFormik({
    initialValues: {
      businessName: sellerProfile?.businessName || "",
      businessType: sellerProfile?.businessType || "",
      description: sellerProfile?.description || "",
      website: sellerProfile?.website || "",
      facebook: sellerProfile?.socialMedia?.facebook || "",
      instagram: sellerProfile?.socialMedia?.instagram || "",
      twitter: sellerProfile?.socialMedia?.twitter || "",
      linkedin: sellerProfile?.socialMedia?.linkedin || "",
      agreeToTerms: isEditMode,
    },
    validationSchema: BusinessProfileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const requestData: CreateSellerProfileRequest = {
          businessName: values.businessName,
          businessType: values.businessType,
          description: values.description || undefined,
          website: values.website || undefined,
          socialMedia: {
            facebook: values.facebook || undefined,
            instagram: values.instagram || undefined,
            twitter: values.twitter || undefined,
            linkedin: values.linkedin || undefined,
          },
        };

        if (isEditMode && sellerProfile?.id) {
          await updateSellerProfileAsync({
            sellerId: sellerProfile.id,
            data: requestData,
          });
          toast.success("Business profile updated successfully!");
        } else {
          await createSellerProfileAsync(requestData);
          toast.success("Business profile created successfully!");
        }
        router.push("/account/business");
      } catch (error: any) {
        toast.error(
          error?.message ||
            `Failed to ${isEditMode ? "update" : "create"} business profile`
        );
      }
    },
  });

  if (isAuthLoading || !user) {
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
              backgroundColor={colors.accent}
              containerStyle={{ paddingHorizontal: spacing.md }}
              left={<BackButton />}
            >
              <AppView
                style={{
                  height: 150,
                  marginBottom: -50,
                  backgroundColor: colors.brown,
                  borderRadius: radius.lg,
                  marginTop: spacing.lg,
                }}
              >
                <ImageBackground
                  style={{ height: 150, width: "auto" }}
                  source={require("@/assets/images/drawer-promo.png")}
                  contentFit="contain"
                />
                <AppView
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.xxl,
                    gap: spacing.sm,
                    height: 150,
                    zIndex: 10,
                  }}
                >
                  <AppText
                    variant="lg"
                    style={{
                      fontWeight: "600",
                      color: colors.textWhite,
                      textAlign: "center",
                    }}
                  >
                    {isEditMode
                      ? "Edit Business Profile"
                      : "Set up your Business"}
                  </AppText>
                  <AppText
                    style={{
                      color: colors.textWhite,
                      textAlign: "center",
                    }}
                  >
                    {isEditMode
                      ? "Update your business information"
                      : "Let's get started by setting up your business profile"}
                  </AppText>
                </AppView>
              </AppView>
            </Header>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingTop: spacing.lg + 50,
            paddingBottom: insets.bottom + spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Business Information Section */}
          <AppView style={{ marginBottom: spacing.lg }}>
            <AppText
              variant="lg"
              style={{ fontWeight: "600", marginBottom: spacing.md }}
            >
              Business Information
            </AppText>

            <AppView style={{ gap: spacing.md }}>
              <InputField
                leftIcon={
                  <Feather
                    name="briefcase"
                    color={colors.iconGray}
                    size={icons.md}
                  />
                }
                label="Business Name"
                placeholder="Enter your business name"
                value={values.businessName}
                onChangeText={handleChange("businessName")}
                onBlur={handleBlur("businessName")}
                error={touched.businessName && errors.businessName}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmit={() => businessTypeRef.current?.focus()}
              />

              <InputField
                ref={businessTypeRef}
                leftIcon={
                  <Feather name="tag" color={colors.iconGray} size={icons.md} />
                }
                label="Business Type"
                placeholder="e.g., Electronics, Fashion, etc."
                value={values.businessType}
                onChangeText={handleChange("businessType")}
                onBlur={handleBlur("businessType")}
                error={touched.businessType && errors.businessType}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmit={() => descriptionRef.current?.focus()}
              />

              <TextAreaField
                ref={descriptionRef}
                leftIcon={
                  <Feather
                    name="file-text"
                    color={colors.iconGray}
                    size={icons.md}
                  />
                }
                label="Description (Optional)"
                placeholder="Tell us about your business"
                value={values.description}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                error={touched.description && errors.description}
                numberOfLines={4}
                returnKeyType="next"
              />
            </AppView>
          </AppView>

          {/* Social Media Section */}
          <AppView style={{ marginBottom: spacing.lg }}>
            <AppText
              variant="lg"
              style={{ fontWeight: "600", marginBottom: spacing.md }}
            >
              Social Media (Optional)
            </AppText>

            <AppView style={{ gap: spacing.md }}>
              <InputField
                leftIcon={
                  <Feather
                    name="globe"
                    color={colors.iconGray}
                    size={icons.md}
                  />
                }
                label="Website"
                placeholder="https://yourbusiness.com"
                value={values.website}
                onChangeText={handleChange("website")}
                onBlur={handleBlur("website")}
                error={touched.website && errors.website}
                autoCapitalize="none"
                keyboardType="url"
                returnKeyType="next"
              />

              <InputField
                leftIcon={
                  <Feather
                    name="facebook"
                    color={colors.iconGray}
                    size={icons.md}
                  />
                }
                label="Facebook"
                placeholder="https://facebook.com/yourbusiness"
                value={values.facebook}
                onChangeText={handleChange("facebook")}
                onBlur={handleBlur("facebook")}
                error={touched.facebook && errors.facebook}
                autoCapitalize="none"
                keyboardType="url"
                returnKeyType="next"
              />

              <InputField
                leftIcon={
                  <Feather
                    name="instagram"
                    color={colors.iconGray}
                    size={icons.md}
                  />
                }
                label="Instagram"
                placeholder="https://instagram.com/yourbusiness"
                value={values.instagram}
                onChangeText={handleChange("instagram")}
                onBlur={handleBlur("instagram")}
                error={touched.instagram && errors.instagram}
                autoCapitalize="none"
                keyboardType="url"
                returnKeyType="next"
              />

              <InputField
                leftIcon={
                  <Feather
                    name="twitter"
                    color={colors.iconGray}
                    size={icons.md}
                  />
                }
                label="Twitter"
                placeholder="https://twitter.com/yourbusiness"
                value={values.twitter}
                onChangeText={handleChange("twitter")}
                onBlur={handleBlur("twitter")}
                error={touched.twitter && errors.twitter}
                autoCapitalize="none"
                keyboardType="url"
                returnKeyType="next"
              />

              <InputField
                leftIcon={
                  <Feather
                    name="linkedin"
                    color={colors.iconGray}
                    size={icons.md}
                  />
                }
                label="LinkedIn"
                placeholder="https://linkedin.com/company/yourbusiness"
                value={values.linkedin}
                onChangeText={handleChange("linkedin")}
                onBlur={handleBlur("linkedin")}
                error={touched.linkedin && errors.linkedin}
                autoCapitalize="none"
                keyboardType="url"
                returnKeyType="done"
              />
            </AppView>
          </AppView>

          {/* Agreement Section - Only show for new profiles */}
          {!isEditMode && (
            <AppView
              style={{
                marginBottom: spacing.xl,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.md,
                backgroundColor: colors.background,
                borderRadius: radius.md,
              }}
            >
              <Pressable
                onPress={() =>
                  setFieldValue("agreeToTerms", !values.agreeToTerms)
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <AppView
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: values.agreeToTerms
                      ? colors.primary
                      : colors.border,
                    backgroundColor: values.agreeToTerms
                      ? colors.primary
                      : "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {values.agreeToTerms && (
                    <Feather name="check" color={colors.textWhite} size={16} />
                  )}
                </AppView>

                <AppView style={{ flex: 1 }}>
                  <AppText variant="sm" style={{ lineHeight: 20 }}>
                    I agree to the{" "}
                    <AppText
                      variant="sm"
                      style={{ color: colors.primary, fontWeight: "600" }}
                    >
                      Terms and Conditions
                    </AppText>{" "}
                    and{" "}
                    <AppText
                      variant="sm"
                      style={{ color: colors.primary, fontWeight: "600" }}
                    >
                      Privacy Policy
                    </AppText>
                  </AppText>
                </AppView>
              </Pressable>

              {touched.agreeToTerms && errors.agreeToTerms && (
                <AppText
                  variant="xs"
                  style={{ color: colors.error, marginTop: spacing.xs }}
                >
                  {errors.agreeToTerms}
                </AppText>
              )}
            </AppView>
          )}

          {/* Submit Button */}
          <TextButton
            title={
              isCreating || isUpdating
                ? isEditMode
                  ? "Updating Profile..."
                  : "Creating Profile..."
                : isEditMode
                ? "Update Business Profile"
                : "Create Business Profile"
            }
            onPress={() => handleSubmit()}
            disabled={isCreating || isUpdating}
            style={{
              backgroundColor: colors.black,
              width: 300,
              alignSelf: "center",
              height: 50,
            }}
            titleStyle={{ color: colors.textWhite }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppView>
  );
}
