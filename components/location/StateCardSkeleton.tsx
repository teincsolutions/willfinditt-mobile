import { useTheme } from "@/hooks/useTheme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function StateCardSkeleton() {
  const { colors, spacing, input, radius} = useTheme();

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.inputBg,
          borderColor: colors.border,
          borderWidth: 1,
          height: input.height,
          borderRadius: radius.sm,
          paddingHorizontal: input.paddingHorizontal,
          opacity: fadeAnim,
        },
      ]}
    >
      {/* Text Skeleton */}
      <View
        style={[
          styles.textSkeleton,
          {
            backgroundColor: colors.border,
            borderRadius: 4,
          },
        ]}
      />

      {/* Icon Skeleton */}
      <View
        style={[
          styles.iconSkeleton,
          {
            backgroundColor: colors.border,
            borderRadius: 4,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textSkeleton: {
    flex: 1,
    height: 16,
    marginRight: 12,
  },
  iconSkeleton: {
    width: 20,
    height: 20,
  },
});
