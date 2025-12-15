import { useTheme } from "@/contexts/ThemeContext";
import { Image } from "expo-image";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import IconButton from "./IconButton";

export function FavouriteButton({
  active,
  onToggle,
}: {
  active?: boolean;
  onToggle?: (active: boolean) => void;
}) {
  const { icons, colors } = useTheme();
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
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <IconButton
        onPress={() => onToggle && onToggle(!active)}
        icon={
          active ? (
            <Image
              style={{ height: icons.md, width: icons.md }}
              source={require("@/assets/icons/heart-filled.png")}
            />
          ) : (
            <Image
              style={{ height: icons.md, width: icons.md }}
              source={require("@/assets/icons/heart-outline.png")}
            />
          )
        }
      />
    </Animated.View>
  );
}
