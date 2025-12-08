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

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgotPasswordScreen() {
  const { spacing, colors, radius, icons } = useTheme();
  const [emailSent, setEmailSent] = useState(false);
  
  const { forgotPasswordAsync, isSendingPasswordReset } = useAuth();

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      await forgotPasswordAsync(values.email);
      setEmailSent(true);
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      toast.error(error?.message || "Failed to send reset email. Please try again.");
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
                    : "Enter your email to receive a reset link"
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
              <View style={[styles.section, { gap: spacing.md, marginTop: spacing.lg }]}>
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
                    We've sent a password reset link to your email. Please check
                    your inbox and follow the instructions.
                  </AppText>
                </View>

                <PrimaryButton
                  title="Back to Login"
                  onPress={() => router.replace("/login")}
                />

                <View style={{ alignItems: "center", marginTop: spacing.md }}>
                  <SecondaryTextButton
                    title="Didn't receive the email?"
                    onPress={() => setEmailSent(false)}
                  />
                </View>
              </View>
            ) : (
              <Formik
                initialValues={{ email: "" }}
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
                    {/* Email Input */}
                    <InputField
                      label="Email"
                      placeholder="Enter your email"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      keyboardType="email-address"
                      error={
                        touched.email && errors.email ? errors.email : undefined
                      }
                      leftIcon={
                        <Feather
                          name="mail"
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
                          isSendingPasswordReset
                            ? "Sending..."
                            : "Send Reset Link"
                        }
                        onPress={handleSubmit}
                        disabled={isSendingPasswordReset}
                        loading={isSendingPasswordReset}
                      />
                    </View>

                    {/* Back to Login */}
                    <View style={{ alignItems: "center", marginTop: spacing.md }}>
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
