import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { formatCurrency } from "@/lib/formatCurrency";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import AppView from "./AppView";

export default function RangeSlider({
  min,
  max,
  low,
  high,
  style,
  onChange,
}: {
  min: number;
  max: number;
  low: number;
  high: number;
  style?: StyleProp<ViewStyle>;
  onChange: (range: { low: number; high: number }) => void;
}) {
  const { colors, spacing, radius } = useTheme();

  const trackWidth = useRef(0);

  const lowX = useRef(new Animated.Value(0)).current;
  const highX = useRef(new Animated.Value(0)).current;

  // Track the actual numeric values
  const lowValue = useRef(low);
  const highValue = useRef(high);

  // Track initial positions when drag starts
  const lowStartX = useRef(0);
  const highStartX = useRef(0);

  // Update positions when low/high change
  useEffect(() => {
    lowValue.current = low;
    highValue.current = high;
    if (trackWidth.current > 0) {
      lowX.setValue(valueToX(low));
      highX.setValue(valueToX(high));
    }
  }, [low, high, min, max]);

  const clamped = (v: number, minV: number, maxV: number) =>
    Math.min(Math.max(v, minV), maxV);

  /** Convert value → X position */
  const valueToX = (value: number) =>
    ((value - min) / (max - min)) * trackWidth.current;

  /** Convert X → value */
  const xToValue = (x: number) =>
    Math.round((x / trackWidth.current) * (max - min) + min);

  const updateRange = () => {
    onChange({
      low: lowValue.current,
      high: highValue.current,
    });
  };

  /** Low thumb pan handler */
  const lowPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Store initial position when drag starts
        lowStartX.current = valueToX(lowValue.current);
      },
      onPanResponderMove: (_, g) => {
        const currentHighX = valueToX(highValue.current);

        // Add delta to the initial position, not the current position
        const newX = clamped(lowStartX.current + g.dx, 0, currentHighX - 20);

        lowValue.current = xToValue(newX);
        lowX.setValue(newX);
        updateRange();
      },
    })
  ).current;

  /** High thumb pan handler */
  const highPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Store initial position when drag starts
        highStartX.current = valueToX(highValue.current);
      },
      onPanResponderMove: (_, g) => {
        const currentLowX = valueToX(lowValue.current);

        // Add delta to the initial position, not the current position
        const newX = clamped(
          highStartX.current + g.dx,
          currentLowX + 20,
          trackWidth.current
        );

        highValue.current = xToValue(newX);
        highX.setValue(newX);
        updateRange();
      },
    })
  ).current;

  /** On first layout set positions */
  const handleLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;

    lowValue.current = low;
    highValue.current = high;
    lowX.setValue(valueToX(low));
    highX.setValue(valueToX(high));
  };

  return (
    <View style={[style]}>
      {/* Track */}
      <View
        onLayout={handleLayout}
        style={{
          height: spacing.md,
          backgroundColor: colors.backgroundPrimary,
          borderRadius: radius.sm,
          marginTop: 40,
        }}
      >
        {/* Selected Track */}
        <Animated.View
          style={{
            position: "absolute",
            left: lowX,
            width: Animated.subtract(highX, lowX),
            height: spacing.md,
            backgroundColor: colors.primary,
            borderRadius: radius.sm,
          }}
        />

        {/* Low Thumb */}
        <Animated.View
          {...lowPan.panHandlers}
          style={{
            position: "absolute",
            top: -spacing.md / 3,
            left: Animated.subtract(lowX, spacing.lg / 2),
            width: spacing.lg,
            height: spacing.lg,
            borderRadius: spacing.lg,
            backgroundColor: colors.background,
            borderWidth: 4,
            borderColor: colors.primary,
          }}
        />

        {/* Low Bubble */}
        <Animated.View
          style={{
            position: "absolute",
            top: -45 - spacing.sm,
            left: Animated.subtract(lowX, 30),
            backgroundColor: colors.primary,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: radius.md,
          }}
        >
          <AppText
            variant="sm"
            style={{ color: colors.textWhite, fontWeight: "700" }}
          >
            {formatCurrency(low, "en-GH", "GHS")}
          </AppText>
          <AppView
            style={{
              height: spacing.md,
              width: spacing.md,
              position: "absolute",
              bottom: -spacing.md / 2,
              zIndex: 100,
              left: "60%",
              transform: [{ rotate: "45deg" }],
              backgroundColor: colors.primary,
            }}
          />
        </Animated.View>

        {/* High Thumb */}
        <Animated.View
          {...highPan.panHandlers}
          style={{
            position: "absolute",
            top: -spacing.md / 3,
            left: Animated.subtract(highX, spacing.lg / 2),
            width: spacing.lg,
            height: spacing.lg,
            borderRadius: spacing.lg,
            backgroundColor: colors.inputBg,
            borderWidth: 4,
            borderColor: colors.primary,
          }}
        />

        {/* High Bubble */}
        <Animated.View
          style={{
            position: "absolute",
            top: -45 - spacing.sm,
            left: Animated.subtract(highX, spacing.md * 2),
            backgroundColor: colors.primary,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: radius.md,
          }}
        >
          <AppText
            variant="sm"
            style={{ color: colors.textWhite, fontWeight: "700" }}
          >
            {formatCurrency(high, "en-GH", "GHS")}
          </AppText>

          <AppView
            style={{
              height: spacing.md,
              width: spacing.md,
              position: "absolute",
              bottom: -spacing.md / 2,
              left: "60%",
              transform: [{ rotate: "45deg" }],
              backgroundColor: colors.primary,
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
}
