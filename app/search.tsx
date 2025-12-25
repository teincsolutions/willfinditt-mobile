import RecentSearches from "@/components/search/RecentSearches";
import { SearchBar } from "@/components/search/SearchBar";
import SearchEmptyState from "@/components/search/SearchEmptyState";
import SuggestionDropdown from "@/components/search/SuggestionDropdown";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import IconButton from "@/components/ui/IconButton";
import { useInfiniteSavedAds, useSearchSuggestions } from "@/hooks/useAds";
import { useRecentSearch } from "@/hooks/useRecentSearch";
import { useTheme } from "@/hooks/useTheme";
import { Ad, Suggestion } from "@/types";
import { router, Stack } from "expo-router";
import { Filter } from "iconsax-react-nativejs";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, View } from "react-native";

export default function SearchScreen() {
  const { colors, spacing, icons } = useTheme();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Recent searches from local storage
  const { recentSearches, addRecent } = useRecentSearch();

  // Search suggestions from API (using the hook from useAds.ts)
  const { data: searchSuggestions = [], isLoading: isSuggestionsLoading } =
    useSearchSuggestions(
      {
        query: debouncedQuery,
        limit: 10,
      },
      debouncedQuery.length > 0
    );

  // Recent saved ads
  const { data: savedAdsData, isLoading: isSavedAdsLoading } =
    useInfiniteSavedAds({ limit: 10 });

  // Debounce query for API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Flatten saved ads for display
  const savedAds: Ad[] =
    savedAdsData?.pages?.flatMap((page) => page.data || []) || [];

  // Handle search submission
  const handleSearchSubmit = () => {
    if (!query.trim()) return;

    // Add to recent searches
    const suggestion: Suggestion = {
      id: `search-${Date.now()}`,
      keyword: query,
      productId: "",
      categoryId: "",
      categoryFieldId: "",
      isRecent: true,
    };
    addRecent(suggestion);

    // Navigate to search results
    router.push({
      pathname: "/results",
      params: { query },
    });
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setQuery(suggestion.keyword);
    addRecent(suggestion);

    // Navigate to search results
    router.push({
      pathname: "/results",
      params: { query: suggestion.keyword },
    });
  };

  // Handle recent search selection
  const handleRecentSearchSelect = (suggestion: Suggestion) => {
    setQuery(suggestion.keyword);
    addRecent(suggestion);

    // Navigate to search results
    router.push({
      pathname: "/results",
      params: { query: suggestion.keyword },
    });
  };

  // Handle saved ad selection
  const handleSavedAdPress = (ad: Ad) => {
    router.push(`/ads/${ad.id}`);
  };

  // Show loading for suggestions
  const showSuggestionsLoading =
    isSuggestionsLoading && debouncedQuery.length > 0;

  // Show suggestions when query exists
  const showSuggestions = query.length > 0 && searchSuggestions.length > 0;

  // Show empty state when query exists but no suggestions
  const showEmptyState =
    query.length > 0 &&
    !isSuggestionsLoading &&
    searchSuggestions.length === 0 &&
    debouncedQuery === query;

  // Show recent searches when no query
  const showRecentSearches = query.length === 0 && recentSearches.length > 0;

  // Show recent saved ads when no query
  const showRecentSaved = query.length === 0 && savedAds.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <IconButton
              onPress={() => router.push("/filters")}
              icon={<Filter size={icons.md} />}
            />
          ),
        }}
      />
      <SearchBar
        style={{ marginHorizontal: spacing.md, marginTop: spacing.md }}
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSearchSubmit}
        onPressFilter={() => router.push("/filters")}
        onClear={() => {
          setQuery("");
        }}
        autoFocus
      />

      {/* LOADING STATE FOR SUGGESTIONS */}
      {showSuggestionsLoading && (
        <View
          style={{
            padding: spacing.lg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      {/* SEARCH SUGGESTIONS */}
      {showSuggestions && (
        <SuggestionDropdown
          data={searchSuggestions.map((s) => ({
            id: s.id,
            keyword: s.title,
            productId: s.id,
            categoryId: s.categoryId,
            categoryFieldId: "",
            isRecent: false,
          }))}
          query={query}
          onSelect={handleSuggestionSelect}
        />
      )}

      {/* EMPTY STATE */}
      {showEmptyState && <SearchEmptyState />}

      {/* RECENT SEARCHES AND SAVED ADS (when not searching) */}
      {query.length === 0 && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: spacing.lg }}
        >
          {/* RECENT SEARCHES */}
          {showRecentSearches && (
            <View style={{ marginTop: spacing.xs }}>
              <AppText
                style={{
                  marginVertical: spacing.md,
                  fontWeight: "bold",
                  marginHorizontal: spacing.md,
                }}
              >
                Recent Searches
              </AppText>
              <FlatList
                data={recentSearches}
                scrollEnabled={false}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View>
                    {/* Using SuggestionItem directly would be better but reusing SuggestionDropdown logic */}
                    <SuggestionDropdown
                      data={[item]}
                      query=""
                      onSelect={handleRecentSearchSelect}
                    />
                  </View>
                )}
                ItemSeparatorComponent={() => (
                  <AppView
                    style={{ height: 1, backgroundColor: colors.border }}
                  />
                )}
              />
            </View>
          )}

          {/* RECENT SAVED ADS */}
          {showRecentSaved && (
            <RecentSearches
              data={savedAds}
              query={query}
              onAdPress={handleSavedAdPress}
            />
          )}

          {/* LOADING MORE SAVED ADS */}
          {isSavedAdsLoading && (
            <View
              style={{
                padding: spacing.lg,
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
