import { useTheme } from "@/contexts/ThemeContext";
import { useDeleteAccount } from "@/hooks/useAccountManagement";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    TouchableOpacity,
    View
} from "react-native";
import AppText from "../ui/AppText";
import InputField from "../ui/InputField";
import PrimaryButton from "../ui/PrimaryButton";
import { TextButton } from "../ui/TextButton";

interface AccountDeletionModalProps {
  visible: boolean;
  onClose: () => void;
}

const AccountDeletionModal: React.FC<AccountDeletionModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, spacing, radius, icons } = useTheme();
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { deleteAccountAsync, isDeleting } = useDeleteAccount();

  const isLoading = isDeleting;
  const requiredConfirmText = "DELETE";

  const handleClose = () => {
    if (isLoading) return;
    setPassword("");
    setConfirmText("");
    setShowPassword(false);
    onClose();
  };

  const handleConfirm = async () => {
    // Validate confirmation text
    if (confirmText.toUpperCase() !== requiredConfirmText) {
      Alert.alert(
        "Confirmation Required",
        `Please type "${requiredConfirmText}" to confirm.`,
        [{ text: "OK" }]
      );
      return;
    }

    // Validate password
    if (!password.trim()) {
      Alert.alert(
        "Password Required",
        "Please enter your password to continue.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      await deleteAccountAsync();
      handleClose();
    } catch (error: any) {
      // Error is already handled by the hooks with toast
      console.error("Account action error:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: colors.backgroundPrimary,
            borderRadius: radius.lg,
            width: "90%",
            maxWidth: 500,
            maxHeight: "80%",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              backgroundColor: colors.errorLight,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <Feather name="trash-2" size={icons.md} color={colors.error} />
              <AppText
                variant="lg"
                style={{
                  fontWeight: "600",
                  marginLeft: spacing.sm,
                  color: colors.error,
                }}
              >
                Delete Account
              </AppText>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              style={{ padding: spacing.xs }}
            >
              <Feather name="x" size={icons.md} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={{ maxHeight: 400 }}
            contentContainerStyle={{ padding: spacing.md }}
          >
            {/* Warning */}
            <View
              style={{
                backgroundColor: colors.errorLight,
                padding: spacing.md,
                borderRadius: radius.md,
                marginBottom: spacing.lg,
                borderLeftWidth: 4,
                borderLeftColor: colors.error,
              }}
            >
              <AppText
                variant="md"
                style={{
                  fontWeight: "600",
                  marginBottom: spacing.sm,
                  color: colors.error,
                }}
              >
                ⚠️ Warning
              </AppText>
              <AppText variant="sm" style={{ color: colors.text }}>
                This action will permanently delete your account and all
                associated data after a 30-day grace period.
              </AppText>
            </View>

            {/* Impact on Ads */}
            <View
              style={{
                backgroundColor: colors.backgroundSecondary,
                padding: spacing.md,
                borderRadius: radius.md,
                marginBottom: spacing.lg,
              }}
            >
              <AppText
                variant="sm"
                style={{ fontWeight: "600", marginBottom: spacing.sm }}
              >
                Impact on Your Ads
              </AppText>
              <View style={{ gap: spacing.xs }}>
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <AppText
                    style={{ color: colors.error, marginRight: spacing.xs }}
                  >
                    •
                  </AppText>
                  <AppText
                    variant="sm"
                    style={{ flex: 1, color: colors.textGray }}
                  >
                    All ACTIVE and PENDING ads will be closed immediately
                  </AppText>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <AppText
                    style={{ color: colors.warning, marginRight: spacing.xs }}
                  >
                    •
                  </AppText>
                  <AppText
                    variant="sm"
                    style={{ flex: 1, color: colors.textGray }}
                  >
                    SOLD and EXPIRED ads remain for 30 days
                  </AppText>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <AppText
                    style={{ color: colors.textGray, marginRight: spacing.xs }}
                  >
                    •
                  </AppText>
                  <AppText
                    variant="sm"
                    style={{ flex: 1, color: colors.textGray }}
                  >
                    After 30 days, all data will be permanently anonymized
                  </AppText>
                </View>
              </View>
            </View>

            <View
              style={{
                backgroundColor: colors.backgroundSecondary,
                padding: spacing.md,
                borderRadius: radius.md,
                marginBottom: spacing.lg,
              }}
            >
              <AppText
                variant="sm"
                style={{ fontWeight: "600", marginBottom: spacing.sm }}
              >
                Grace Period
              </AppText>
              <View style={{ gap: spacing.xs }}>
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <AppText
                    style={{ color: colors.success, marginRight: spacing.xs }}
                  >
                    ✓
                  </AppText>
                  <AppText
                    variant="sm"
                    style={{ flex: 1, color: colors.textGray }}
                  >
                    You have 30 days to reactivate by contacting support
                  </AppText>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <AppText
                    style={{ color: colors.success, marginRight: spacing.xs }}
                  >
                    ✓
                  </AppText>
                  <AppText
                    variant="sm"
                    style={{ flex: 1, color: colors.textGray }}
                  >
                    Your data is retained but your account is inactive
                  </AppText>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <AppText
                    style={{ color: colors.error, marginRight: spacing.xs }}
                  >
                    ✗
                  </AppText>
                  <AppText
                    variant="sm"
                    style={{ flex: 1, color: colors.textGray }}
                  >
                    After 30 days, deletion is permanent and irreversible
                  </AppText>
                </View>
              </View>
            </View>
            {/* Password Confirmation */}
            <InputField
              inputStyle={{ backgroundColor: colors.backgroundSecondary }}
              leftIcon={
                <Feather name="lock" color={colors.iconGray} size={icons.md} />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ padding: spacing.xs }}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={icons.sm}
                    color={colors.textGray}
                  />
                </TouchableOpacity>
              }
              label="Enter Your Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secure={!showPassword}
              autoComplete="password"
              returnKeyType="next"
              style={{ marginBottom: spacing.md }}
            />

            {/* Type Confirmation */}
            <InputField
              inputStyle={{ backgroundColor: colors.backgroundSecondary }}
              leftIcon={
                <Feather
                  name="alert-circle"
                  color={colors.error}
                  size={icons.md}
                />
              }
              label={`Type "${requiredConfirmText}" to confirm`}
              placeholder={requiredConfirmText}
              value={confirmText}
              onChangeText={setConfirmText}
              autoCapitalize="characters"
              autoComplete="off"
              style={{ marginBottom: spacing.md }}
            />
          </ScrollView>
          {/* Actions */}
          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
              padding: spacing.md,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <TextButton
              title="Cancel"
              onPress={handleClose}
              disabled={isLoading}
              style={{ flex: 1 }}
            />
            <PrimaryButton
              title="Delete Account"
              onPress={handleConfirm}
              loading={isLoading}
              disabled={
                isLoading ||
                confirmText.toUpperCase() !== requiredConfirmText ||
                !password.trim()
              }
              style={{
                flex: 1,
                backgroundColor: colors.error,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AccountDeletionModal;
