import { useTheme } from "@/contexts/ThemeContext";
import { useSellerGuidelines } from "@/hooks/useSellerAds";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";

interface SubmissionGuidelinesProps {
  categoryId?: string;
  style?: any;
}

export const SubmissionGuidelines: React.FC<SubmissionGuidelinesProps> = ({
  categoryId,
  style,
}) => {
  const { colors, spacing, radius, icons } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: guidelines, isLoading } = useSellerGuidelines(categoryId);

  if (!categoryId) {
    return null;
  }

  return (
    <AppView
      style={[
        {
          backgroundColor: colors.backgroundSecondary,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: spacing.md,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
          <Feather name="info" size={icons.sm} color={colors.primary} />
          <AppText variant="md" style={{ fontWeight: "600", color: colors.text }}>
            Submission Guidelines
          </AppText>
        </View>
        <Feather
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={icons.sm}
          color={colors.textGray}
        />
      </TouchableOpacity>

      {/* Expandable Content */}
      {isExpanded && (
        <View
          style={{
            paddingHorizontal: spacing.md,
            paddingBottom: spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          {isLoading ? (
            <View style={{ padding: spacing.lg, alignItems: "center" }}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : guidelines ? (
            <>
              {/* Category Name */}
              <AppText
                variant="sm"
                style={{
                  color: colors.textGray,
                  marginTop: spacing.sm,
                  marginBottom: spacing.md,
                }}
              >
                Category: <AppText style={{ fontWeight: "600" }}>{guidelines.category}</AppText>
              </AppText>

              {/* Requirements */}
              {guidelines.requirements && guidelines.requirements.length > 0 && (
                <View style={{ marginBottom: spacing.md }}>
                  <AppText
                    variant="sm"
                    style={{ fontWeight: "600", marginBottom: spacing.xs, color: colors.text }}
                  >
                    Requirements
                  </AppText>
                  {guidelines.requirements.map((req, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        marginBottom: spacing.xs,
                        paddingLeft: spacing.sm,
                      }}
                    >
                      <AppText style={{ color: colors.success, marginRight: spacing.xs }}>
                        •
                      </AppText>
                      <AppText
                        variant="sm"
                        style={{ flex: 1, color: colors.textGray }}
                      >
                        {req}
                      </AppText>
                    </View>
                  ))}
                </View>
              )}

              {/* Tips */}
              {guidelines.tips && guidelines.tips.length > 0 && (
                <View style={{ marginBottom: spacing.md }}>
                  <AppText
                    variant="sm"
                    style={{ fontWeight: "600", marginBottom: spacing.xs, color: colors.text }}
                  >
                    Tips for Approval
                  </AppText>
                  {guidelines.tips.map((tip, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        marginBottom: spacing.xs,
                        paddingLeft: spacing.sm,
                      }}
                    >
                      <AppText style={{ color: colors.primary, marginRight: spacing.xs }}>
                        💡
                      </AppText>
                      <AppText
                        variant="sm"
                        style={{ flex: 1, color: colors.textGray }}
                      >
                        {tip}
                      </AppText>
                    </View>
                  ))}
                </View>
              )}

              {/* Common Rejection Reasons */}
              {guidelines.commonRejectionReasons &&
                guidelines.commonRejectionReasons.length > 0 && (
                  <View style={{ marginBottom: spacing.md }}>
                    <AppText
                      variant="sm"
                      style={{ fontWeight: "600", marginBottom: spacing.xs, color: colors.text }}
                    >
                      Common Rejection Reasons
                    </AppText>
                    {guidelines.commonRejectionReasons.map((reason, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          marginBottom: spacing.xs,
                          paddingLeft: spacing.sm,
                        }}
                      >
                        <AppText style={{ color: colors.error, marginRight: spacing.xs }}>
                          ⚠️
                        </AppText>
                        <AppText
                          variant="sm"
                          style={{ flex: 1, color: colors.textGray }}
                        >
                          {reason}
                        </AppText>
                      </View>
                    ))}
                  </View>
                )}

              {/* Estimated Approval Time */}
              {guidelines.estimatedApprovalTime && (
                <View
                  style={{
                    backgroundColor: colors.backgroundPrimary,
                    padding: spacing.sm,
                    borderRadius: radius.sm,
                  }}
                >
                  <AppText variant="xs" style={{ color: colors.textGray }}>
                    ⏱️ Estimated approval time: {guidelines.estimatedApprovalTime}
                  </AppText>
                </View>
              )}
            </>
          ) : (
            <AppText variant="sm" style={{ color: colors.textGray, padding: spacing.md }}>
              No guidelines available for this category
            </AppText>
          )}
        </View>
      )}
    </AppView>
  );
};
