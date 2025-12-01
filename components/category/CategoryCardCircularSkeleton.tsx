import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import AppView from "../ui/AppView";

interface CategoryCardCircularSkeletonProps {
  styleContainer?: StyleProp<ViewStyle>;
}

export function CategoryCardCircularSkeleton({
  styleContainer,
}: CategoryCardCircularSkeletonProps) {
  const { colors, avatarSize, spacing } = useTheme();

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
      style={[styles.avatarWrapper, styleContainer, { opacity: fadeAnim }]}
    >
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          borderRadius: avatarSize.xl,
        }}
      >
        <View
          style={[
            {
              width: avatarSize.lg,
              height: avatarSize.lg,
              borderRadius: avatarSize.lg,
              padding: 2,
              backgroundColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <View
            style={{
              width: avatarSize.lg,
              height: avatarSize.lg,
              borderRadius: avatarSize.lg,
              backgroundColor: colors.border,
            }}
          />
        </View>
      </LinearGradient>

      <AppView
        style={{
          width: "100%",
          height: spacing.md,
          marginTop: spacing.sm,
          backgroundColor: colors.border,
          borderRadius: 7,
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    position: "relative",
    alignItems: "center",
  },
});
