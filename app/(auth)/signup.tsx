// screens/RegisterScreen.tsx

import Feather from "@expo/vector-icons/Feather";
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
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import ScreenWrapper from "@/components/auth/ScreenWrapper";
import SocialLogins from "@/components/auth/SocialLogins";
import ScreenSpacer from "@/components/ScreenSpacer";
import CountryCodePicker from "@/components/ui/CountryCodePicker";
import FormDividerText from "@/components/ui/FormDividerText";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryTextButton from "@/components/ui/SecondaryTextButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { formatPhoneNumber } from "@/lib/formatPhoneNumber";
import { router, Stack } from "expo-router";

// -------------------------
// VALIDATION SCHEMAS
// -------------------------
const BasicInfoSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string().when("mode", (mode: any, schema) =>
    mode === "phone"
      ? schema
          .matches(/^0[0-9]{9}$/, "Invalid Ghana phone number format")
          .required("Phone number is required")
      : schema
  ),
  mode: Yup.string(),
  email: Yup.string().when("mode", (mode: any, schema) =>
    mode === "email" ? schema.email().required("Email is required") : schema
  ),
});

const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function RegisterScreen() {
  const { spacing, radius, icons, colors } = useTheme();
  const [step, setStep] = useState<"step1" | "step2">("step1");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const {
    registerAsync,
    isRegistering,
    registerError,
    socialAuthAsync,
    isSocialAuthLoading,
  } = useAuth();

  const window = useWindowDimensions();
  const isSmallScreen = window.height - 320 < 750;
  const Container = isSmallScreen ? ScrollView : View;

  const handleSignupComplete = async (passwordData: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      if (!formData) return;

      // Prepare registration data
      const registrationData = {
        email: formData.mode === "email" ? formData.email : undefined,
        phone:
          formData.mode === "phone"
            ? formatPhoneNumber(formData.phone)
            : undefined,
        password: passwordData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      const result = await registerAsync(registrationData);

      // Check if 2FA is required
      if (result.requires2FA && result.user) {
        router.push({
          pathname: "/verify-otp",
          params: { userId: result.user.id, type: "2fa" },
        });
        return;
      }

      // Navigate to the main drawers
      router.replace("/(drawers)");
    } catch (error: any) {
      toast.error(
        error?.message ||
          registerError?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const handleGoogleSignup = async () => {
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
        const result = await socialAuthAsync(socialAuthData);

        toast.success("Google Sign-Up Successful!");

        // Check if 2FA is required
        if (result.requires2FA && result.user) {
          router.push({
            pathname: "/verify-otp",
            params: { userId: result.user.id, type: "2fa" },
          });
          return;
        }

        // Navigate to main screen
        router.replace("/(drawers)");
      } else if (signInResponse.type === "cancelled") {
        // User cancelled, no error needed
        console.log("Google sign-up cancelled");
      }
    } catch (error: any) {
      console.log("Google sign-up error:", error.message);
      toast.error(error?.message || "Google signup failed. Please try again.");
    }
  };

  const handleBack = () => {
    if (step === "step2") {
      setStep("step1");
    } else {
      router.back();
    }
  };

  const renderStep1 = () => (
    <View style={styles.section}>
      <Formik
        onSubmit={(values) => {
          setFormData(values);
          setStep("step2");
        }}
        validationSchema={BasicInfoSchema}
        initialValues={{
          phone: "",
          email: "",
          firstName: "",
          lastName: "",
          mode: "phone",
        }}
      >
        {({ values, handleChange, handleSubmit, touched, errors, isValid }) => (
          <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
            <InputField
              placeholder="Enter firstname"
              value={values.firstName}
              onChangeText={handleChange("firstName")}
              keyboardType="ascii-capable"
              error={
                touched.firstName && errors.firstName
                  ? errors.firstName
                  : undefined
              }
              leftIcon={
                <Feather name="user" color={colors.primary} size={icons.md} />
              }
              inputStyle={{ borderRadius: radius.xxl }}
            />

            <InputField
              placeholder="Enter lastname"
              value={values.lastName}
              onChangeText={handleChange("lastName")}
              keyboardType="ascii-capable"
              error={
                touched.lastName && errors.lastName
                  ? errors.lastName
                  : undefined
              }
              leftIcon={
                <Feather name="user" color={colors.primary} size={icons.md} />
              }
              inputStyle={{ borderRadius: radius.xxl }}
            />

            <View style={styles.switchInput}>
              <ScreenSpacer size={1} />
              <SecondaryTextButton
                title={`Use ${
                  values.mode === "email" ? "phone" : "email"
                } instead`}
                underline
                onPress={() =>
                  handleChange("mode")(
                    values.mode === "email" ? "phone" : "email"
                  )
                }
              />
            </View>

            {values.mode === "email" && (
              <InputField
                placeholder="Enter email"
                value={values.email}
                onChangeText={handleChange("email")}
                keyboardType="email-address"
                error={touched.email && errors.email ? errors.email : undefined}
                leftIcon={
                  <Feather name="mail" color={colors.primary} size={icons.md} />
                }
                inputStyle={{ borderRadius: radius.xxl }}
              />
            )}

            {values.mode === "phone" && (
              <InputField
                placeholder="Enter phone number"
                value={values.phone}
                onChangeText={handleChange("phone")}
                keyboardType="phone-pad"
                error={touched.phone && errors.phone ? errors.phone : undefined}
                leftIcon={
                  <CountryCodePicker code="+233" flag="🇬🇭" onPress={() => {}} />
                }
                inputStyle={{ borderRadius: radius.xxl }}
              />
            )}
            <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
              {/* LOGIN BUTTON */}
              <PrimaryButton
                disabled={!isValid}
                title="Next"
                onPress={handleSubmit}
              />

              {/* DIVIDER */}
              <FormDividerText text="or Create Account with" />

              {/* SOCIAL ROW */}
              <SocialLogins
                onGoogle={handleGoogleSignup}
                onApple={() => {}}
                loading={isSocialAuthLoading}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );

  // ----------------------
  // RENDER PASSWORD STEP
  // ----------------------
  const renderStep2 = () => (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={PasswordSchema}
      onSubmit={handleSignupComplete}
    >
      {({ handleChange, handleSubmit, values, errors, touched, isValid }) => {
        const strength =
          values.password.length >= 8
            ? 3
            : values.password.length >= 6
            ? 2
            : values.password.length > 0
            ? 1
            : 0;

        return (
          <View style={styles.section}>
            <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
              <InputField
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
                  <Feather name="lock" color={colors.primary} size={icons.md} />
                }
              />

              <PasswordStrengthMeter strength={strength} />

              <InputField
                placeholder="Confirm password"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                secure={!showPassword}
                error={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
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
                  <Feather name="lock" color={colors.primary} size={icons.md} />
                }
              />
            </View>

            <View style={{ marginTop: spacing.lg }}>
              <PrimaryButton
                disabled={!isValid || isRegistering}
                title={isRegistering ? "Creating Account..." : "Create Account"}
                onPress={handleSubmit}
                loading={isRegistering}
              />
            </View>
          </View>
        );
      }}
    </Formik>
  );

  // ----------------------
  // MAIN RETURN
  // ----------------------
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
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
                title="Go ahead and setup your Account"
                subtitle="Sign up to enjoy the best experience"
                onBack={handleBack}
              />
            ),
          }}
        />
        <Container contentContainerStyle={isSmallScreen && { flexGrow: 1 }}>
          <View
            style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}
          >
            <AuthTabSwitcher
              active={"register"}
              onChange={() => {
                router.replace("/login");
              }}
            />

            {step === "step1" && renderStep1()}
            {step === "step2" && renderStep2()}
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
  switchInput: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
