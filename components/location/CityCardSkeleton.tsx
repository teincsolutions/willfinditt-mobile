import { useTheme } from "@/hooks/useTheme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function CityCardSkeleton() {
  const { colors, input } = useTheme();

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
          borderRadius: input.radius,
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

      {/* Check Circle Skeleton */}
      <View
        style={[
          styles.circleSkeleton,
          {
            backgroundColor: colors.border,
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
  circleSkeleton: {
    width: 24,
    height: 24,
  },
});
