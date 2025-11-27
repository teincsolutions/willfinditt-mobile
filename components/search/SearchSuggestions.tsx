import AppText from "@/components/AppText/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function SearchSuggestions({ suggestions, onSelect }) {
  const { colors, spacing, radius } = useTheme();

  if (!suggestions.length) return null;

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.white,
          marginHorizontal: spacing.lg,
          borderRadius: radius.md,
          marginTop: spacing.sm,
          paddingVertical: spacing.sm,
        },
      ]}
    >
      {suggestions.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.item, { padding: spacing.md }]}
          onPress={() => onSelect(item)}
        >
          <AppText>{item}</AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  item: {
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
});
