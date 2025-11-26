// screens/LoginScreen.tsx

import { Formik } from "formik";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import * as Yup from "yup";

import FormDividerText from "@/components/auth/FormDividerText";
import HeaderBack from "@/components/auth/HeaderBack";
import InstructionTextBlock from "@/components/auth/InstructionTextBlock";
import PrimaryButton from "@/components/auth/PrimaryButton";
import ScreenWrapper from "@/components/auth/ScreenWrapper";
import SecondaryTextButton from "@/components/auth/SecondaryTextButton";
import SocialLogins from "@/components/auth/SocialLogins";
import AppText from "@/components/ui/AppText";
import InputField from "@/components/ui/InputField";
import { useTheme } from "@/contexts/ThemeContext";
import { setAuthenticated, setHasOpenedApp } from "@/lib/storage";
import { router } from "expo-router";

export default function LoginScreen() {
  const { spacing } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginComplete = async () => {
    // Mark that user has opened the app and is authenticated
    await setHasOpenedApp(true);
    await setAuthenticated(true);

    // Navigate to the main tabs
    router.replace("/(tabs)");
  };

  const window = useWindowDimensions();
  const isSmallScreen = window.height < 750;
  const Container = isSmallScreen ? ScrollView : View;

  // -------------------------
  // VALIDATION SCHEMA
  // -------------------------
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <ScreenWrapper>
      <HeaderBack onPress={() => router.back()} />

      <Container contentContainerStyle={isSmallScreen && { flexGrow: 1 }}>
        <View style={{ paddingHorizontal: spacing.lg }}>
          <InstructionTextBlock
            title="Login"
            subtitle="Login to your account"
          />

          {/* -------------------------
              FORM START (Formik)
             ------------------------- */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLoginComplete}
          >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <View style={styles.section}>
                {/* EMAIL */}
                <View style={{ marginTop: spacing.lg }}>
                  <InputField
                    label="Email"
                    placeholder="Enter email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    keyboardType="email-address"
                    error={
                      touched.email && errors.email ? errors.email : undefined
                    }
                  />
                </View>

                {/* PASSWORD */}
                <View style={{ marginTop: spacing.lg }}>
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
                        <AppText>{showPassword ? "Hide" : "Show"}</AppText>
                      </Pressable>
                    }
                  />
                </View>

                {/* FORGOT PASSWORD */}
                <View style={{ marginTop: spacing.sm }}>
                  <SecondaryTextButton
                    title="Forgot password?"
                    onPress={() => {}}
                  />
                </View>

                {/* LOGIN BUTTON */}
                <View style={{ marginTop: spacing.lg }}>
                  <PrimaryButton title="Login" onPress={handleSubmit} />
                </View>

                {/* DIVIDER */}
                <View style={{ marginTop: spacing.lg }}>
                  <FormDividerText text="OR CONTINUE WITH" />
                </View>

                {/* SOCIAL ROW */}
                <View style={{ marginTop: spacing.md }}>
                  <SocialLogins onGoogle={() => {}} onApple={() => {}} />
                </View>
              </View>
            )}
          </Formik>
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
