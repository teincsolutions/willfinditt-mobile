import RecentSearches from "@/components/search/RecentSearches";
import { SearchBar } from "@/components/search/SearchBar";
import SearchEmptyState from "@/components/search/SearchEmptyState";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/hooks/useTheme";
import { Suggestion } from "@/types";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

export default function SearchScreen() {
  const { colors, spacing } = useTheme();
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<Suggestion[]>([
    {
      id: "1",
      keyword: "iPhone 12",
      product_id: "some_id",
      category_field_id: "some_id",
      category_id: "some_category_id",
      is_recent: true,
    },
    {
      id: "2",
      keyword: "Samsung Galaxy",
      product_id: "some_id",
      category_field_id: "some_id",
      category_id: "some_category_id",
      is_recent: true,
    },
    {
      id: "3",
      keyword: "MacBook Pro",
      product_id: "some_id",
      category_field_id: "some_id",
      category_id: "some_category_id",
      is_recent: true,
    },
  ]);
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (text: string) => {
    setQuery(text);

    if (text.length === 0) {
      setSuggestions([]);
      return;
    }
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    setSuggestions([]);
  };

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
                onChangeText={handleChange}
                onSubmit={handleSubmit}
                onPressFilter={() => {}}
              />
            </Header>
          ),
        }}
      />
      {query.length === 0 && history.length > 0 && (
        <RecentSearches
          data={history}
          query={query}
          onSelect={(item) => setQuery(item.keyword)}
        />
      )}

      {/* EMPTY STATE */}
      {query.length > 0 && suggestions.length === 0 && <SearchEmptyState />}
    </View>
  );
}
