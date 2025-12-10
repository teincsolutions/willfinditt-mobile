// screens/ForgotPasswordScreen.tsx

import Feather from "@expo/vector-icons/Feather";
import { router, Stack } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { toast } from "sonner-native";
import * as Yup from "yup";

import HeaderBackground from "@/components/auth/HeaderBackground";
import ScreenWrapper from "@/components/auth/ScreenWrapper";
import AppText from "@/components/ui/AppText";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryTextButton from "@/components/ui/SecondaryTextButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { formatPhoneNumber } from "@/lib/formatPhoneNumber";

const ForgotPasswordSchema = Yup.object().shape({
  indentifier: Yup.string()
    .required("Email or phone number is required")
    .test("email-or-phone", "Invalid email or phone number", function (value) {
      if (!value) return false;
      // Check if it's a phone number (starts with digit or +)
      const isPhone = /^[0-9+]/.test(value);
      if (isPhone) {
        // Validate Ghana phone format (9 or 10 digits)
        const cleaned = value.replace(/\D/g, "");
        const withoutLeadingZero = cleaned.startsWith("0")
          ? cleaned.substring(1)
          : cleaned;
        return withoutLeadingZero.length === 9;
      }
      // Validate as email
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }),
});

export default function ForgotPasswordScreen() {
  const { spacing, colors, radius, icons } = useTheme();
  const [emailSent, setEmailSent] = useState(false);

  const { forgotPasswordAsync, isSendingPasswordReset } = useAuth();

  const handleForgotPassword = async (values: { indentifier: string }) => {
    try {
      // Determine if input is email or phone
      const indentifier = values.indentifier.trim();
      const isPhone = /^[0-9+]/.test(indentifier);

      // Format the identifier and prepare request data
      const requestData = isPhone
        ? { phone: formatPhoneNumber(indentifier) }
        : { email: indentifier.toLowerCase() };

      const res = await forgotPasswordAsync(requestData);
      console.log("Forgot password response:", res);

      // If phone, redirect to OTP verification
      if (isPhone) {
        toast.success("OTP sent to your phone");
        router.push({
          pathname: "/verify-otp",
          params: {
            type: "password-reset",
            phone: requestData.phone,
          },
        });
      } else {
        // For email, show success message
        setEmailSent(true);
        toast.success("Password reset link sent to your email");
      }
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to send reset link. Please try again."
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
            header: () => (
              <HeaderBackground
                title="Forgot Password?"
                subtitle={
                  emailSent
                    ? "Check your email for reset instructions"
                    : "Enter your email or phone number to reset your password"
                }
              />
            ),
          }}
        />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}
          >
            {emailSent ? (
              <View
                style={[
                  styles.section,
                  { gap: spacing.md, marginTop: spacing.lg },
                ]}
              >
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: spacing.xl,
                  }}
                >
                  <Feather
                    name="mail"
                    size={64}
                    color={colors.primary}
                    style={{ marginBottom: spacing.lg }}
                  />
                  <AppText
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: colors.text,
                      textAlign: "center",
                      marginBottom: spacing.sm,
                    }}
                  >
                    Email Sent Successfully!
                  </AppText>
                  <AppText
                    style={{
                      fontSize: 14,
                      color: colors.textGray,
                      textAlign: "center",
                      paddingHorizontal: spacing.md,
                    }}
                  >
                    We&apos;ve sent a password reset link to your email. Please
                    check your inbox and follow the instructions.
                  </AppText>
                </View>

                <PrimaryButton
                  title="Back to Login"
                  onPress={() => router.replace("/login")}
                />

                <View style={{ alignItems: "center", marginTop: spacing.md }}>
                  <SecondaryTextButton
                    title="Didn't receive the reset link?"
                    onPress={() => setEmailSent(false)}
                  />
                </View>
              </View>
            ) : (
              <Formik
                initialValues={{ indentifier: "" }}
                validationSchema={ForgotPasswordSchema}
                onSubmit={handleForgotPassword}
              >
                {({ values, handleChange, handleSubmit, errors, touched }) => (
                  <View
                    style={[
                      styles.section,
                      { gap: spacing.md, marginTop: spacing.lg },
                    ]}
                  >
                    {/* Email or Phone Input */}
                    <InputField
                      label="Email or Phone"
                      placeholder="Enter your email or phone number"
                      value={values.indentifier}
                      onChangeText={handleChange("indentifier")}
                      keyboardType="email-address"
                      error={
                        touched.indentifier && errors.indentifier
                          ? errors.indentifier
                          : undefined
                      }
                      leftIcon={
                        <Feather
                          name="user"
                          color={colors.primary}
                          size={icons.md}
                        />
                      }
                      inputStyle={{ borderRadius: radius.xxl }}
                    />

                    {/* Submit Button */}
                    <View style={{ marginTop: spacing.lg }}>
                      <PrimaryButton
                        title="Submit"
                        onPress={handleSubmit}
                        disabled={isSendingPasswordReset}
                        loading={isSendingPasswordReset}
                      />
                    </View>

                    {/* Back to Login */}
                    <View
                      style={{ alignItems: "center", marginTop: spacing.md }}
                    >
                      <SecondaryTextButton
                        title="Back to Login"
                        onPress={() => router.replace("/login")}
                      />
                    </View>
                  </View>
                )}
              </Formik>
            )}
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
