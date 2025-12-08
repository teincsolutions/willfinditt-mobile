// screens/LoginScreen.tsx

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { toast } from "sonner-native";

import * as Yup from "yup";

import AuthTabSwitcher from "@/components/auth/AuthTabSwitcher";
import HeaderBackground from "@/components/auth/HeaderBackground";
import ScreenWrapper from "@/components/auth/ScreenWrapper";
import SocialLogins from "@/components/auth/SocialLogins";
import FormDividerText from "@/components/ui/FormDividerText";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryTextButton from "@/components/ui/SecondaryTextButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { formatPhoneNumber } from "@/lib/formatPhoneNumber";
import Feather from "@expo/vector-icons/Feather";
import { router, Stack } from "expo-router";

export default function AuthScreen() {
  const { spacing, colors, radius, icons } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const {
    loginAsync,
    isLoggingIn,
    loginError,
    socialAuthAsync,
    isSocialAuthLoading,
    requires2FA,
    twoFAUserId,
  } = useAuth();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      // Determine if input is email or phone
      const loginId = values.email.trim();
      const isPhone = /^[0-9+]/.test(loginId);

      // Prepare login data
      const loginData = {
        email: isPhone ? undefined : loginId,
        phone: isPhone ? formatPhoneNumber(loginId) : undefined,
        password: values.password,
      };

      const result = await loginAsync(loginData);

      // Check if 2FA is required
      if (requires2FA && twoFAUserId) {
        router.push({
          pathname: "/verify-otp",
          params: { userId: twoFAUserId, type: "2fa" },
        });
        return;
      }

      // Navigate to the main tabs
      router.replace("/(drawers)");
    } catch (error: any) {
      toast.error(
        error?.message ||
          loginError?.message ||
          "Login failed. Please check your credentials and try again."
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Check Play Services availability
      await GoogleSignin.hasPlayServices();

      // Clear any cached tokens
      const currentUser = GoogleSignin.getCurrentUser();
      if (currentUser?.idToken) {
        await GoogleSignin.clearCachedAccessToken(currentUser.idToken);
      }
      await GoogleSignin.signOut();

      // Start sign-in flow
      const signInResponse = await GoogleSignin.signIn();

      if (signInResponse.type === "success") {
        // Prepare social auth data
        const socialAuthData = {
          provider: "GOOGLE" as const,
          accessToken: signInResponse.data.idToken,
        };

        // Send to backend API
        await socialAuthAsync(socialAuthData);

        toast.success("Google Sign-In Successful!");

        // Check if 2FA is required
        if (requires2FA && twoFAUserId) {
          router.push({
            pathname: "/verify-otp",
            params: { userId: twoFAUserId, type: "2fa" },
          });
          return;
        }

        // Navigate to main screen
        router.replace("/(drawers)");
      } else if (signInResponse.type === "cancelled") {
        // User cancelled, no error needed
        console.log("Google sign-in cancelled");
      }
    } catch (error: any) {
      console.log("Google sign-in error:", error.message);
      toast.error(error?.message || "Google login failed. Please try again.");
    }
  };

  const window = useWindowDimensions();
  const isSmallScreen = window.height - 300 < 750;
  const Container = isSmallScreen ? ScrollView : View;

  // -------------------------
  // VALIDATION SCHEMA
  // -------------------------
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email or phone number is required")
      .test(
        "email-or-phone",
        "Invalid email or phone number",
        function (value) {
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
        }
      ),
    password: Yup.string().required("Password is required"),
  });

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
                title="Welcome back"
                subtitle="Sign in to shop or sell your fullest"
              />
            ),
          }}
        />
        <Container contentContainerStyle={isSmallScreen && { flexGrow: 1 }}>
          <View
            style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}
          >
            <AuthTabSwitcher
              active={"login"}
              onChange={() => {
                router.replace("/signup");
              }}
            />

            {/* -------------------------
              FORM START (Formik)
             ------------------------- */}
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ values, handleChange, handleSubmit, errors, touched }) => (
                <View
                  style={[
                    styles.section,
                    {
                      backgroundColor: colors.background,
                      gap: spacing.md,
                      marginTop: spacing.lg,
                    },
                  ]}
                >
                  {/* EMAIL */}
                  <InputField
                    label="Login ID"
                    placeholder="Enter email or phone number"
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

                  {/* PASSWORD */}
                  <InputField
                    label="Password"
                    placeholder="Enter password"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    secure={!showPassword}
                    error={
                      touched.password && errors.password
                        ? errors.password
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
                  {/* FORGOT PASSWORD */}
                  <SecondaryTextButton
                    title="Forgot password?"
                    onPress={() => router.push("/forgot-password")}
                  />

                  <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
                    {/* LOGIN BUTTON */}
                    <PrimaryButton
                      title={isLoggingIn ? "Logging in..." : "Login"}
                      onPress={handleSubmit}
                      disabled={isLoggingIn}
                      loading={isLoggingIn}
                    />

                    {/* DIVIDER */}
                    <FormDividerText text="or Continue with" />

                    {/* SOCIAL ROW */}
                    <SocialLogins
                      onGoogle={handleGoogleLogin}
                      onApple={() => {}}
                      loading={isSocialAuthLoading}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </Container>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
  },
});
