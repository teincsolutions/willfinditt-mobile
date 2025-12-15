import { useTheme } from "@/contexts/ThemeContext";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import AppText from "./AppText";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface TabItem {
  key: string;
  title: string;
  count?: number;
}
export interface TabDataset<T> {
  key: string;
  data: T[];
}

interface SwipeableTabsProps<T> {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  data: TabDataset<T>[];
  renderItem: (info: { item: T; index: number }) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  ListEmptyComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  refreshControl?: any;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: any;
}

export default function SwipeableTabs<T>({
  tabs,
  activeTab,
  onTabChange,
  data,
  renderItem,
  keyExtractor,
  ListEmptyComponent,
  ListFooterComponent,
  onEndReached,
  onEndReachedThreshold,
  refreshControl,
  ListHeaderComponent,
  contentContainerStyle,
}: SwipeableTabsProps<T>) {
  const { colors, spacing } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(
    tabs.findIndex((tab) => tab.key === activeTab)
  );

  const handleTabPress = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    onTabChange(tabs[index].key);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const index = viewableItems[0].index;
        setCurrentIndex(index);
        onTabChange(tabs[index].key);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Memoized render function for tab content
  const renderTabContent = useCallback(
    ({ item: tabDataset }: { item: { key: string; data: T[] } }) => (
      <View style={{ width: SCREEN_WIDTH, height: "100%" }}>
        <FlatList
          data={tabDataset.data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
          onEndReached={onEndReached}
          onEndReachedThreshold={onEndReachedThreshold}
          refreshControl={refreshControl}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    ),
    [
      keyExtractor,
      renderItem,
      ListEmptyComponent,
      ListFooterComponent,
      onEndReached,
      onEndReachedThreshold,
      refreshControl,
      contentContainerStyle,
    ]
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Optional Header */}
      {ListHeaderComponent}

      {/* Tab Headers */}
      <ScrollView
        horizontal
        style={[
          styles.tabHeader,
          {
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
        ]}
      >
        {tabs.map((tab, index) => {
          const isActive = currentIndex === index;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                {
                  flex: 1,
                  padding: spacing.md,
                  borderBottomWidth: isActive ? 2 : 0,
                  borderBottomColor: colors.primary,
                },
              ]}
              onPress={() => handleTabPress(index)}
            >
              <AppText
                style={{
                  fontSize: 14,
                  fontWeight: isActive ? "600" : "400",
                  color: isActive ? colors.primary : colors.textGray,
                  textAlign: "center",
                }}
              >
                {tab.title}
                {tab.count !== undefined && ` (${tab.count})`}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Swipeable Content */}
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        bounces={false}
        renderItem={renderTabContent}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabHeader: {
    flexDirection: "row",
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
  },
});
