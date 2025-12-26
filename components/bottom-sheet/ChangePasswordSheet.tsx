import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo, useState } from "react";
import * as Yup from "yup";

import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { useFormik } from "formik";
import { Keyboard, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { toast } from "sonner-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import InputField from "../ui/InputField";
import PrimaryButton from "../ui/PrimaryButton";

export interface ChangePasswordSheetProps {
  close?: () => void;
}

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

export const ChangePasswordSheet = forwardRef<
  BottomSheet,
  ChangePasswordSheetProps
>((props, ref) => {
  const { spacing, colors, icons } = useTheme();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { changePasswordAsync, isChangingPassword } = useAuth();

  const snapPoints = useMemo(() => ["75%", "90%"], []);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: PasswordSchema,
    onSubmit: async (values) => {
      try {
        await changePasswordAsync({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        toast.success("Password changed successfully");
        // Close the sheet
        if (ref && 'current' in ref && ref.current) {
          ref.current.close();
        }
        formik.resetForm();
      } catch (error: any) {
        const message = error?.response?.data?.message || "Failed to change password";
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
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      )}
      onClose={() => Keyboard.dismiss()}
      backgroundStyle={{
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
      }}
    >
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <BottomSheetView
          style={{
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            gap: spacing.md,
          }}
        >
          <AppView style={{ gap: spacing.md }}>
            {/* Title */}
            <AppText
              variant="xl"
              style={{ textAlign: "center", marginBottom: spacing.sm }}
            >
              Change Password
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
              Enter your current password and choose a new one
            </AppText>

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
              value={formik.values.currentPassword}
              label="Current Password"
              placeholder="Enter your current password"
              secure={!showCurrentPassword}
              onChangeText={formik.handleChange("currentPassword")}
              onBlur={formik.handleBlur("currentPassword")}
              error={
                formik.touched.currentPassword && formik.errors.currentPassword
                  ? formik.errors.currentPassword
                  : undefined
              }
            />

            {/* New Password Input */}
            <InputField
              leftIcon={
                <Feather name="lock" color={colors.primary} size={icons.md} />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Feather
                    name={showNewPassword ? "eye-off" : "eye"}
                    color={colors.text}
                    size={icons.md}
                  />
                </TouchableOpacity>
              }
              value={formik.values.newPassword}
              label="New Password"
              placeholder="Enter your new password"
              secure={!showNewPassword}
              onChangeText={formik.handleChange("newPassword")}
              onBlur={formik.handleBlur("newPassword")}
              error={
                formik.touched.newPassword && formik.errors.newPassword
                  ? formik.errors.newPassword
                  : undefined
              }
            />

            {/* Confirm Password Input */}
            <InputField
              leftIcon={
                <Feather name="lock" color={colors.primary} size={icons.md} />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Feather
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    color={colors.text}
                    size={icons.md}
                  />
                </TouchableOpacity>
              }
              value={formik.values.confirmPassword}
              label="Confirm New Password"
              placeholder="Confirm your new password"
              secure={!showConfirmPassword}
              onChangeText={formik.handleChange("confirmPassword")}
              onBlur={formik.handleBlur("confirmPassword")}
              error={
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? formik.errors.confirmPassword
                  : undefined
              }
            />
          </AppView>

          {/* Button */}
          <PrimaryButton
            style={{ marginTop: spacing.lg }}
            title="Save"
            onPress={formik.handleSubmit}
            loading={isChangingPassword}
          />
        </BottomSheetView>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
});

ChangePasswordSheet.displayName = "ChangePasswordSheet";
