import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo, useState } from "react";
import * as Yup from "yup";

import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/hooks/useUser";
import { Feather } from "@expo/vector-icons";
import { useFormik } from "formik";
import { Keyboard, TouchableOpacity } from "react-native";
import { toast } from "sonner-native";
import AppText from "../ui/AppText";
import CountryCodePicker from "../ui/CountryCodePicker";
import InputField from "../ui/InputField";
import OTPInput from "../ui/OTPInput";
import PrimaryButton from "../ui/PrimaryButton";

const requestSchema = Yup.object().shape({
  phone: Yup.string().required("Phone number is required"),
  currentPassword: Yup.string().required("Current password is required"),
});

const verifySchema = Yup.object().shape({
  otp: Yup.string().required("OTP is required"),
});

export interface ChangePhoneNumberSheetProps {
  close?: () => void;
}

export const ChangePhoneNumberSheet = forwardRef<
  BottomSheet,
  ChangePhoneNumberSheetProps
>((props, ref) => {
  const { spacing, colors, icons } = useTheme();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [newPhone, setNewPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+233");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const {
    requestPhoneChangeAsync,
    isRequestingPhoneChange,
    verifyPhoneChangeAsync,
    isVerifyingPhoneChange,
  } = useUser();

  const snapPoints = useMemo(() => ["75%"], []);

  const handleVerifyPhoneChange = async (otp: string) => {
    try {
      await verifyPhoneChangeAsync(otp);
      toast.success("Phone number changed successfully");
      // Close the sheet
      if (ref && "current" in ref && ref.current) {
        ref.current.close();
      }
      // Reset form
      setStep("request");
      requestFormik.resetForm();
      verifyFormik.resetForm();
    } catch (error: any) {
      console.log("Verify phone change error:", error.response);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to verify phone number"
      );
    }
  };

  const requestFormik = useFormik({
    initialValues: { phone: "", currentPassword: "" },
    validationSchema: requestSchema,
    onSubmit: async (values) => {
      try {
        // Remove leading zero from phone number if present
        const cleanPhone = values.phone.startsWith("0")
          ? values.phone.substring(1)
          : values.phone;
        const fullPhone = `${countryCode}${cleanPhone}`;
        await requestPhoneChangeAsync({
          newPhone: fullPhone,
          currentPassword: values.currentPassword,
        });
        setNewPhone(fullPhone);
        setStep("verify");
        toast.success("OTP sent to your new phone number");
      } catch (error: any) {
        console.log("Request phone change error:", error.response);
        toast.error(
          error.response?.data?.message || error.message || "Failed to send OTP"
        );
      }
    },
  });

  const verifyFormik = useFormik({
    initialValues: { otp: "" },
    validationSchema: verifySchema,
    onSubmit: async (values) => {
      await handleVerifyPhoneChange(values.otp);
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
          {step === "request" ? "Change Phone Number" : "Verify New Phone"}
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
          {step === "request"
            ? "Enter your new phone number and current password"
            : `Enter the OTP sent to ${newPhone}`}
        </AppText>

        {step === "request" ? (
          <>
            {/* Phone Number Input */}
            <InputField
              placeholder="Enter phone number"
              value={requestFormik.values.phone}
              onChangeText={requestFormik.handleChange("phone")}
              keyboardType="phone-pad"
              onBlur={requestFormik.handleBlur("phone")}
              error={
                requestFormik.touched.phone && requestFormik.errors.phone
                  ? requestFormik.errors.phone
                  : undefined
              }
              leftIcon={
                <CountryCodePicker
                  code={countryCode}
                  flag="🇬🇭"
                  onPress={() => {}}
                />
              }
            />

            {/* Current Password Input */}
            <InputField
              leftIcon={
                <Feather name="lock" color={colors.primary} size={icons.md} />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Feather
                    name={showCurrentPassword ? "eye-off" : "eye"}
                    color={colors.text}
                    size={icons.md}
                  />
                </TouchableOpacity>
              }
              value={requestFormik.values.currentPassword}
              label="Current Password"
              placeholder="Enter your current password"
              onChangeText={requestFormik.handleChange("currentPassword")}
              onBlur={requestFormik.handleBlur("currentPassword")}
              error={
                requestFormik.touched.currentPassword &&
                requestFormik.errors.currentPassword
                  ? requestFormik.errors.currentPassword
                  : undefined
              }
              secure={!showCurrentPassword}
            />

            {/* Button */}
            <PrimaryButton
              style={{ marginTop: spacing.lg }}
              title="Send OTP"
              onPress={requestFormik.handleSubmit}
              loading={isRequestingPhoneChange}
            />
          </>
        ) : (
          <>
            {/* OTP Input */}
            <OTPInput
              value={verifyFormik.values.otp}
              onChange={(otp) => verifyFormik.setFieldValue("otp", otp)}
              error={!!(verifyFormik.touched.otp && verifyFormik.errors.otp)}
              onComplete={async (otp) => {
                console.log("OTP completed:", otp);
                await verifyFormik.setFieldValue("otp", otp);
                await handleVerifyPhoneChange(otp);
              }}
            />

            {verifyFormik.touched.otp && verifyFormik.errors.otp && (
              <AppText
                variant="sm"
                style={{
                  color: colors.error,
                  textAlign: "center",
                  marginTop: spacing.xs,
                }}
              >
                {verifyFormik.errors.otp}
              </AppText>
            )}

            {/* Buttons */}
            <PrimaryButton
              style={{ marginTop: spacing.lg }}
              title="Verify & Change Phone"
              onPress={verifyFormik.handleSubmit}
              loading={isVerifyingPhoneChange}
            />

            <PrimaryButton
              style={{ marginTop: spacing.md }}
              title="Back"
              onPress={() => {
                setStep("request");
                verifyFormik.resetForm();
              }}
            />
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

ChangePhoneNumberSheet.displayName = "ChangePhoneNumberSheet";
