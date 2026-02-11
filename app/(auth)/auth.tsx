// screens/AuthScreen.tsx

import Feather from "@expo/vector-icons/Feather";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
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
import AppText from "@/components/ui/AppText";
import CheckBox from "@/components/ui/CheckBox";
import CountryCodePicker from "@/components/ui/CountryCodePicker";
import FormDividerText from "@/components/ui/FormDividerText";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryTextButton from "@/components/ui/SecondaryTextButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { formatPhoneNumber } from "@/lib/formatPhoneNumber";
import { router, useLocalSearchParams } from "expo-router";

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
      : schema,
  ),
  mode: Yup.string(),
  email: Yup.string().when("mode", (mode: any, schema) =>
    mode === "email" ? schema.email().required("Email is required") : schema,
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
  termsAccepted: Yup.boolean()
    .oneOf([true], "You must accept the Terms and Conditions")
    .required("Terms acceptance is required"),
  privacyPolicyAccepted: Yup.boolean()
    .oneOf([true], "You must accept the Privacy Policy")
    .required("Privacy Policy acceptance is required"),
});

const LoginSchema = Yup.object().shape({
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
  password: Yup.string().required("Password is required"),
});

export default function AuthScreen({
  initialTab = "register",
}: {
  initialTab?: "login" | "register";
}) {
  const { redirectTo, adId, sellerId } = useLocalSearchParams<{
    redirectTo?: any;
    adId?: string;
    sellerId?: string;
  }>();
  const { spacing, radius, icons, colors } = useTheme();
  const [step, setStep] = useState<"step1" | "step2">("step1");
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const {
    registerAsync,
    isRegistering,
    loginAsync,
    isLoggingIn,
    loginError,
    socialAuthAsync,
    isSocialAuthLoading,
  } = useAuth();

  const window = useWindowDimensions();
  const isSmallScreen = window.height - 320 < 750;

  useEffect(() => {
    if (activeTab === "register") {
      setStep("step1");
    }
  }, [activeTab]);

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
        termsAccepted: (passwordData as any).termsAccepted,
        privacyPolicyAccepted: (passwordData as any).privacyPolicyAccepted,
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

      // Check if verification is required
      if (result.requiresVerification) {
        router.push({
          pathname: "/verify-otp",
          params: {
            userId: result.user?.id,
            email: result.user?.email,
            phone: result.user?.phone,
            type:
              formData.mode === "email"
                ? "email-verification"
                : "phone-verification",
          },
        });
        return;
      }

      // Navigate to the main drawers (fully verified)
      if (redirectTo) {
        router.replace({ pathname: redirectTo, params: { adId, sellerId } });
      } else {
        router.replace({ pathname: "/(drawers)" });
      }
    } catch (error: any) {
      console.log("Registration error:", error.message);

      // Check if this is a 409 conflict with verification needed
      if (error.isConflict && error.originalMessage?.includes("not verified")) {
        // Navigate to verification or login
        toast.info("Please check your email/phone for verification code");
        router.replace("/login");
      }
    }
  };

  const handleLogin = async (values: {
    indentifier: string;
    password: string;
  }) => {
    try {
      // Determine if input is email or phone
      const indentifier = values.indentifier.trim();
      const isPhone = /^[0-9+]/.test(indentifier);

      // Prepare login data
      const loginData = {
        email: isPhone ? undefined : indentifier,
        phone: isPhone ? formatPhoneNumber(indentifier) : undefined,
        password: values.password,
      };

      const response = await loginAsync(loginData);

      // Check if 2FA is required
      if (response.requires2FA && response.user?.id) {
        router.push({
          pathname: "/verify-otp",
          params: { userId: response.user.id, type: "2fa" },
        });
        return;
      }

      // Check if verification is required
      if (response.requiresVerification) {
        router.push({
          pathname: "/verify-otp",
          params: {
            userId: response.user?.id,
            email: response.user?.email,
            phone: response.user?.phone,
            type: isPhone ? "phone-verification" : "email-verification",
          },
        });
        return;
      }

      // Navigate to the main tabs (fully verified)
      if (redirectTo) {
        router.replace({ pathname: redirectTo, params: { adId, sellerId } });
      } else {
        router.replace({ pathname: "/(drawers)" });
      }
    } catch (error: any) {
      console.log("Login error:", error.response?.data || error.message);
      toast.error(
        error?.message ||
          loginError?.message ||
          "Login failed. Please check your credentials and try again.",
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

        // Navigate to main screen (fully verified)
        if (redirectTo) {
          router.replace({ pathname: redirectTo, params: { adId, sellerId } });
        } else {
          router.replace({ pathname: "/(drawers)" });
        }
      } else if (signInResponse.type === "cancelled") {
        // User cancelled, no error needed
        console.log("Google sign-up cancelled");
      }
    } catch (error: any) {
      console.log("Google sign-up error:", error.message);
      toast.error(error?.message || "Google signup failed. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Check Play Services availability
      await GoogleSignin.hasPlayServices();

      // Clear any cached tokens
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser?.idToken) {
        await GoogleSignin.clearCachedAccessToken(currentUser.idToken);
        await GoogleSignin.signOut();
      }

      // Start sign-in flow
      const signInResponse = await GoogleSignin.signIn();

      if (signInResponse.type === "success") {
        // Prepare social auth data
        const socialAuthData = {
          provider: "GOOGLE" as const,
          accessToken: signInResponse.data.idToken,
        };

        // Send to backend API
        const response = await socialAuthAsync(socialAuthData);
        toast.success("Google Sign-In Successful!");

        // Check if 2FA is required
        if (response.requires2FA && response.user?.id) {
          router.push({
            pathname: "/verify-otp",
            params: { userId: response.user.id, type: "2fa" },
          });
          return;
        }

        // Navigate to main screen (fully verified)
        if (redirectTo) {
          router.replace({ pathname: redirectTo, params: { adId, sellerId } });
        } else {
          router.replace({ pathname: "/(drawers)" });
        }
      } else if (signInResponse.type === "cancelled") {
        // User cancelled, no error needed
        console.log("Google sign-in cancelled");
      }
    } catch (error: any) {
      console.log("Google sign-in error:", error.message);
      toast.error(error?.message || "Google login failed. Please try again.");
    }
  };

  const handleAppleSignup = async () => {
    try {
      // Check if Apple Authentication is available on this device
      if (!AppleAuthentication.isAvailableAsync()) {
        toast.error("Apple Sign-In is not available on this device");
        return;
      }

      // Start the Apple sign-in flow
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        // Prepare social auth data with name info (only sent on first login)
        const socialAuthData: any = {
          provider: "APPLE" as const,
          accessToken: credential.identityToken,
        };

        // Include full name if available (Apple only provides this on first login)
        if (credential.fullName?.givenName || credential.fullName?.familyName) {
          socialAuthData.fullName = {
            givenName: credential.fullName.givenName || "User",
            familyName: credential.fullName.familyName || "",
          };
        }

        // Send to backend API
        const result = await socialAuthAsync(socialAuthData);

        toast.success("Apple Sign-Up Successful!");

        // Check if 2FA is required
        if (result.requires2FA && result.user) {
          router.push({
            pathname: "/verify-otp",
            params: { userId: result.user.id, type: "2fa" },
          });
          return;
        }

        // Navigate to main screen (fully verified)
        if (redirectTo) {
          router.replace({ pathname: redirectTo, params: { adId, sellerId } });
        } else {
          router.replace({ pathname: "/(drawers)" });
        }
      }
    } catch (error: any) {
      // Check if user cancelled the operation
      if (error.code === "ERR_REQUEST_CANCELED") {
        console.log("Apple sign-up cancelled");
        return;
      }
      console.log("Apple sign-up error:", error.message);
      toast.error(error?.message || "Apple signup failed. Please try again.");
    }
  };

  const handleAppleLogin = async () => {
    try {
      // Check if Apple Authentication is available on this device
      if (!AppleAuthentication.isAvailableAsync()) {
        toast.error("Apple Sign-In is not available on this device");
        return;
      }

      // Start the Apple sign-in flow
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        // Prepare social auth data
        const socialAuthData: any = {
          provider: "APPLE" as const,
          accessToken: credential.identityToken,
        };

        // Include full name if available (Apple only provides this on first login)
        if (credential.fullName?.givenName || credential.fullName?.familyName) {
          socialAuthData.fullName = {
            givenName: credential.fullName.givenName || "User",
            familyName: credential.fullName.familyName || "",
          };
        }

        // Send to backend API
        const response = await socialAuthAsync(socialAuthData);

        toast.success("Apple Sign-In Successful!");

        // Check if 2FA is required
        if (response.requires2FA && response.user?.id) {
          router.push({
            pathname: "/verify-otp",
            params: { userId: response.user.id, type: "2fa" },
          });
          return;
        }

        // Navigate to main screen (fully verified)
        if (redirectTo) {
          router.replace({ pathname: redirectTo, params: { adId, sellerId } });
        } else {
          router.replace({ pathname: "/(drawers)" });
        }
      }
    } catch (error: any) {
      // Check if user cancelled the operation
      if (error.code === "ERR_REQUEST_CANCELED") {
        console.log("Apple sign-in cancelled");
        return;
      }
      console.log("Apple sign-in error:", error.message);
      toast.error(error?.message || "Apple login failed. Please try again.");
    }
  };

  const handleBack = () => {
    if (activeTab === "register" && step === "step2") {
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
                    values.mode === "email" ? "phone" : "email",
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
                onApple={handleAppleSignup}
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
      initialValues={{
        password: "",
        confirmPassword: "",
        termsAccepted: false,
        privacyPolicyAccepted: false,
      }}
      validationSchema={PasswordSchema}
      onSubmit={handleSignupComplete}
    >
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        isValid,
        setFieldTouched,
      }) => {
        const strength =
          values.password.length >= 8
            ? 3
            : values.password.length >= 6
              ? 2
              : values.password.length > 0
                ? 1
                : 0;

        // Custom handler to mark confirmPassword as touched when password changes
        const handlePasswordChange = (text: string) => {
          handleChange("password")(text);
          setFieldTouched("confirmPassword", true, false);
        };

        return (
          <View style={styles.section}>
            <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
              <InputField
                placeholder="Enter password"
                value={values.password}
                onChangeText={handlePasswordChange}
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
                autoComplete="password"
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
                autoComplete="password"
              />

              <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
                <CheckBox
                  value={values.termsAccepted}
                  onValueChange={(val) =>
                    handleChange("termsAccepted")(val.toString())
                  }
                  label="I accept the Terms and Conditions"
                  textStyle={{ minWidth: "85%" }}
                  checkboxColor={colors.primary}
                />
                {touched.termsAccepted && errors.termsAccepted && (
                  <AppText variant="xs" style={{ color: colors.error }}>
                    {errors.termsAccepted}
                  </AppText>
                )}

                <CheckBox
                  value={values.privacyPolicyAccepted}
                  onValueChange={(val) =>
                    handleChange("privacyPolicyAccepted")(val.toString())
                  }
                  label="I accept the Privacy Policy"
                  textStyle={{ minWidth: "85%" }}
                  checkboxColor={colors.primary}
                />
                {touched.privacyPolicyAccepted &&
                  errors.privacyPolicyAccepted && (
                    <AppText variant="xs" style={{ color: colors.error }}>
                      {errors.privacyPolicyAccepted}
                    </AppText>
                  )}
              </View>
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
  // RENDER LOGIN
  // ----------------------
  const renderLogin = () => (
    <Formik
      initialValues={{ indentifier: "", password: "" }}
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
          {/* LOGIN ID */}
          <InputField
            label="Login ID"
            placeholder="Enter email or phone number"
            value={values.indentifier}
            onChangeText={handleChange("indentifier")}
            keyboardType="email-address"
            error={
              touched.indentifier && errors.indentifier
                ? errors.indentifier
                : undefined
            }
            leftIcon={
              <Feather name="user" color={colors.primary} size={icons.md} />
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
              touched.password && errors.password ? errors.password : undefined
            }
            rightIcon={
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Feather name="eye" color={colors.primary} size={icons.md} />
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
            inputStyle={{ borderRadius: radius.xxl }}
            autoComplete="password"
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
              onApple={handleAppleLogin}
              loading={isSocialAuthLoading}
            />
          </View>
        </View>
      )}
    </Formik>
  );

  // ----------------------
  // MAIN RETURN
  // ----------------------
  return (
    <ScreenWrapper
      style={{
        zIndex: 1000,
      }}
      scroll
    >
      <HeaderBackground
        title={
          activeTab === "register"
            ? "Go ahead and setup your Account"
            : "Welcome back"
        }
        subtitle={
          activeTab === "register"
            ? "Sign up to enjoy the best experience"
            : "Sign in to shop or sell your fullest"
        }
        onBack={handleBack}
      />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            height: window.height,
          }}
        >
          <AuthTabSwitcher
            active={activeTab}
            onChange={() =>
              setActiveTab(activeTab === "register" ? "login" : "register")
            }
          />

          {activeTab === "register" ? (
            <>
              {step === "step1" && renderStep1()}
              {step === "step2" && renderStep2()}
            </>
          ) : (
            renderLogin()
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
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
