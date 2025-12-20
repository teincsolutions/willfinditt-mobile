// screens/VerifyOTPScreen.tsx

import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { toast } from "sonner-native";

import HeaderBackground from "@/components/auth/HeaderBackground";
import ScreenWrapper from "@/components/auth/ScreenWrapper";
import AppText from "@/components/ui/AppText";
import OTPInput from "@/components/ui/OTPInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryTextButton from "@/components/ui/SecondaryTextButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";

export default function VerifyOTPScreen() {
  const { spacing, colors, radius } = useTheme();
  const params = useLocalSearchParams<{
    userId?: string;
    type: string;
    phone?: string;
    email?: string;
  }>();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60); // 60 seconds countdown
  const [canResend, setCanResend] = useState(false);

  const {
    verify2FAAsync,
    isVerifying2FA,
    verifyResetPhoneOtpAsync,
    isVerifyingResetPhoneOtp,
    verifyEmailAsync,
    isVerifyingEmail,
    verifyPhoneAsync,
    isVerifyingPhone,
    isResendingVerification,
    resendVerificationAsync,
  } = useAuth();

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      if (params.type === "2fa" && params.userId) {
        await verify2FAAsync({
          userId: params.userId,
          otpCode: otp,
        });
        toast.success("Verification successful!");
        router.replace("/(drawers)");
      } else if (params.type === "password-reset" && params.phone) {
        // Verify OTP (optional verification step)
        await verifyResetPhoneOtpAsync({
          phone: params.phone,
          otp,
        });
        toast.success("OTP verified! Please enter your new password.");
        // Navigate to reset password screen with phone and OTP
        router.push({
          pathname: "/(auth)/reset-password",
          params: {
            phone: params.phone,
            otp: otp,
          },
        });
      } else if (params.type === "email-verification" && params.email) {
        // Verify email with OTP token
        await verifyEmailAsync(otp);
        toast.success("Email verified successfully!");
        router.replace("/(drawers)");
      } else if (params.type === "phone-verification" && params.phone) {
        // Verify phone with OTP
        await verifyPhoneAsync(otp);
        toast.success("Phone verified successfully!");
        router.replace("/(drawers)");
      }
    } catch (error: any) {
      toast.error(error?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      // Resend verification based on type
      if (params.type === "email-verification" && params.email) {
        await resendVerificationAsync({ email: params.email });
        toast.success("OTP has been resent to your email");
      } else if (params.type === "phone-verification" && params.phone) {
        await resendVerificationAsync({ phone: params.phone });
        toast.success("OTP has been resent to your phone");
      } else {
        // Generic resend for other types
        toast.success("OTP has been resent to your device");
      }

      // Reset countdown
      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to resend OTP");
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
                title={
                  params.type === "password-reset"
                    ? "Reset Password"
                    : params.type === "email-verification"
                    ? "Verify Email"
                    : params.type === "phone-verification"
                    ? "Verify Phone"
                    : "Verify Your Identity"
                }
                subtitle={
                  params.type === "password-reset"
                    ? "Enter the 6-digit code sent to your phone"
                    : params.type === "email-verification"
                    ? `Enter the 6-digit code sent to ${
                        params.email || "your email"
                      }`
                    : params.type === "phone-verification"
                    ? `Enter the 6-digit code sent to ${
                        params.phone || "your phone"
                      }`
                    : "Enter the 6-digit code sent to your device"
                }
              />
            ),
          }}
        />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}
          >
            <View
              style={[
                styles.section,
                { gap: spacing.md, marginTop: spacing.lg },
              ]}
            >
              {/* OTP Label */}
              <AppText
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.text,
                  marginBottom: spacing.sm,
                }}
              >
                One-Time Password
              </AppText>

              {/* OTP Input */}
              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
                onComplete={handleVerifyOTP}
                disabled={
                  isVerifying2FA ||
                  isVerifyingResetPhoneOtp ||
                  isVerifyingEmail ||
                  isVerifyingPhone
                }
              />

              {/* Info Text */}
              <AppText
                style={{
                  color: colors.textGray,
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: spacing.sm,
                }}
              >
                Didn&apos;t receive the code?
              </AppText>

              {/* Resend Button */}
              <SecondaryTextButton
                title={
                  isResendingVerification
                    ? "Resending..."
                    : canResend
                    ? "Resend Code"
                    : `Resend Code (${countdown}s)`
                }
                onPress={handleResendOTP}
                disabled={isResendingVerification || !canResend}
              />

              {/* Verify Button */}
              <View style={{ marginTop: spacing.lg }}>
                <PrimaryButton
                  title={
                    isVerifying2FA ||
                    isVerifyingResetPhoneOtp ||
                    isVerifyingEmail ||
                    isVerifyingPhone
                      ? "Verifying..."
                      : "Verify"
                  }
                  onPress={handleVerifyOTP}
                  disabled={
                    isVerifying2FA ||
                    isVerifyingResetPhoneOtp ||
                    isVerifyingEmail ||
                    isVerifyingPhone ||
                    otp.length < 6
                  }
                  loading={
                    isVerifying2FA ||
                    isVerifyingResetPhoneOtp ||
                    isVerifyingEmail ||
                    isVerifyingPhone
                  }
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
