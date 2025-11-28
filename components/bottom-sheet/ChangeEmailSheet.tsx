import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import * as Yup from "yup";

import { useTheme } from "@/contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { useFormik } from "formik";
import AppText from "../ui/AppText";
import InputField from "../ui/InputField";
import PrimaryButton from "../ui/PrimaryButton";

export interface ChangeEmailSheetProps {
  close?: () => void;
}

const EmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const ChangeEmailSheet = forwardRef<BottomSheet, ChangeEmailSheetProps>(
  (props, ref) => {
    const { spacing, colors, icons } = useTheme();

    const snapPoints = useMemo(() => ["50%"], []);

    const formik = useFormik({
      initialValues: { email: "" },
      validationSchema: EmailSchema,
      onSubmit: (values) => {
        // Handle email change logic here
        console.log("New Email:", values.email);
      },
    });

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
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
        <BottomSheetView
          style={{
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            gap: spacing.md,
          }}
        >
          {/* Title */}
          <AppText
            variant="xl"
            style={{ textAlign: "center", marginBottom: spacing.sm }}
          >
            Change Email
          </AppText>

          {/* Subtitle */}
          <AppText
            variant="md"
            style={{
              textAlign: "center",
              opacity: 0.7,
              marginBottom: spacing.lg,
            }}
          >
            Type in the new Email Address
          </AppText>

          {/* Email Input */}
          <InputField
            leftIcon={
              <Feather name="mail" color={colors.primary} size={icons.md} />
            }
            value={formik.values.email}
            label="Email Address"
            placeholder="Enter your new email"
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            error={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : undefined
            }
          />

          {/* Button */}
          <PrimaryButton
            style={{ marginTop: spacing.lg }}
            title="Save"
            onPress={formik.handleSubmit}
            loading={formik.isSubmitting}
          />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

ChangeEmailSheet.displayName = "ChangeEmailSheet";
