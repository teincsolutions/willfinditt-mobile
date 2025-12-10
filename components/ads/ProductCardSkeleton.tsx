import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleProp, StyleSheet, ViewStyle } from "react-native";
import AppView from "../ui/AppView";

const { width: DEVICE_WIDTH } = Dimensions.get("window");

export default function ProductCardSkeleton({
  style,
}: {
  style?: StyleProp<ViewStyle>;
}) {
  const { spacing, radius, colors } = useTheme();
  const width = (DEVICE_WIDTH - spacing.md * 2 - spacing.xs) / 2;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <AppView
      style={[
        styles.card,
        {
          borderRadius: radius.lg,
          width: width,
          marginBottom: spacing.sm,
          backgroundColor: colors.background,
          borderColor: colors.border,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {/* IMAGE skeleton */}
      <Animated.View
        style={{
          height: 150,
          width: "100%",
          backgroundColor: colors.border,
          opacity: opacity,
        }}
      />

      {/* CONTENT */}
      <AppView style={{ padding: spacing.md, gap: spacing.xs }}>
        {/* TITLE skeleton - two lines */}
        <Animated.View
          style={{
            width: "90%",
            height: 16,
            backgroundColor: colors.border,
            borderRadius: 8,
            marginBottom: 4,
            opacity: opacity,
          }}
        />
        <Animated.View
          style={{
            width: "60%",
            height: 16,
            backgroundColor: colors.border,
            borderRadius: 8,
            opacity: opacity,
          }}
        />

        {/* PRICE skeleton */}
        <AppView style={[styles.row, { marginTop: spacing.xs }]}>
          <Animated.View
            style={{
              width: 70,
              height: 20,
              backgroundColor: colors.border,
              borderRadius: 10,
              opacity: opacity,
            }}
          />
          {/* HEART skeleton */}
          <Animated.View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: colors.border,
              opacity: opacity,
            }}
          />
        </AppView>
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    position: "relative",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
