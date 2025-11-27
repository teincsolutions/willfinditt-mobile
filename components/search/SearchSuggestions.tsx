import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface SearchSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function SearchSuggestions({
  suggestions,
  onSelect,
}: SearchSuggestionsProps) {
  const { colors, spacing, radius, shadows } = useTheme();

  if (!suggestions.length) return null;

  return (
    <View
      style={[
        {
          backgroundColor: colors.background,
          marginHorizontal: spacing.lg,
          borderRadius: radius.md,
          marginTop: spacing.sm,
          paddingVertical: spacing.sm,
          shadowColor: shadows.shadowColor,
          shadowOpacity: shadows.shadowOpacity,
          shadowRadius: shadows.shadowRadius,
          elevation: shadows.elevation,
        },
      ]}
    >
      {suggestions.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={[
            {
              borderBottomWidth: 1,
              borderColor: colors.border,
              padding: spacing.md,
            },
          ]}
          onPress={() => onSelect(item)}
        >
          <AppText>{item}</AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
}
