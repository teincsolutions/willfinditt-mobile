// screens/LoginScreen.tsx

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
import * as Yup from "yup";

import AuthTabSwitcher from "@/components/auth/AuthTabSwitcher";
import HeaderBackground from "@/components/auth/HeaderBackground";
import ScreenWrapper from "@/components/auth/ScreenWrapper";
import SecondaryTextButton from "@/components/auth/SecondaryTextButton";
import SocialLogins from "@/components/auth/SocialLogins";
import FormDividerText from "@/components/ui/FormDividerText";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useTheme } from "@/contexts/ThemeContext";
import { setAuthenticated, setHasOpenedApp } from "@/lib/storage";
import Feather from "@expo/vector-icons/Feather";
import { router, Stack } from "expo-router";

export default function AuthScreen() {
  const { spacing, colors, radius, icons } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginComplete = async () => {
    // Mark that user has opened the app and is authenticated
    await setHasOpenedApp(true);
    await setAuthenticated(true);

    // Navigate to the main tabs
    router.replace("/(tabs)");
  };

  const window = useWindowDimensions();
  const isSmallScreen = window.height - 300 < 750;
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
              onSubmit={handleLoginComplete}
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
                    label="Email"
                    placeholder="Enter email"
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
                  />
                  {/* FORGOT PASSWORD */}
                  <SecondaryTextButton
                    title="Forgot password?"
                    onPress={() => {}}
                  />

                  <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
                    {/* LOGIN BUTTON */}
                    <PrimaryButton title="Login" onPress={handleSubmit} />

                    {/* DIVIDER */}
                    <FormDividerText text="OR CONTINUE WITH" />

                    {/* SOCIAL ROW */}
                    <SocialLogins onGoogle={() => {}} onApple={() => {}} />
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
