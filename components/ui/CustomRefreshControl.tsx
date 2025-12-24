import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppView from "./AppView";

interface CustomRefreshControlProps {
  refreshing: boolean;
  onRefresh: () => void;
  size?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center";
}

export default function CustomRefreshControl({
  refreshing,
  size = 24,
  position = "top-right",
}: CustomRefreshControlProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const getPositionStyle = () => {
    const base = {
      position: "absolute" as const,
      zIndex: 1000,
    };

    switch (position) {
      case "top-right":
        return { ...base, top: 20, right: 20 };
      case "top-left":
        return { ...base, top: 20, left: 20 };
      case "bottom-right":
        return { ...base, bottom: 20, right: 20 };
      case "bottom-left":
        return { ...base, bottom: 20, left: 20 };
      case "top-center":
        return { ...base, top: insets.top + 10, left: 0, right: 0, alignItems: "center" };
      default:
        return { ...base, top: 20, right: 20 };
    }
  };

  return refreshing ? (
    <AppView style={[getPositionStyle(), { alignItems: "center" }]}>
      <AppView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size={size} color={colors.primary} />
      </AppView>
    </AppView>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
