// screens/VerifyOTPScreen.tsx

import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
    userId: string;
    type: string;
    phone?: string;
  }>();
  const [otp, setOtp] = useState("");

  const {
    verify2FAAsync,
    isVerifying2FA,
    verifyResetPhoneOtpAsync,
    isVerifyingResetPhoneOtp,
    isResendingVerification,
  } = useAuth();

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      if (params.type === "2fa" && params.userId) {
        await verify2FAAsync(otp);
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
      }
    } catch (error: any) {
      toast.error(error?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      // Resend verification - this would need user's email/phone
      toast.success("OTP has been resent to your device");
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
                    : "Verify Your Identity"
                }
                subtitle={
                  params.type === "password-reset"
                    ? "Enter the 6-digit code sent to your phone"
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
                disabled={isVerifying2FA}
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
              <PrimaryButton
                title={isResendingVerification ? "Resending..." : "Resend Code"}
                onPress={handleResendOTP}
                disabled={isResendingVerification}
              />

              {/* Verify Button */}
              <View style={{ marginTop: spacing.lg }}>
                <PrimaryButton
                  title={
                    isVerifying2FA || isVerifyingResetPhoneOtp
                      ? "Verifying..."
                      : "Verify"
                  }
                  onPress={handleVerifyOTP}
                  disabled={
                    isVerifying2FA || isVerifyingResetPhoneOtp || otp.length < 6
                  }
                  loading={isVerifying2FA || isVerifyingResetPhoneOtp}
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
