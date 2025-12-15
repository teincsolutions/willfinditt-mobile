import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
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
  style?: StyleProp<ViewStyle>;
}

export default function StatsSection({
  title = "Statistics",
  stats,
  isLoading = false,
  columns = 2,
  style,
}: StatsSectionProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.statsSection,
        {
          padding: spacing.lg,
          borderRadius: radius.xl,
          backgroundColor: colors.brown,
          marginHorizontal: spacing.md,
          zIndex: 1,
        },
        style,
      ]}
    >
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
                  justifyContent: "space-between",
                },
              ]}
            >
              <AppText
                variant="sm"
                style={{
                  color: colors.textWhite,
                  marginTop: 4,
                  textAlign: "center",
                }}
              >
                {stat.label}
              </AppText>

              <AppText
                variant="xl"
                style={{
                  fontWeight: "700",
                  color: colors.textWhite,
                }}
              >
                {stat.value}
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
