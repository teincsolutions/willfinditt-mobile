import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, ViewStyle } from "react-native";
import AppView from "../ui/AppView";

interface Props {
  style?: StyleProp<ViewStyle>;
}

export function ProductCardSmallLandscapeSkeleton({ style }: Props) {
  const { colors, spacing, radius } = useTheme();
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
        styles.wrap,
        {
          backgroundColor: colors.background,
          padding: spacing.md,
          borderRadius: radius.lg,
        },
        style,
      ]}
    >
      {/* IMAGE skeleton */}
      <Animated.View
        style={[
          styles.image,
          {
            borderRadius: radius.md,
            marginRight: spacing.md,
            backgroundColor: colors.border,
            opacity: opacity,
          },
        ]}
      />

      <AppView style={styles.info}>
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
            width: "70%",
            height: 16,
            backgroundColor: colors.border,
            borderRadius: 8,
            opacity: opacity,
          }}
        />

        {/* PRICE skeleton */}
        <Animated.View
          style={{
            width: 60,
            height: 18,
            backgroundColor: colors.border,
            borderRadius: 9,
            marginTop: spacing.xs,
            opacity: opacity,
          }}
        />
      </AppView>

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
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
  },
  info: {
    flex: 1,
  },
});
