import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { Suggestion } from "@/types/ads";
import React from "react";
import { StyleSheet, View } from "react-native";

interface RecentSearchesProps {
  items: Suggestion;
  onSelect?: (item: Suggestion) => void;
}
export default function RecentSearches({
  items,
  onSelect,
}: RecentSearchesProps) {
  const { spacing, colors } = useTheme();

  if (!items.length) return null;

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
