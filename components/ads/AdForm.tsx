import AdImageUploader from "@/components/ads/AdImageUploader";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import IconButton from "@/components/ui/IconButton";
import InputField from "@/components/ui/InputField";
import PlaceholderField from "@/components/ui/PlaceholderField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import RichTextArea from "@/components/ui/RichTextArea";
import TextAreaField from "@/components/ui/TextAreaField";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { useAuth } from "@/hooks/useAuth";
import { useParentCategories, useSubcategories } from "@/hooks/useCategories";
import { useCategoryFields } from "@/hooks/useCategoryFields";
import { useTheme } from "@/hooks/useTheme";
import { AdCondition, CategoryFieldType, CreateAdRequest } from "@/types";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";

interface AdFormProps {
  initialData?: Partial<CreateAdRequest>;
  onSubmit: (data: CreateAdRequest) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export default function AdForm({
  initialData,
  onSubmit,
  isLoading,
  submitButtonText = "Submit",
}: AdFormProps) {
  const { colors, spacing, radius, icons } = useTheme();
  const { user } = useAuth();

  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price || 0);
  const [currency, setCurrency] = useState(initialData?.currency || "GHS");
  const [condition, setCondition] = useState<AdCondition | undefined>(
    initialData?.condition
  );
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [address, setAddress] = useState(
    initialData?.address || user?.sellerProfile?.verification?.address
  );
  const [contactPhone, setContactPhone] = useState(
    initialData?.contactPhone || user?.phone
  );
  const [contactEmail, setContactEmail] = useState(
    initialData?.contactEmail || user?.email
  );
  const [isNegotiable, setIsNegotiable] = useState(
    initialData?.isNegotiable || false
  );
  const [fieldValues, setFieldValues] = useState<
    { categoryFieldId: string; value: string }[]
  >(initialData?.fieldValues || []);

  // Rich text editor ref
  const richEditorRef = useRef<RichEditor>(null);

  // Queries
  const { data: parentCategories, isLoading: loadingParents } =
    useParentCategories();
  const { data: subcategories, isLoading: loadingSubcategories } =
    useSubcategories(parentCategoryId);
  const { data: categoryFields, isLoading: loadingFields } =
    useCategoryFields(categoryId);

  // Initialize field values when category changes
  useEffect(() => {
    if (
      categoryFields &&
      categoryFields.length > 0 &&
      !initialData?.fieldValues
    ) {
      const existingFieldMap = new Map(
        fieldValues.map((fv) => [fv.categoryFieldId, fv.value])
      );

      const newFieldValues = categoryFields.map((field) => ({
        categoryFieldId: field.id,
        value: existingFieldMap.get(field.id) || "",
      }));

      setFieldValues(newFieldValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFields]);

  // Handle images uploaded from AdImageUploader
  const handleImagesUploaded = (uploadedUrls: string[]) => {
    setImages(uploadedUrls);
  };

  const handleFieldValueChange = (fieldId: string, value: string) => {
    setFieldValues((prev) =>
      prev.map((fv) => (fv.categoryFieldId === fieldId ? { ...fv, value } : fv))
    );
  };

  const renderDynamicField = (field: any) => {
    const fieldValue =
      fieldValues.find((fv) => fv.categoryFieldId === field.id)?.value || "";

    switch (field.type) {
      case CategoryFieldType.TEXT:
        return (
          <InputField
            key={field.id}
            label={field.label + (field.isRequired ? " *" : "")}
            value={fieldValue}
            onChangeText={(value) => handleFieldValueChange(field.id, value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            style={{ marginBottom: spacing.md }}
          />
        );

      case CategoryFieldType.NUMBER:
        return (
          <InputField
            key={field.id}
            label={field.label + (field.isRequired ? " *" : "")}
            value={fieldValue}
            onChangeText={(value) => handleFieldValueChange(field.id, value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            keyboardType="numeric"
            style={{ marginBottom: spacing.md }}
          />
        );

      case CategoryFieldType.TEXTAREA:
        return (
          <TextAreaField
            key={field.id}
            label={field.label + (field.isRequired ? " *" : "")}
            value={fieldValue}
            onChangeText={(value) => handleFieldValueChange(field.id, value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            numberOfLines={4}
            style={{ marginBottom: spacing.md }}
          />
        );

      case CategoryFieldType.SELECT:
      case CategoryFieldType.RADIO:
        return (
          <View key={field.id} style={{ marginBottom: spacing.md }}>
            <AppText variant="sm" style={{ marginBottom: spacing.sm }}>
              {field.label + (field.isRequired ? " *" : "")}
            </AppText>
            <View style={{ gap: spacing.sm }}>
              {field.options?.map((option: any) => (
                <Pressable
                  key={option.value}
                  onPress={() => handleFieldValueChange(field.id, option.value)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: spacing.md,
                    backgroundColor:
                      fieldValue === option.value
                        ? colors.primaryLight
                        : colors.inputBg,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor:
                      fieldValue === option.value
                        ? colors.primary
                        : colors.border,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor:
                        fieldValue === option.value
                          ? colors.primary
                          : colors.border,
                      marginRight: spacing.sm,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {fieldValue === option.value && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: colors.primary,
                        }}
                      />
                    )}
                  </View>
                  <AppText>{option.label}</AppText>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case CategoryFieldType.CHECKBOX:
        const checkboxValues = fieldValue ? fieldValue.split(",") : [];
        return (
          <View key={field.id} style={{ marginBottom: spacing.md }}>
            <AppText variant="sm" style={{ marginBottom: spacing.sm }}>
              {field.label + (field.isRequired ? " *" : "")}
            </AppText>
            <View style={{ gap: spacing.sm }}>
              {field.options?.map((option: any) => {
                const isChecked = checkboxValues.includes(option.value);
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      const newValues = isChecked
                        ? checkboxValues.filter((v) => v !== option.value)
                        : [...checkboxValues, option.value];
                      handleFieldValueChange(field.id, newValues.join(","));
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: spacing.md,
                      backgroundColor: colors.inputBg,
                      borderRadius: radius.md,
                      borderWidth: 1,
                      borderColor: isChecked ? colors.primary : colors.border,
                    }}
                  >
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: isChecked ? colors.primary : colors.border,
                        marginRight: spacing.sm,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: isChecked
                          ? colors.primary
                          : "transparent",
                      }}
                    >
                      {isChecked && (
                        <Feather
                          name="check"
                          size={14}
                          color={colors.iconWhite}
                        />
                      )}
                    </View>
                    <AppText>{option.label}</AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );

      case CategoryFieldType.BOOLEAN:
        return (
          <ToggleSwitch
            key={field.id}
            label={field.label + (field.isRequired ? " *" : "")}
            value={fieldValue === "true"}
            onValueChange={(val) =>
              handleFieldValueChange(field.id, val ? "true" : "false")
            }
            style={{ marginBottom: spacing.md }}
          />
        );

      default:
        return null;
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }
    if (!categoryId) {
      alert("Please select a category");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      alert("Please enter a valid price");
      return;
    }
    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    // Check required fields
    const requiredFields =
      categoryFields?.filter((field) => field.isRequired) || [];
    for (const field of requiredFields) {
      const value = fieldValues.find(
        (fv) => fv.categoryFieldId === field.id
      )?.value;
      if (!value || value.trim() === "") {
        alert(`Please fill in the required field: ${field.label}`);
        return;
      }
    }

    const formData: CreateAdRequest = {
      title: title.trim(),
      description: description.trim(),
      price,
      currency,
      condition,
      categoryId,
      images,
      address: address.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      isNegotiable,
      fieldValues: fieldValues.filter((fv) => fv.value.trim() !== ""),
    };

    onSubmit(formData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: spacing.md }}
      >
        <Pressable
          onPress={() => {
            richEditorRef.current?.dismissKeyboard();
          }}
        >
          {/* Images */}
          <AppView style={{ marginBottom: spacing.lg }}>
            <AdImageUploader
              label="Images * (Max 5)"
              maxImages={5}
              initialImages={images}
              autoUpload={true}
              onImagesUploaded={handleImagesUploaded}
            />
          </AppView>

          {/* Basic Information */}
          <AppView style={{ marginBottom: spacing.lg }}>
            <InputField
              label="Title *"
              value={title}
              onChangeText={setTitle}
              placeholder="Enter ad title"
              style={{ marginBottom: spacing.md }}
            />

            <RichTextArea
              ref={richEditorRef}
              label="Description *"
              value={description}
              onChange={setDescription}
              placeholder="Describe your item in detail"
              style={{ marginBottom: spacing.md }}
            />
          </AppView>

          {/* Category Selection */}
          <AppView style={{ marginBottom: spacing.lg }}>
            <PlaceholderField
              label="Category *"
              placeholder="Select a category"
              onPress={() => {
                router.push({
                  pathname: "/(ads)/categories",
                });
              }}
              inputStyle={{
                backgroundColor: colors.selectBg,
                paddingRight: spacing.sm,
              }}
              rightIcon={
                <IconButton
                  onPress={() => {}}
                  style={{
                    backgroundColor: colors.iconLightGray,
                    borderRadius: radius.sm,
                  }}
                  icon={
                    <Feather
                      name="chevron-down"
                      size={icons.sm}
                      color={colors.iconGray}
                    />
                  }
                />
              }
              style={{ marginBottom: spacing.md }}
            />
          </AppView>

          {/* Dynamic Category Fields */}
          {categoryId && categoryFields && categoryFields.length > 0 && (
            <AppView style={{ marginBottom: spacing.lg }}>
              {loadingFields ? (
                <ActivityIndicator />
              ) : (
                categoryFields.map((field) => renderDynamicField(field))
              )}
            </AppView>
          )}

          {/* Pricing */}
          <AppView style={{ marginBottom: spacing.lg }}>
            <View
              style={{
                flexDirection: "row",
                gap: spacing.md,
                marginBottom: spacing.md,
              }}
            >
              <View style={{ flex: 2 }}>
                <PlaceholderField
                  label="Currency"
                  value={currency}
                  placeholder="USD"
                  onPress={() => {}}
                  rightIcon={
                    <IconButton
                      style={{
                        backgroundColor: colors.iconLightGray,
                        borderRadius: radius.sm,
                      }}
                      icon={
                        <Feather
                          name="chevron-down"
                          size={icons.sm}
                          color={colors.iconGray}
                        />
                      }
                    />
                  }
                />
              </View>
              <View style={{ flex: 4 }}>
                <InputField
                  label="Price *"
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <ToggleSwitch
              label="Negotiable Price"
              description="Allow buyers to negotiate the price"
              value={isNegotiable}
              onValueChange={setIsNegotiable}
            />
          </AppView>

          {/* Condition */}
          <AppView style={{ marginBottom: spacing.lg }}>
            <PlaceholderField
              label="Condition"
              placeholder="Select condition"
              onPress={() => {
                // Open condition selection modal (not implemented here)
              }}
              rightIcon={
                <IconButton
                  onPress={() => {}}
                  style={{
                    backgroundColor: colors.iconLightGray,
                    borderRadius: radius.sm,
                  }}
                  icon={
                    <Feather
                      name="chevron-down"
                      size={icons.sm}
                      color={colors.iconGray}
                    />
                  }
                />
              }
            />
          </AppView>

          {/* Contact Information */}
          <AppView style={{ marginBottom: spacing.lg }}>
            <AppText variant="lg" style={{ marginBottom: spacing.md }}>
              Contact Information
            </AppText>

            <InputField
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Enter location"
              style={{ marginBottom: spacing.md }}
            />

            <InputField
              label="Contact Phone"
              value={contactPhone}
              onChangeText={setContactPhone}
              placeholder="+1234567890"
              keyboardType="phone-pad"
              style={{ marginBottom: spacing.md }}
            />

            <InputField
              label="Contact Email"
              value={contactEmail}
              onChangeText={setContactEmail}
              placeholder="email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </AppView>

          {/* Submit Button */}
          <PrimaryButton
            title={submitButtonText}
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={{ marginBottom: spacing.xl }}
          />
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
