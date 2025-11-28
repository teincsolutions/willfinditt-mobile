import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import * as Yup from "yup";

import { useTheme } from "@/contexts/ThemeContext";
import { useFormik } from "formik";
import AppText from "../ui/AppText";
import CountryCodePicker from "../ui/CountryCodePicker";
import InputField from "../ui/InputField";
import PrimaryButton from "../ui/PrimaryButton";

export interface ChangePhoneNumberSheetProps {
  close?: () => void;
}

const PhoneNumberSchema = Yup.object().shape({
  phone: Yup.string().required("PhoneNumber is required"),
});

export const ChangePhoneNumberSheet = forwardRef<
  BottomSheet,
  ChangePhoneNumberSheetProps
>((props, ref) => {
  const { spacing, colors } = useTheme();

  const snapPoints = useMemo(() => ["50%"], []);

  const formik = useFormik({
    initialValues: { phone: "" },
    validationSchema: PhoneNumberSchema,
    onSubmit: (values) => {
      // Handle phone number change logic here
      console.log("New PhoneNumber:", values.phone);
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
          Change PhoneNumber
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
          Type in the new Phone number
        </AppText>

        {/* PhoneNumber Input */}
        <InputField
          placeholder="Enter phone number"
          value={formik.values.phone}
          onChangeText={formik.handleChange("phone")}
          keyboardType="phone-pad"
          onBlur={formik.handleBlur("phone")}
          error={
            formik.touched.phone && formik.errors.phone
              ? formik.errors.phone
              : undefined
          }
          leftIcon={
            <CountryCodePicker code="+233" flag="🇬🇭" onPress={() => {}} />
          }
        />

        {/* Button */}
        <PrimaryButton
          title="Save"
          onPress={formik.handleSubmit}
          loading={formik.isSubmitting}
        />
      </BottomSheetView>
    </BottomSheet>
  );
});

ChangePhoneNumberSheet.displayName = "ChangePhoneNumberSheet";
