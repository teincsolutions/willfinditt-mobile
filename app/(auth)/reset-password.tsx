// screens/ResetPasswordScreen.tsx

import Feather from "@expo/vector-icons/Feather";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { toast } from "sonner-native";
import * as Yup from "yup";

import HeaderBackground from "@/components/auth/HeaderBackground";
import ScreenWrapper from "@/components/auth/ScreenWrapper";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";

const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function ResetPasswordScreen() {
  const { spacing, colors, radius, icons } = useTheme();
  const params = useLocalSearchParams<{
    token?: string;
    phone?: string;
    otp?: string;
  }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    resetPasswordAsync,
    isResettingPassword,
    resetPasswordWithPhoneAsync,
    isResettingPasswordWithPhone,
  } = useAuth();

  const handleResetPassword = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      // Check if this is a phone-based reset
      if (params.phone && params.otp) {
        await resetPasswordWithPhoneAsync({
          phone: params.phone,
          otp: params.otp,
          newPassword: values.newPassword,
        });
        toast.success("Password reset successful! Please login.");
        router.replace("/login");
      } else if (params.token) {
        // Email-based reset with token
        await resetPasswordAsync({
          token: params.token,
          newPassword: values.newPassword,
        });
        toast.success("Password reset successful! Please login.");
        router.replace("/login");
      } else {
        toast.error("Invalid reset request. Please try again.");
      }
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to reset password. Please try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScreenWrapper
        style={{
          borderRadius: radius.xxl,
          marginTop: -spacing.lg,
          zIndex: 1000,
        }}
      >
        <Stack.Screen
          options={{
             headerShown:true,
            header: () => (
              <HeaderBackground
                title="Reset Password"
                subtitle="Enter your new password"
              />
            ),
          }}
        />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}
          >
            <Formik
              initialValues={{ newPassword: "", confirmPassword: "" }}
              validationSchema={ResetPasswordSchema}
              onSubmit={handleResetPassword}
            >
              {({ values, handleChange, handleSubmit, errors, touched }) => (
                <View
                  style={[
                    styles.section,
                    { gap: spacing.md, marginTop: spacing.lg },
                  ]}
                >
                  {/* New Password Input */}
                  <InputField
                    label="New Password"
                    placeholder="Enter new password"
                    value={values.newPassword}
                    onChangeText={handleChange("newPassword")}
                    secure={!showPassword}
                    error={
                      touched.newPassword && errors.newPassword
                        ? errors.newPassword
                        : undefined
                    }
                    rightIcon={
                      <Pressable onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                          <Feather
                            name="eye"
                            color={colors.primary}
                            size={icons.md}
                          />
                        ) : (
                          <Feather
                            name="eye-off"
                            color={colors.primary}
                            size={icons.md}
                          />
                        )}
                      </Pressable>
                    }
                    leftIcon={
                      <Feather
                        name="lock"
                        color={colors.primary}
                        size={icons.md}
                      />
                    }
                    inputStyle={{ borderRadius: radius.xxl }}
                  />

                  {/* Confirm Password Input */}
                  <InputField
                    label="Confirm Password"
                    placeholder="Re-enter new password"
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    secure={!showConfirmPassword}
                    error={
                      touched.confirmPassword && errors.confirmPassword
                        ? errors.confirmPassword
                        : undefined
                    }
                    rightIcon={
                      <Pressable
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <Feather
                            name="eye"
                            color={colors.primary}
                            size={icons.md}
                          />
                        ) : (
                          <Feather
                            name="eye-off"
                            color={colors.primary}
                            size={icons.md}
                          />
                        )}
                      </Pressable>
                    }
                    leftIcon={
                      <Feather
                        name="lock"
                        color={colors.primary}
                        size={icons.md}
                      />
                    }
                    inputStyle={{ borderRadius: radius.xxl }}
                  />

                  {/* Submit Button */}
                  <View style={{ marginTop: spacing.lg }}>
                    <PrimaryButton
                      title={
                        isResettingPassword || isResettingPasswordWithPhone
                          ? "Resetting..."
                          : "Reset Password"
                      }
                      onPress={handleSubmit}
                      disabled={
                        isResettingPassword || isResettingPasswordWithPhone
                      }
                      loading={
                        isResettingPassword || isResettingPasswordWithPhone
                      }
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
  },
});
