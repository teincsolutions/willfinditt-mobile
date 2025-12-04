import { SearchBar } from "@/components/search/SearchBar";
import SearchEmptyState from "@/components/search/SearchEmptyState";
import SuggestionDropdown from "@/components/search/SuggestionDropdown";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

export default function SearchScreen() {
  const { colors, spacing } = useTheme();
  const [query, setQuery] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          header: () => (
            <Header
              containerStyle={{
                paddingHorizontal: spacing.md,
                backgroundColor: colors.background,
              }}
            >
              <SearchBar
                value={query}
                onChangeText={setQuery}
                onSubmit={() => {}}
                onPressFilter={() => router.push("/search/filters")}
                autoFocus
              />
            </Header>
          ),
        }}
      />
      {query.length === 0 && suggestions.length > 0 && (
        <SuggestionDropdown
          data={suggestions}
          query={query}
          onSelect={(item) => setQuery(item.keyword)}
        />
      )}

      {/* EMPTY STATE */}
      {query.length > 0 && suggestions.length === 0 && <SearchEmptyState />}
    </View>
  );
}
