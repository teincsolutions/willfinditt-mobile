import AppText from "@/components/ui/AppText";
import { TextButton } from "@/components/ui/TextButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAd } from "@/hooks/useAds";
import { Feather } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { router } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";

interface SuspensionDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  adId: string;
}

const SuspensionDetailsModal: React.FC<SuspensionDetailsModalProps> = ({
  visible,
  onClose,
  adId,
}) => {
  const { colors, spacing, radius, icons } = useTheme();
  const { data: ad, isLoading } = useAd(adId, visible);

  // Don't compute derived values until ad is loaded
  if (isLoading || !ad) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
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
            <View
              style={{
                padding: spacing.xl,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 200,
              }}
            >
              <ActivityIndicator size="large" color={colors.primary} />
              <AppText
                style={{ marginTop: spacing.md, color: colors.textGray }}
              >
                Loading ad details...
              </AppText>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  const timeAgo = ad.suspendedAt
    ? formatDistanceToNow(new Date(ad.suspendedAt), { addSuffix: true })
    : "";

  const reason = ad.suspensionReason;
  const recommendations = ad.suspensionRecommendations;

  const handleContactSupport = () => {
    onClose();
    router.push("/pages/help" as any);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
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
              backgroundColor: colors.warningLight,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <Feather
                name="slash"
                size={icons.md}
                color={colors.warning}
              />
              <AppText
                variant="lg"
                style={{
                  fontWeight: "600",
                  marginLeft: spacing.sm,
                  color: colors.warning,
                }}
              >
                Ad Suspended
              </AppText>
            </View>
            <TouchableOpacity onPress={onClose} style={{ padding: spacing.xs }}>
              <Feather name="x" size={icons.md} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={{ maxHeight: 400 }}
            contentContainerStyle={{ padding: spacing.md }}
          >
            <AppText
              variant="md"
              style={{ fontWeight: "600", marginBottom: spacing.sm }}
            >
              {ad.title}
            </AppText>
            {timeAgo ? (
              <AppText
                variant="xs"
                style={{ color: colors.textGray, marginBottom: spacing.lg }}
              >
                Suspended {timeAgo}
              </AppText>
            ) : null}

            {/* Reason */}
            {reason ? (
              <View
                style={{
                  backgroundColor: colors.warningLight,
                  padding: spacing.md,
                  borderRadius: radius.md,
                  marginBottom: spacing.md,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.warning,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: spacing.xs,
                  }}
                >
                  <Feather
                    name="alert-circle"
                    size={icons.xs}
                    color={colors.warning}
                  />
                  <AppText
                    variant="xs"
                    style={{
                      fontWeight: "600",
                      marginLeft: spacing.xs,
                      color: colors.warning,
                    }}
                  >
                    Suspension Reason
                  </AppText>
                </View>
                <AppText variant="sm" style={{ color: colors.text }}>
                  {reason}
                </AppText>
                {recommendations ? (
                  <View style={{ marginTop: spacing.md }}>
                    <AppText
                      style={{ fontWeight: "600", marginBottom: spacing.xs }}
                    >
                      Recommendations
                    </AppText>
                    <AppText variant="sm" style={{ color: colors.text }}>
                      {recommendations}
                    </AppText>
                  </View>
                ) : null}
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  padding: spacing.md,
                  borderRadius: radius.md,
                  marginBottom: spacing.md,
                }}
              >
                <AppText variant="sm" style={{ color: colors.textGray }}>
                  No suspension reason provided. Please contact support for more
                  information.
                </AppText>
              </View>
            )}
          </ScrollView>
          <View>
            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                gap: spacing.md,
                padding: spacing.md,
                justifyContent: "flex-end",
              }}
            >
              <TextButton
                style={{ backgroundColor: colors.secondary }}
                titleStyle={{ color: colors.text }}
                title="Close"
                onPress={onClose}
              />
              <TextButton
                style={{ backgroundColor: colors.primary }}
                titleStyle={{ color: colors.textWhite }}
                title="Contact Support"
                onPress={handleContactSupport}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SuspensionDetailsModal;
