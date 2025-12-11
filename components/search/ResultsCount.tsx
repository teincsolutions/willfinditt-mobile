import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Pressable } from "react-native";

interface ResultsCountProps {
  totalResults: number;
  activeFiltersCount: number;
  onClearAll: () => void;
}

export default function ResultsCount({
  totalResults,
  activeFiltersCount,
  onClearAll,
}: ResultsCountProps) {
  const { colors, spacing } = useTheme();

  return (
    <AppView
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        marginTop: spacing.md,
      }}
    >
      <AppText variant="md" style={{ color: colors.textGray }}>
        {totalResults} {totalResults === 1 ? "result" : "results"} found
      </AppText>
      {activeFiltersCount > 0 && (
        <Pressable onPress={onClearAll}>
          <AppText variant="md" style={{ color: colors.primary }}>
            Clear all ({activeFiltersCount})
          </AppText>
        </Pressable>
      )}
    </AppView>
  );
}
