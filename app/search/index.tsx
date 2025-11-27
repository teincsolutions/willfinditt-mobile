import RecentSearches from "@/components/search/RecentSearches";
import SearchBar from "@/components/search/SearchBar";
import SearchEmptyState from "@/components/search/SearchEmptyState";
import SearchSuggestions from "@/components/search/SearchSuggestions";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState(["Nike hoodie", "iPhone 12", "Car seats"]);
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (text: string) => {
    setQuery(text);

    if (text.length === 0) {
      setSuggestions([]);
      return;
    }

    // Mock suggestions
    const all = ["Nike hoodie", "Nike shoes", "Nikon Camera", "Nintendo Switch"];
    setSuggestions(all.filter((i) => i.toLowerCase().includes(text.toLowerCase())));
  };

  const handleSubmit = () => {
    if (!query.trim()) return;

    setHistory((prev) => [query, ...prev]);
    setSuggestions([]);
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        value={query}
        onChangeText={handleChange}
        onSubmit={handleSubmit}
        onPressFilter={() => {}}
      />

      <ScrollView>
        {/* RECENT SEARCHES */}
        {query.length === 0 && history.length > 0 && (
          <RecentSearches items={history} onSelect={(item) => setQuery(item)} />
        )}

        {/* SUGGESTIONS */}
        {query.length > 0 && suggestions.length > 0 && (
          <SearchSuggestions suggestions={suggestions} onSelect={(item) => setQuery(item)} />
        )}

        {/* EMPTY STATE */}
        {query.length > 0 && suggestions.length === 0 && (
          <SearchEmptyState />
        )}
      </ScrollView>
    </View>
  );
}
