import { useTheme } from "@/contexts/ThemeContext";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
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
  onRefresh?: () => void;
  onEndReachedThreshold?: number;
  refreshControl?: any;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  tabScrollStyle?: StyleProp<ViewStyle>;
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
  onRefresh,
  refreshControl,
  ListHeaderComponent,
  contentContainerStyle,
  tabScrollStyle,
  style,
}: SwipeableTabsProps<T>) {
  const { colors, spacing, radius } = useTheme();
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
      <View style={{ width: SCREEN_WIDTH }}>
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
    <ScrollView  style={[{ flex: 1 }, style]}>
      {/* Optional Header */}
      {ListHeaderComponent}

      {/* Tab Headers */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabHeader, tabScrollStyle]}
        contentContainerStyle={[
          { columnGap: spacing.sm, paddingHorizontal: spacing.md },
        ]}
      >
        {tabs.map((tab, index) => {
          const isActive = currentIndex === index;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.5}
              style={[
                styles.tab,
                {
                  flex: 1,
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  backgroundColor: isActive ? colors.yellow : "transparent",
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: isActive ? colors.yellow : colors.border,
                },
              ]}
              onPress={() => handleTabPress(index)}
            >
              <AppText
                style={{
                  fontSize: 14,
                  fontWeight: isActive ? "600" : "400",
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
        style={{ marginTop: spacing.md }}
        contentContainerStyle={{ flexGrow: 1 }}
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
    flex: 1,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
  },
});
