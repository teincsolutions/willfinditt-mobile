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
import { useCategoryFields } from "@/hooks/useCategoryFields";
import { useCategorySelection } from "@/hooks/useCategorySelection";
import { useLocationSelection } from "@/hooks/useLocationSelection";
import { useTheme } from "@/hooks/useTheme";
import {
  AdCondition,
  CategoryField,
  CategoryFieldType,
  CreateAdRequest,
  UpdateAdRequest,
} from "@/types";
import { Feather } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useFormik } from "formik";
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
import * as Yup from "yup";
import { SelectableListSheet } from "../bottom-sheet/SelectableBottomSheet";
import SheetRadioOptionItem from "../bottom-sheet/SheetRadioOptionItem";
import CheckBox from "../ui/CheckBox";
import SearchableSelectModal from "../ui/SearchableSelectModal";

interface AdFormProps {
  initialData?: UpdateAdRequest;
  adId?: string;
  onSubmit: (data: CreateAdRequest) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

const conditionOptions = [
  { value: AdCondition.NEW, name: "New" },
  { value: AdCondition.LIKE_NEW, name: "Like New" },
  { value: AdCondition.GOOD, name: "Good" },
  { value: AdCondition.FAIR, name: "Fair" },
  { value: AdCondition.POOR, name: "Poor" },
];

const currencyOptions = [{ value: "GHS", name: "GHS" }];

// Helper function to build dynamic validation schema based on category fields
const buildValidationSchema = (
  categoryFields?: CategoryField[]
): Yup.AnyObjectSchema => {
  const schemaFields: any = {
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title must not exceed 200 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive")
      .typeError("Price must be a valid number"),
    currency: Yup.string().required("Currency is required"),
    categoryId: Yup.string().required("Category is required"),
    images: Yup.array()
      .of(Yup.string())
      .min(1, "At least one image is required")
      .max(5, "Maximum 5 images allowed"),
    address: Yup.string(),
    contactPhone: Yup.string().matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
      "Invalid phone number format"
    ),
    contactEmail: Yup.string()
      .email("Invalid email address")
      .required("Contact email is required"),
    isNegotiable: Yup.boolean(),
    condition: Yup.string().oneOf(Object.values(AdCondition)),
    fieldValues: Yup.array().of(
      Yup.object().shape({
        categoryFieldId: Yup.string().required(),
        value: Yup.string(),
      })
    ),
  };

  // Add dynamic field validations
  if (categoryFields && categoryFields.length > 0) {
    categoryFields.forEach((field) => {
      const fieldKey = `field_${field.id}`;

      if (field.isRequired) {
        // Basic required validation
        let fieldSchema: any = Yup.string().required(
          `${field.label} is required`
        );

        // Apply type-specific validation
        if (field.type === CategoryFieldType.NUMBER) {
          fieldSchema = Yup.number()
            .typeError(`${field.label} must be a number`)
            .required(`${field.label} is required`);
        } else if (field.type === CategoryFieldType.BOOLEAN) {
          fieldSchema = Yup.boolean().required(`${field.label} is required`);
        }

        // Apply custom validation rules from field.validation
        if (field.validation) {
          if (field.validation.min !== undefined) {
            if (field.type === CategoryFieldType.NUMBER) {
              fieldSchema = fieldSchema.min(
                field.validation.min,
                `${field.label} must be at least ${field.validation.min}`
              );
            } else {
              fieldSchema = fieldSchema.min(
                field.validation.min,
                `${field.label} must be at least ${field.validation.min} characters`
              );
            }
          }

          if (field.validation.max !== undefined) {
            if (field.type === CategoryFieldType.NUMBER) {
              fieldSchema = fieldSchema.max(
                field.validation.max,
                `${field.label} must not exceed ${field.validation.max}`
              );
            } else {
              fieldSchema = fieldSchema.max(
                field.validation.max,
                `${field.label} must not exceed ${field.validation.max} characters`
              );
            }
          }

          if (field.validation.pattern) {
            fieldSchema = fieldSchema.matches(
              new RegExp(field.validation.pattern),
              field.validation.message || `${field.label} format is invalid`
            );
          }
        }

        schemaFields[fieldKey] = fieldSchema;
      } else {
        // Optional field validation
        if (field.type === CategoryFieldType.NUMBER) {
          schemaFields[fieldKey] = Yup.number()
            .typeError(`${field.label} must be a number`)
            .nullable()
            .optional();
        }
      }
    });
  }

  return Yup.object().shape(schemaFields);
};

export default function AdForm({
  initialData,
  onSubmit,
  isLoading,
  submitButtonText = "Submit",
}: AdFormProps) {
  const { colors, spacing, radius, icons } = useTheme();
  const { user } = useAuth();
  const { selectedCategory } = useCategorySelection();
  const { selectedCity } = useLocationSelection();

  // Condition selection sheet ref
  const conditionSheetRef = useRef<BottomSheet>(null);
  // Currency selection sheet ref
  const currencySheetRef = useRef<BottomSheet>(null);
  // Rich text editor ref
  const richEditorRef = useRef<RichEditor>(null);

  const [selectModalVisible, setSelectModalVisible] = useState<{
    [key: string]: boolean;
  }>({});

  // Fetch category fields for dynamic form rendering
  const { data: categoryFields, isLoading: loadingFields } = useCategoryFields(
    selectedCategory?.id || initialData?.categoryId || ""
  );

  // Initialize formik with dynamic validation schema
  const formik = useFormik({
    initialValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price?.toString() || "",
      currency: initialData?.currency || "GHS",
      condition: initialData?.condition,
      categoryId: selectedCategory?.id || initialData?.categoryId || "",
      images: initialData?.images || [],
      address:
        initialData?.address ||
        user?.sellerProfile?.verification?.address ||
        "",
      contactPhone: initialData?.contactPhone || user?.phone || "",
      contactEmail: initialData?.contactEmail || user?.email || "",
      isNegotiable: initialData?.isNegotiable || false,
      fieldValues: initialData?.fieldValues || [],
      // Dynamic field values
      ...(categoryFields?.reduce((acc, field) => {
        const existingValue = initialData?.fieldValues?.find(
          (fv) => fv.categoryFieldId === field.id
        );
        acc[`field_${field.id}`] = existingValue?.value || "";
        return acc;
      }, {} as Record<string, string>) || {}),
    },
    validationSchema: buildValidationSchema(categoryFields),
    enableReinitialize: true,
    onSubmit: (values) => {
      // Build fieldValues from dynamic fields
      const fieldValues =
        categoryFields
          ?.map((field) => ({
            categoryFieldId: field.id,
            value:
              (values[`field_${field.id}` as keyof typeof values] as string) ||
              "",
          }))
          .filter((fv) => fv.value.trim() !== "") || [];

      const formData: CreateAdRequest = {
        title: values.title.trim(),
        description: values.description.trim(),
        price: parseFloat(values.price),
        currency: values.currency,
        condition: values.condition,
        categoryId: values.categoryId,
        images: values.images,
        address: values.address?.trim(),
        contactPhone: values.contactPhone?.trim(),
        contactEmail: values.contactEmail.trim(),
        isNegotiable: values.isNegotiable,
        fieldValues,
        cityId: "",
      };

      onSubmit(formData);
    },
  });

  // Update categoryId in formik when selected category changes
  useEffect(() => {
    if (
      selectedCategory?.id &&
      selectedCategory.id !== formik.values.categoryId
    ) {
      formik.setFieldValue("categoryId", selectedCategory.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Handle images uploaded from AdImageUploader
  const handleImagesUploaded = (uploadedUrls: string[]) => {
    formik.setFieldValue("images", uploadedUrls);
  };

  const handleFieldValueChange = (fieldId: string, value: string) => {
    formik.setFieldValue(`field_${fieldId}`, value);
  };

  const renderDynamicField = (field: CategoryField) => {
    const fieldKey = `field_${field.id}`;
    const fieldValue = (formik.values as any)[fieldKey] || "";
    const fieldError =
      (formik.touched as any)[fieldKey] && (formik.errors as any)[fieldKey];

    switch (field.type) {
      case CategoryFieldType.TEXT:
        return (
          <InputField
            key={field.id}
            label={field.label + (field.isRequired ? " *" : "")}
            value={fieldValue}
            onChangeText={(value) => handleFieldValueChange(field.id, value)}
            onBlur={() => formik.setFieldTouched(fieldKey)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            error={fieldError}
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
            onBlur={() => formik.setFieldTouched(fieldKey)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            keyboardType="numeric"
            error={fieldError}
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
            onBlur={() => formik.setFieldTouched(fieldKey)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            numberOfLines={4}
            error={fieldError}
            style={{ marginBottom: spacing.md }}
          />
        );

      case CategoryFieldType.SELECT:
        return (
          <AppView key={field.id} style={{ marginBottom: spacing.lg }}>
            <PlaceholderField
              label={field.label + (field.isRequired ? " *" : "")}
              placeholder={`Select ${field.label.toLowerCase()}`}
              value={
                field.options?.find((opt: any) => opt.value === fieldValue)
                  ?.label || ""
              }
              onPress={() => {
                setSelectModalVisible((prev) => ({
                  ...prev,
                  [field.id]: true,
                }));
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

            <SearchableSelectModal
              key={field.id}
              visible={selectModalVisible[field.id] || false}
              onClose={() =>
                setSelectModalVisible((prev) => ({
                  ...prev,
                  [field.id]: false,
                }))
              }
              options={field.options || []}
              value={fieldValue}
              onSelect={(value) => {
                handleFieldValueChange(field.id, value.toString());
                setSelectModalVisible((prev) => ({
                  ...prev,
                  [field.id]: false,
                }));
              }}
              title={`Select ${field.label.toLowerCase()}`}
            />
          </AppView>
        );
      case CategoryFieldType.RADIO:
        return (
          <View key={field.id} style={{ marginBottom: spacing.md }}>
            <PlaceholderField
              label={field.label + (field.isRequired ? " *" : "")}
              placeholder={`Select ${field.label.toLowerCase()}`}
              value={
                field.options?.find((opt: any) => opt.value === fieldValue)
                  ?.label || ""
              }
              onPress={() => {
                // Open selection sheet for this field
                // You would need to implement a way to open a specific sheet for each field
              }}
              rightIcon={
                <IconButton
                  onPress={() => {
                    // Open selection sheet for this field
                  }}
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
                  <CheckBox
                    key={option.value}
                    label={option.label}
                    value={isChecked}
                    onValueChange={(checked) => {
                      const newValues = checked
                        ? [...checkboxValues, option.value]
                        : checkboxValues.filter(
                            (v: string) => v !== option.value
                          );
                      handleFieldValueChange(field.id, newValues.join(","));
                    }}
                  />
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

  return (
    <>
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
                initialImages={formik.values.images}
                autoUpload={true}
                onImagesUploaded={handleImagesUploaded}
              />
              {formik.touched.images && formik.errors.images && (
                <AppText style={{ color: colors.error, marginTop: spacing.xs }}>
                  {formik.errors.images}
                </AppText>
              )}
            </AppView>

            {/* Category Selection */}
            <AppView style={{ marginBottom: spacing.lg }}>
              <PlaceholderField
                label="Category *"
                placeholder="Select a category"
                value={selectedCategory ? selectedCategory.name : ""}
                onPress={() => {
                  router.push({
                    pathname: "/ads/categories",
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
              {formik.touched.categoryId && formik.errors.categoryId && (
                <AppText style={{ color: colors.error, marginTop: spacing.xs }}>
                  {formik.errors.categoryId}
                </AppText>
              )}
            </AppView>

             {/* City Selection */}
            <AppView style={{ marginBottom: spacing.lg }}>
              <PlaceholderField
                label="City *"
                placeholder="Select a city"
                value={selectedCity ? selectedCity.name : ""}
                onPress={() => {
                  router.push({
                    pathname: "/ads/locations/regions",
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
              {formik.touched.categoryId && formik.errors.categoryId && (
                <AppText style={{ color: colors.error, marginTop: spacing.xs }}>
                  {formik.errors.categoryId}
                </AppText>
              )}
            </AppView>

            {/* Basic Information */}
            <AppView style={{ marginBottom: spacing.lg }}>
              <InputField
                label="Title *"
                value={formik.values.title}
                onChangeText={formik.handleChange("title")}
                onBlur={formik.handleBlur("title")}
                placeholder="Enter ad title"
                error={formik.touched.title && formik.errors.title}
                style={{ marginBottom: spacing.md }}
              />

              <RichTextArea
                ref={richEditorRef}
                label="Description *"
                value={formik.values.description}
                onChange={(text) => formik.setFieldValue("description", text)}
                placeholder="Describe your item in detail"
                style={{ marginBottom: spacing.md }}
              />
              {formik.touched.description && formik.errors.description && (
                <AppText style={{ color: colors.error, marginTop: spacing.xs }}>
                  {formik.errors.description}
                </AppText>
              )}
            </AppView>

            {/* Dynamic Category Fields */}
            {formik.values.categoryId &&
              categoryFields &&
              categoryFields.length > 0 && (
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
                <View style={{ flex: 1 }}>
                  <PlaceholderField
                    label="Currency"
                    value={formik.values.currency}
                    placeholder="GHS"
                    onPress={() => {
                      currencySheetRef.current?.expand();
                    }}
                  />
                </View>
                <View style={{ flex: 4 }}>
                  <InputField
                    label="Price *"
                    value={formik.values.price}
                    onChangeText={formik.handleChange("price")}
                    onBlur={formik.handleBlur("price")}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    error={formik.touched.price && formik.errors.price}
                  />
                </View>
              </View>

              <ToggleSwitch
                label="Negotiable Price"
                description="Allow buyers to negotiate the price"
                value={formik.values.isNegotiable}
                onValueChange={(value) =>
                  formik.setFieldValue("isNegotiable", value)
                }
              />
            </AppView>

            {/* Condition */}
            <AppView style={{ marginBottom: spacing.lg }}>
              <PlaceholderField
                label="Condition"
                placeholder="Select condition"
                value={
                  formik.values.condition
                    ? conditionOptions.find(
                        (opt) => opt.value === formik.values.condition
                      )?.name
                    : ""
                }
                onPress={() => {
                  conditionSheetRef.current?.expand();
                }}
                rightIcon={
                  <IconButton
                    onPress={() => {
                      conditionSheetRef.current?.expand();
                    }}
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
              {formik.touched.condition && formik.errors.condition && (
                <AppText style={{ color: colors.error, marginTop: spacing.xs }}>
                  {formik.errors.condition}
                </AppText>
              )}
            </AppView>

            {/* Contact Information */}
            <AppView style={{ marginBottom: spacing.lg }}>
              <AppText variant="lg" style={{ marginBottom: spacing.md }}>
                Contact Information
              </AppText>

              <InputField
                label="Address"
                value={formik.values.address}
                onChangeText={formik.handleChange("address")}
                onBlur={formik.handleBlur("address")}
                placeholder="Enter location"
                error={formik.touched.address && formik.errors.address}
                style={{ marginBottom: spacing.md }}
              />

              <InputField
                label="Contact Phone"
                value={formik.values.contactPhone}
                onChangeText={formik.handleChange("contactPhone")}
                onBlur={formik.handleBlur("contactPhone")}
                placeholder="+1234567890"
                keyboardType="phone-pad"
                error={
                  formik.touched.contactPhone && formik.errors.contactPhone
                }
                style={{ marginBottom: spacing.md }}
              />

              <InputField
                label="Contact Email"
                value={formik.values.contactEmail}
                onChangeText={formik.handleChange("contactEmail")}
                onBlur={formik.handleBlur("contactEmail")}
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={
                  formik.touched.contactEmail && formik.errors.contactEmail
                }
              />
            </AppView>

            {/* Submit Button */}
            <PrimaryButton
              title={submitButtonText}
              onPress={() => formik.handleSubmit()}
              loading={isLoading}
              disabled={isLoading || !formik.isValid}
              style={{ marginBottom: spacing.xl }}
            />
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
      {/*Bottom Sheets */}
      <SelectableListSheet
        ref={conditionSheetRef}
        title="Condition"
        snapPoints={["50%"]}
        data={conditionOptions}
        onDone={() => {
          conditionSheetRef.current?.close();
        }}
        renderItem={({ item, index }) => (
          <SheetRadioOptionItem
            item={item}
            selected={formik.values.condition === item.value}
            onPress={() => {
              formik.setFieldValue("condition", item.value);
              conditionSheetRef.current?.close();
            }}
          />
        )}
      />

      <SelectableListSheet
        ref={currencySheetRef}
        title="Currency"
        snapPoints={["30%"]}
        data={currencyOptions}
        onDone={() => {
          currencySheetRef.current?.close();
        }}
        renderItem={({ item, index }) => (
          <SheetRadioOptionItem
            item={item}
            selected={formik.values.currency === item.value}
            onPress={() => {
              formik.setFieldValue("currency", item.value);
              currencySheetRef.current?.close();
            }}
          />
        )}
      />
    </>
  );
}
