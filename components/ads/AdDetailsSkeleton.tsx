import AppView from "@/components/ui/AppView";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";

const { width: DEVICE_WIDTH } = Dimensions.get("window");

export default function AdDetailsSkeleton() {
  const { spacing, radius, colors } = useTheme();
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
    <AppView style={{ backgroundColor: colors.backgroundGray }}>
      {/* Main Section */}
      <AppView
        style={{
          gap: spacing.lg,
          paddingBottom: spacing.lg,
          backgroundColor: colors.background,
          marginBottom: spacing.md,
        }}
      >
        {/* Image Carousel Skeleton */}
        <Animated.View
          style={{
            height: 300,
            width: "100%",
            backgroundColor: colors.border,
            opacity: opacity,
          }}
        />

        {/* Ad Info Block Skeleton */}
        <AppView style={{ paddingHorizontal: spacing.md, gap: spacing.sm }}>
          {/* Title skeleton - two lines */}
          <Animated.View
            style={{
              width: "90%",
              height: 24,
              backgroundColor: colors.border,
              borderRadius: 8,
              opacity: opacity,
            }}
          />
          <Animated.View
            style={{
              width: "70%",
              height: 24,
              backgroundColor: colors.border,
              borderRadius: 8,
              opacity: opacity,
            }}
          />

          {/* Price skeleton */}
          <Animated.View
            style={{
              width: 120,
              height: 32,
              backgroundColor: colors.border,
              borderRadius: 8,
              marginTop: spacing.sm,
              opacity: opacity,
            }}
          />

          {/* Location and date row skeleton */}
          <AppView
            style={{
              flexDirection: "row",
              gap: spacing.md,
              marginTop: spacing.sm,
            }}
          >
            <Animated.View
              style={{
                width: 100,
                height: 16,
                backgroundColor: colors.border,
                borderRadius: 8,
                opacity: opacity,
              }}
            />
            <Animated.View
              style={{
                width: 80,
                height: 16,
                backgroundColor: colors.border,
                borderRadius: 8,
                opacity: opacity,
              }}
            />
          </AppView>
        </AppView>

        {/* Seller Rating Skeleton */}
        <AppView
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: spacing.md,
            gap: spacing.sm,
          }}
        >
          <Animated.View
            style={{
              width: 100,
              height: 20,
              backgroundColor: colors.border,
              borderRadius: 10,
              opacity: opacity,
            }}
          />
          <Animated.View
            style={{
              width: 80,
              height: 16,
              backgroundColor: colors.border,
              borderRadius: 8,
              opacity: opacity,
            }}
          />
        </AppView>

        {/* Product Attributes Skeleton */}
        <AppView style={{ paddingHorizontal: spacing.md, gap: spacing.md }}>
          <Animated.View
            style={{
              width: 150,
              height: 20,
              backgroundColor: colors.border,
              borderRadius: 10,
              opacity: opacity,
            }}
          />
          {[1, 2, 3].map((item) => (
            <AppView
              key={item}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Animated.View
                style={{
                  width: 100,
                  height: 16,
                  backgroundColor: colors.border,
                  borderRadius: 8,
                  opacity: opacity,
                }}
              />
              <Animated.View
                style={{
                  width: 120,
                  height: 16,
                  backgroundColor: colors.border,
                  borderRadius: 8,
                  opacity: opacity,
                }}
              />
            </AppView>
          ))}
        </AppView>

        {/* Description Skeleton */}
        <AppView style={{ paddingHorizontal: spacing.md, gap: spacing.sm }}>
          <Animated.View
            style={{
              width: 120,
              height: 20,
              backgroundColor: colors.border,
              borderRadius: 10,
              opacity: opacity,
            }}
          />
          {[1, 2, 3, 4, 5].map((item) => (
            <Animated.View
              key={item}
              style={{
                width: item === 5 ? "60%" : "100%",
                height: 16,
                backgroundColor: colors.border,
                borderRadius: 8,
                opacity: opacity,
              }}
            />
          ))}
        </AppView>
      </AppView>

      {/* Seller Profile Section Skeleton */}
      <AppView
        style={{
          backgroundColor: colors.background,
          padding: spacing.md,
          gap: spacing.lg,
        }}
      >
        {/* Seller Profile Skeleton */}
        <AppView
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <Animated.View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: colors.border,
              opacity: opacity,
            }}
          />
          <AppView style={{ flex: 1, gap: spacing.xs }}>
            <Animated.View
              style={{
                width: "60%",
                height: 18,
                backgroundColor: colors.border,
                borderRadius: 9,
                opacity: opacity,
              }}
            />
            <Animated.View
              style={{
                width: "40%",
                height: 14,
                backgroundColor: colors.border,
                borderRadius: 7,
                opacity: opacity,
              }}
            />
          </AppView>
        </AppView>

        {/* More From Seller Title Skeleton */}
        <Animated.View
          style={{
            width: 150,
            height: 20,
            backgroundColor: colors.border,
            borderRadius: 10,
            opacity: opacity,
          }}
        />

        {/* More From Seller Items Skeleton */}
        <AppView style={{ flexDirection: "row", gap: spacing.sm }}>
          {[1, 2].map((item) => (
            <Animated.View
              key={item}
              style={{
                width: (DEVICE_WIDTH - spacing.md * 3) / 2,
                height: 200,
                backgroundColor: colors.border,
                borderRadius: radius.lg,
                opacity: opacity,
              }}
            />
          ))}
        </AppView>
      </AppView>
    </AppView>
  );
}
