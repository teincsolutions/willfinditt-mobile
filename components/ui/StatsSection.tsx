import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AppText from "./AppText";

export interface StatItem {
  label: string;
  value: number | string;
  color?: string;
}

interface StatsSectionProps {
  title?: string;
  stats: StatItem[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
}

export default function StatsSection({
  title = "Statistics",
  stats,
  isLoading = false,
  columns = 2,
}: StatsSectionProps) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.statsSection,
        {
          backgroundColor: colors.background,
          padding: spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {title && (
        <AppText
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: spacing.md,
          }}
        >
          {title}
        </AppText>
      )}

      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View
              key={index}
              style={[
                styles.statItem,
                {
                  flex: 1,
                  width: `${100 / columns - 2}%`,
                  alignItems: "center",
                },
              ]}
            >
              <AppText
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: stat.color || colors.text,
                }}
              >
                {stat.value}
              </AppText>
              <AppText
                style={{
                  fontSize: 12,
                  color: colors.textGray,
                  marginTop: 4,
                  textAlign: "center",
                }}
              >
                {stat.label}
              </AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statsSection: {},
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statItem: {},
});
