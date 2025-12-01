import { useTheme } from "@/contexts/ThemeContext";
import { DirectRight } from "iconsax-react-nativejs";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import AppView from "../ui/AppView";

export default function CategoryCardLandscapeSkeleton() {
  const { colors, spacing, radius, icons } = useTheme();
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
        styles.container,
        {
          backgroundColor: colors.background,
          borderRadius: radius.md,
          padding: spacing.md,
          borderColor: colors.border,
        },
      ]}
    >
      {/* LEFT ICON IMAGE skeleton */}
      <Animated.View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.border,
          opacity: opacity,
        }}
      />

      {/* TEXT CONTENT */}
      <AppView style={{ flex: 1, marginLeft: spacing.md }}>
        {/* TITLE placeholder + COUNT BADGE skeleton */}
        <Animated.View
          style={{
            width: 80,
            height: 20,
            backgroundColor: colors.border,
            borderRadius: 10,
            marginBottom: 4,
            opacity: opacity,
          }}
        />

        {/* DESCRIPTION skeleton */}
        <Animated.View
          style={{
            width: "70%",
            height: 14,
            backgroundColor: colors.border,
            borderRadius: 7,
            opacity: opacity,
          }}
        />
      </AppView>

      {/* RIGHT ARROW */}
      <DirectRight size={icons.md} color={colors.accentRed} />
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
  },
});
