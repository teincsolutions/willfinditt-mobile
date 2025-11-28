import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { Suggestion } from "@/types/ad";
import React from "react";
import { StyleSheet, View } from "react-native";

interface RecentSearchesProps {
  data: Suggestion[];
  onSelect?: (item: Suggestion) => void;
}
export default function RecentSearches({
  data,
  onSelect,
}: RecentSearchesProps) {
  const { spacing, colors } = useTheme();

  if (!data.length) return null;

  return (
    <View style={{ marginTop: spacing.xl, paddingHorizontal: spacing.lg }}>
      <AppText style={[{ marginBottom: spacing.md }]}>
        Recent Searches
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: 1,
  },
});
