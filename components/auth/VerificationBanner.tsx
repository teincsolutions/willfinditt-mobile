import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";

interface VerificationBannerProps {
  visible?: boolean;
  onDismiss?: () => void;
}

export default function VerificationBanner({
  visible = true,
  onDismiss,
}: VerificationBannerProps) {
  const { colors, spacing, radius } = useTheme();
  const { user, resendVerificationAsync, isResendingVerification } = useAuth();
  const [countdown, setCountdown] = useState(0);

  // Start countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Don't show if user is verified or banner is hidden
  // Check isVerified first (main verification flag), then individual email/phone verification
  if (!visible || !user || user.isVerified) {
    return null;
  }

  const handleResend = async () => {
    if (countdown > 0 || isResendingVerification) return;

    try {
      const data = user.email ? { email: user.email } : { phone: user.phone! };

      await resendVerificationAsync(data);
      setCountdown(60); // 60 second cooldown
      toast.success("Verification code sent!");

      // Navigate to verify-otp screen
      // Determine verification type based on what was sent
      if (user.email && !user.emailVerified) {
        router.push({
          pathname: "/(auth)/verify-otp",
          params: {
            type: "email-verification",
            email: user.email,
          },
        });
      } else if (user.phone && !user.phoneVerified) {
        router.push({
          pathname: "/(auth)/verify-otp",
          params: {
            type: "phone-verification",
            phone: user.phone,
          },
        });
      }
    } catch (error: any) {
      toast.error(
        error?.message ||
          "Failed to resend verification code. Please try again."
      );
    }
  };

  const getVerificationMessage = () => {
    if (!user.emailVerified && user.email) {
      return `Please verify your email (${user.email}) to unlock all features.`;
    }
    if (!user.phoneVerified && user.phone) {
      return `Please verify your phone (${user.phone}) to unlock all features.`;
    }
    return "Please complete verification to unlock all features.";
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.warning + "15",
          borderColor: colors.warning,
          borderRadius: radius.md,
          padding: spacing.md,
          marginHorizontal: spacing.md,
          marginVertical: spacing.sm,
        },
      ]}
    >
      <View style={styles.content}>
        <Feather
          name="alert-circle"
          size={20}
          color={colors.warning}
          style={{ marginTop: 2 }}
        />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
            }}
          >
            {getVerificationMessage()}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={handleResend}
          disabled={countdown > 0 || isResendingVerification}
          style={({ pressed }) => [
            {
              opacity: pressed
                ? 0.7
                : countdown > 0 || isResendingVerification
                ? 0.5
                : 1,
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.sm,
            },
          ]}
        >
          <Text
            style={{
              color: colors.primary,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            {isResendingVerification
              ? "Sending..."
              : countdown > 0
              ? `Resend (${countdown}s)`
              : "Resend Code"}
          </Text>
        </Pressable>

        {onDismiss && (
          <Pressable
            onPress={onDismiss}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
              },
            ]}
          >
            <Feather name="x" size={18} color={colors.textGray} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
});
