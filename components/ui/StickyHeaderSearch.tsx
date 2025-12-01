// components/layout/StickyHeaderSearch.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React, { useMemo, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RenderItem<T> = ({
  item,
  index,
}: {
  item: T;
  index: number;
}) => React.ReactElement;

export interface StickyHeaderSearchProps<T> {
  /** title component shown above the search (collapses) */
  titleComponent: React.ReactNode;
  /** search component that will become sticky */
  searchComponent: React.ReactNode;
  /** data for flatlist */
  data: T[];
  /** render item */
  renderItem: RenderItem<T>;
  /** optional flatlist props */
  keyExtractor?: (item: T, index: number) => string;
  numColumns?: number;
  /** optional header above both title+search (not sticky) */
  topHeader?: React.ReactNode;
  /** content container style */
  contentContainerStyle?: any;
  /** additional props passed to Animated.FlatList */
  flatListProps?: any;
  /** height of the title area (so animation calculations are exact). default 120 */
  titleHeight?: number;
  /** height of search bar (default 72) */
  searchHeight?: number;
}

export function StickyHeaderSearch<T = any>({
  titleComponent,
  searchComponent,
  data,
  renderItem,
  keyExtractor,
  numColumns = 1,
  topHeader,
  contentContainerStyle,
  flatListProps,
  titleHeight = 72,
  searchHeight = 72,
}: StickyHeaderSearchProps<T>) {
  const inserts = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { spacing } = useTheme();

  // animate value when scroll changes
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  // clamp the animated value between 0 and titleHeight for smoother interpolation
  const translateY = scrollY.interpolate({
    inputRange: [0, titleHeight],
    outputRange: [0, -titleHeight],
    extrapolate: "clamp",
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, titleHeight * 0.6, titleHeight],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  // stickyHeaderIndices: index of the search bar in ListHeaderComponent
  // We will build ListHeaderComponent as:
  // [ optional topHeader, titleContainer, searchContainer ]
  const headerChildren = useMemo(() => {
    const children: React.ReactNode[] = [];
    if (topHeader) children.push(topHeader);
    // title container (animated)
    children.push(
      <Animated.View
        key="title"
        style={[
          styles.titleContainer,
          {
            height: titleHeight,
            paddingHorizontal: spacing.md,
            justifyContent: "center",
          },
          { transform: [{ translateY }], opacity },
        ]}
      >
        {titleComponent}
      </Animated.View>
    );

    // search container (non-animated in header, but will be sticky)
    children.push(
      <View
        key="search"
        style={[
          styles.searchContainer,
          {
            height: searchHeight,
            paddingHorizontal: spacing.md,
            justifyContent: "center",
          },
        ]}
      >
        {searchComponent}
      </View>
    );

    return children;
  }, [
    topHeader,
    titleComponent,
    searchComponent,
    translateY,
    opacity,
    spacing.md,
    titleHeight,
    searchHeight,
  ]);

  // Build ListHeaderComponent wrapper to feed to FlatList
  const ListHeaderComponent = () => {
    return <View>{headerChildren}</View>;
  };

  return (
    <Animated.FlatList
      {...flatListProps}
      data={data}
      keyExtractor={keyExtractor as any}
      renderItem={renderItem as any}
      numColumns={numColumns}
      ListHeaderComponent={ListHeaderComponent}
      stickyHeaderIndices={[0]}
      onScroll={onScroll}
      scrollEventThrottle={16}
      contentContainerStyle={[
        { paddingBottom: 48, paddingTop: inserts.top },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    // title area styling placeholder — the titleComponent will handle typography
    backgroundColor: "transparent",
  },
  searchContainer: {
    backgroundColor: "transparent",
    // we want search bar to visually overlap content below while sticky,
    // so keep it opaque. searchComponent should have its own background.
  },
});
