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
import InputField from "../ui/InputField";
import PrimaryButton from "../ui/PrimaryButton";
import { TextButton } from "../ui/TextButton";

export interface ChangeEmailSheetProps {
  close?: () => void;
}

const EmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const ChangeEmailSheet = forwardRef<BottomSheet, ChangeEmailSheetProps>(
  (props, ref) => {
    const { spacing, colors, icons } = useTheme();
    const [step, setStep] = useState<"request" | "verify">("request");
    const [newEmail, setNewEmail] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    const {
      requestEmailChangeAsync,
      isRequestingEmailChange,
    } = useUser();

    const snapPoints = useMemo(() => ["75%"], []);
    const requestSchema = Yup.object().shape({
      newEmail: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
      currentPassword: Yup.string().required("Current password is required"),
    });

    const requestFormik = useFormik({
      initialValues: { newEmail: "", currentPassword: "" },
      validationSchema: requestSchema,
      onSubmit: async (values) => {
        try {
          await requestEmailChangeAsync({
            newEmail: values.newEmail,
            currentPassword: values.currentPassword,
          });
          setNewEmail(values.newEmail);
          setStep("verify");
          toast.success("Verification code sent to your new email");
        } catch (error: any) {
          const message =
            error?.response?.data?.message || "Failed to request email change";
          toast.error(message);
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
            {step === "request" ? "Change Email" : "Check Your Email"}
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
              ? "Enter your new email address and current password"
              : `Check your email at ${newEmail} and click the verification link`}
          </AppText>

          {step === "request" ? (
            <>
              {/* New Email Input */}
              <InputField
                leftIcon={
                  <Feather name="mail" color={colors.primary} size={icons.md} />
                }
                value={requestFormik.values.newEmail}
                label="New Email Address"
                placeholder="Enter your new email"
                onChangeText={requestFormik.handleChange("newEmail")}
                onBlur={requestFormik.handleBlur("newEmail")}
                error={
                  requestFormik.touched.newEmail &&
                  requestFormik.errors.newEmail
                    ? requestFormik.errors.newEmail
                    : undefined
                }
                keyboardType="email-address"
                autoCapitalize="none"
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
                title="Send Verification Code"
                onPress={requestFormik.handleSubmit}
                loading={isRequestingEmailChange}
              />
            </>
          ) : (
            <>
              {/* Verification Message */}
              <AppText
                variant="md"
                style={{
                  textAlign: "center",
                  marginBottom: spacing.lg,
                  lineHeight: 24,
                }}
              >
                We've sent a verification link to{" "}
                <AppText variant="md" style={{ fontWeight: "600", color: colors.primary }}>
                  {newEmail}
                </AppText>
                . Please check your email and click the verification link to complete the email change.
              </AppText>

              {/* Resend Button */}
              <PrimaryButton
                style={{ marginTop: spacing.lg }}
                title="Resend Verification Email"
                onPress={requestFormik.handleSubmit}
                loading={isRequestingEmailChange}
              />

              <TextButton
                style={{
                  marginTop: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  minWidth: 300
                }}
                title="Back"
                onPress={() => {
                  setStep("request");
                }}
              />
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

ChangeEmailSheet.displayName = "ChangeEmailSheet";
