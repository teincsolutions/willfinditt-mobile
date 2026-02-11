import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import { toast } from "sonner-native";
import * as Yup from "yup";

import { useTheme } from "@/contexts/ThemeContext";
import { ReportCategory } from "@/types/enums";
import { Feather } from "@expo/vector-icons";
import { useFormik } from "formik";
import { Keyboard, KeyboardAvoidingView, View } from "react-native";
import AppText from "../ui/AppText";
import PrimaryButton from "../ui/PrimaryButton";
import RadioInput from "../ui/RadioInput";
import TextAreaField from "../ui/TextAreaField";

export interface ReportSheetProps {
  title: string;
  onReport: (values: {
    category: ReportCategory;
    description?: string;
  }) => Promise<void>;
  isReporting: boolean;
  close?: () => void;
}

const ReportSchema = Yup.object().shape({
  category: Yup.string().required("Please select a reason for reporting"),
  description: Yup.string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
});

export const ReportSheet = forwardRef<BottomSheet, ReportSheetProps>(
  (props, ref) => {
    const { spacing, colors, icons } = useTheme();

    const snapPoints = useMemo(() => ["60%"], []);

    const categories = [
      { label: "Inappropriate Content", value: ReportCategory.INAPPROPRIATE },
      { label: "Spam", value: ReportCategory.SPAM },
      { label: "Harassment", value: ReportCategory.HARASSMENT },
      { label: "Other", value: ReportCategory.OTHER },
    ];

    const formik = useFormik({
      initialValues: { category: "" as ReportCategory, description: "" },
      validationSchema: ReportSchema,
      onSubmit: async (values) => {
        try {
          await props.onReport({
            category: values.category,
            description: values.description || undefined,
          });

          // Reset form
          formik.resetForm();
          // Close the sheet on success
          if (props.close) {
            props.close();
          }
        } catch (error: any) {
          console.error("Failed to submit report:", error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to submit report. Please try again.";
          toast.error(errorMessage);
        }
      },
    });

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
        onClose={() => Keyboard.dismiss()}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
          />
        )}
        backgroundStyle={{
          backgroundColor: colors.background,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        }}
      >
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={120}>
          <BottomSheetScrollView
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            }}
            contentContainerStyle={{
              gap: spacing.md,
              paddingBottom: spacing.xl,
            }}
          >
            {/* Title */}
            <AppText
              variant="xl"
              fontWeight="bold"
              style={{ textAlign: "center", marginBottom: spacing.sm }}
            >
              {props.title}
            </AppText>

            <AppText
              variant="md"
              style={{
                textAlign: "center",
                opacity: 0.7,
                marginBottom: spacing.md,
              }}
            >
              Please select the reason for reporting this content.
            </AppText>

            {/* Categories */}
            <View style={{ gap: spacing.sm }}>
              {categories.map((cat) => (
                <RadioInput
                  key={cat.value}
                  label={cat.label}
                  value={formik.values.category === cat.value}
                  onValueChange={() =>
                    formik.setFieldValue("category", cat.value)
                  }
                />
              ))}
              {formik.touched.category && formik.errors.category && (
                <AppText
                  variant="sm"
                  style={{ color: colors.error, marginLeft: spacing.sm }}
                >
                  {formik.errors.category}
                </AppText>
              )}
            </View>

            {/* Description Input */}
            <TextAreaField
              leftIcon={
                <Feather
                  name="edit-3"
                  color={colors.iconGray}
                  size={icons.md}
                />
              }
              value={formik.values.description}
              label="Details (Optional)"
              placeholder="Provide more information about your report..."
              onChangeText={formik.handleChange("description")}
              onBlur={formik.handleBlur("description")}
              error={
                formik.touched.description && formik.errors.description
                  ? formik.errors.description
                  : undefined
              }
            />

            {/* Submit Button */}
            <PrimaryButton
              style={{ marginTop: spacing.lg }}
              title="Submit Report"
              onPress={formik.handleSubmit}
              loading={props.isReporting}
            />
          </BottomSheetScrollView>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  },
);

ReportSheet.displayName = "ReportSheet";
