import { useTheme } from "@/contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";

export function SelectButton({
  active,
  onToggle,
}: {
  active?: boolean;
  onToggle?: (active: boolean) => void;
}) {
  const { icons, colors, spacing } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [active]);

  return (
    <Pressable
      onPress={() => onToggle && onToggle(!active)}
      style={{
        position: "absolute",
        top: spacing.sm,
        left: spacing.sm,
        zIndex: 1,
      }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {active ? (
          <View
            style={{
              height: icons.md,
              width: icons.md,
              backgroundColor: colors.primary,
              borderRadius: icons.md,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="check" color={colors.iconWhite} size={icons.xs} />
          </View>
        ) : (
          <View
            style={{
              height: icons.md,
              width: icons.md,
              borderWidth: 2,
              borderColor: colors.border,
              borderRadius: icons.md,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}
      </Animated.View>
    </Pressable>
  );
}
