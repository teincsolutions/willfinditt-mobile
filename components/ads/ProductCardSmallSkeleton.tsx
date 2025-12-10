import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export function ProductCardSmallSkeleton() {
  const { radius, card, colors } = useTheme();
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
    <View
      style={[
        { width: 120 },
        {
          padding: card.padding,
          gap: card.gap,
          borderRadius: card.radius,
        },
      ]}
    >
      {/* IMAGE skeleton */}
      <Animated.View
        style={{
          width: 120,
          height: 90,
          borderRadius: radius.md,
          backgroundColor: colors.border,
          opacity: opacity,
        }}
      />
      
      {/* PRICE skeleton */}
      <Animated.View
        style={{
          width: 80,
          height: 16,
          borderRadius: 8,
          backgroundColor: colors.border,
          marginTop: 4,
          opacity: opacity,
        }}
      />
    </View>
  );
}
