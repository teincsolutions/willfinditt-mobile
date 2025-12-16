import AppView from "@/components/ui/AppView";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "../ui/Header";

export default function BusinessProfileSkeleton() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonBox = ({
    width,
    height,
    borderRadius = radius.md,
    style,
  }: {
    width: number | string;
    height: number;
    borderRadius?: number;
    style?: any;
  }) => (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: colors.backgroundGray,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <Header
              backgroundColor={colors.yellow}
              containerStyle={{
                paddingBottom: spacing.md,
                paddingHorizontal: spacing.md,
                paddingTop: insets.top + spacing.md,
              }}
              right={
               <SkeletonBox width={120} height={40} borderRadius={18} />
              }
            />
          ),
        }}
      />
      {/* Header Section */}
      <AppView
        style={{
          backgroundColor: colors.yellow,
          paddingHorizontal: spacing.md,
          paddingBottom: 45 + spacing.lg,
        }}
      >
        {/* Avatar and Name */}
        <AppView
          style={{
            flexDirection: "row",
            marginBottom: spacing.lg,
          }}
        >
          <SkeletonBox width={100} height={100} borderRadius={50} />
          <AppView style={{ marginLeft: spacing.md, flex: 1 }}>
            <SkeletonBox
              width={150}
              height={25}
              style={{ marginTop: spacing.md }}
            />
            <SkeletonBox
              width={100}
              height={16}
              style={{ marginTop: spacing.sm }}
            />

            <AppView
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <SkeletonBox
                width={120}
                height={25}
                style={{ marginTop: spacing.md }}
              />
              {/* Action Buttons */}
              <AppView
                style={{
                  flexDirection: "row",
                  gap: spacing.sm,
                }}
              >
                <SkeletonBox width={50} height={50} borderRadius={50} />
                <SkeletonBox width={50} height={50} borderRadius={50} />
              </AppView>
            </AppView>
          </AppView>
        </AppView>
      </AppView>

      {/* Stats Section */}
      <AppView
        style={{
          backgroundColor: colors.background,
          marginHorizontal: spacing.md,
          marginTop: -55,
          borderRadius: radius.lg,
          padding: spacing.md,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing.md,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {[1, 2, 3, 4].map((item) => (
          <AppView
            key={item}
            style={{
              width: "21%",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <SkeletonBox width={60} height={48} />
            <SkeletonBox width={80} height={24} />
          </AppView>
        ))}
      </AppView>

      {/* Tabs */}
      <AppView
        style={{
          flexDirection: "row",
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
          marginTop: 55,
          marginBottom: spacing.md,
        }}
      >
        {[1, 2, 3, 4].map((item) => (
          <SkeletonBox key={item} width={80} height={36} />
        ))}
      </AppView>

      {/* Product Cards */}
      <AppView
        style={{ flex: 1, paddingHorizontal: spacing.md, gap: spacing.sm }}
      >
        {[1, 2, 3].map((item) => (
          <AppView
            key={item}
            style={{
              flexDirection: "row",
              backgroundColor: colors.backgroundSecondary,
              borderRadius: radius.md,
              padding: spacing.sm,
              gap: spacing.sm,
            }}
          >
            <SkeletonBox width={100} height={100} />
            <AppView style={{ flex: 1, gap: spacing.xs }}>
              <SkeletonBox width="80%" height={18} />
              <SkeletonBox width="60%" height={16} />
              <SkeletonBox width="40%" height={20} />
              <AppView
                style={{
                  flexDirection: "row",
                  gap: spacing.xs,
                  marginTop: spacing.xs,
                }}
              >
                <SkeletonBox width={60} height={24} />
                <SkeletonBox width={60} height={24} />
              </AppView>
            </AppView>
          </AppView>
        ))}
      </AppView>
    </AppView>
  );
}
