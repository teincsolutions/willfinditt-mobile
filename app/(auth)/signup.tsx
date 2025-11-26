// screens/RegisterScreen.tsx

import { Formik } from "formik";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import * as Yup from "yup";

import HeaderBack from "@/components/auth/HeaderBack";
import InstructionTextBlock from "@/components/auth/InstructionTextBlock";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import PrimaryButton from "@/components/auth/PrimaryButton";
import ScreenWrapper from "@/components/auth/ScreenWrapper";
import SecondaryTextButton from "@/components/auth/SecondaryTextButton";
import CountryCodePicker from "@/components/ui/CountryCodePicker";
import InputField from "@/components/ui/InputField";
import { useTheme } from "@/contexts/ThemeContext";
import { setAuthenticated, setHasOpenedApp } from "@/lib/storage";
import { router } from "expo-router";

export default function RegisterScreen() {
  const { spacing } = useTheme();
  const [mode, setMode] = useState<"phone" | "email" | "password">("phone");
  const window = useWindowDimensions();
  const isSmallScreen = window.height < 750;
  const Container = isSmallScreen ? ScrollView : View;

  const handleSignupComplete = async () => {
    // Mark that user has opened the app and is authenticated
    await setHasOpenedApp(true);
    await setAuthenticated(true);

    // Navigate to the main tabs
    router.replace("/(tabs)");
  };

  // -------------------------
  // VALIDATION SCHEMAS
  // -------------------------
  const PhoneSchema = Yup.object().shape({
    phone: Yup.string()
      .matches(/^0[0-9]{9}$/, "Invalid Ghana phone number format")
      .required("Phone number is required"),
  });

  const EmailSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const PasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  // ----------------------
  // RENDER PHONE STEP
  // ----------------------
  const renderPhoneStep = () => (
    <Formik
      initialValues={{ phone: "" }}
      validationSchema={PhoneSchema}
      onSubmit={() => setMode("password")}
    >
      {({ values, handleChange, handleSubmit, errors, touched }) => (
        <View style={styles.section}>
          <InstructionTextBlock
            title="Register"
            subtitle="Register with your phone"
          />

          <View style={{ marginTop: spacing.lg }}>
            <InputField
              label="Phone number"
              placeholder="Enter phone number"
              value={values.phone}
              onChangeText={handleChange("phone")}
              keyboardType="phone-pad"
              error={touched.phone && errors.phone ? errors.phone : undefined}
              leftIcon={
                <CountryCodePicker code="+233" flag="🇬🇭" onPress={() => {}} />
              }
            />
          </View>

          <View style={{ marginTop: spacing.lg }}>
            <PrimaryButton title="Continue" onPress={handleSubmit} />
          </View>

          <View style={{ marginTop: spacing.md }}>
            <SecondaryTextButton
              title="Use email instead"
              onPress={() => setMode("email")}
            />
          </View>
        </View>
      )}
    </Formik>
  );

  // ----------------------
  // RENDER EMAIL STEP
  // ----------------------
  const renderEmailStep = () => (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={EmailSchema}
      onSubmit={() => setMode("password")}
    >
      {({ values, handleChange, handleSubmit, errors, touched }) => (
        <View style={styles.section}>
          <InstructionTextBlock
            title="Register"
            subtitle="Register with your email"
          />

          <View style={{ marginTop: spacing.lg }}>
            <InputField
              label="Email"
              placeholder="Enter email"
              value={values.email}
              onChangeText={handleChange("email")}
              keyboardType="email-address"
              error={touched.email && errors.email ? errors.email : undefined}
            />
          </View>

          <View style={{ marginTop: spacing.lg }}>
            <PrimaryButton title="Continue" onPress={handleSubmit} />
          </View>

          <View style={{ marginTop: spacing.md }}>
            <SecondaryTextButton
              title="Use phone instead"
              onPress={() => setMode("phone")}
            />
          </View>
        </View>
      )}
    </Formik>
  );

  // ----------------------
  // RENDER PASSWORD STEP
  // ----------------------
  const renderPasswordStep = () => (
    <Formik
      initialValues={{ password: "" }}
      validationSchema={PasswordSchema}
      onSubmit={handleSignupComplete}
    >
      {({ values, handleChange, handleSubmit, errors, touched }) => {
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
            <InstructionTextBlock
              title="Create Password"
              subtitle="Secure your account"
            />

            <View style={{ marginTop: spacing.lg }}>
              <InputField
                label="Password"
                placeholder="Enter password"
                value={values.password}
                onChangeText={handleChange("password")}
                secure
                error={
                  touched.password && errors.password
                    ? errors.password
                    : undefined
                }
              />

              <PasswordStrengthMeter strength={strength} />
            </View>

            <View style={{ marginTop: spacing.lg }}>
              <PrimaryButton title="Sign Up" onPress={handleSubmit} />
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
    <ScreenWrapper>
      <HeaderBack onPress={() => router.back()} />

      <Container contentContainerStyle={isSmallScreen && { flexGrow: 1 }}>
        <View style={{ paddingHorizontal: spacing.lg }}>
          {mode === "phone" && renderPhoneStep()}
          {mode === "email" && renderEmailStep()}
          {mode === "password" && renderPasswordStep()}
        </View>
      </Container>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
  },
});
