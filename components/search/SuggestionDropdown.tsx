import { useTheme } from "@/contexts/ThemeContext";
import { Suggestion } from "@/types/ad";
import React from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import AppView from "../ui/AppView";
import { SuggestionItem } from "./SuggestionItem";

interface SuggestionDropdownProps {
  data: Suggestion[];
  query: string;
  onSelect?: (item: Suggestion) => void;
}
export default function SuggestionDropdown({
  data,
  query,
  onSelect,
}: SuggestionDropdownProps) {
  const { colors, spacing } = useTheme();

  if (!data.length) return null;

  return (
    <View
      style={{
        backgroundColor: colors.background,
        marginTop: spacing.xs,
      }}
    >
      <FlatList
        data={data}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SuggestionItem
            suggestion={item}
            query={query}
            isRecent
            onPress={() => onSelect && onSelect(item)}
          />
        )}
        ItemSeparatorComponent={() => (
          <AppView style={{ height: 1, backgroundColor: colors.border }} />
        )}
      />
    </View>
  );
}
