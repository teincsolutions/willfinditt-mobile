import { useTheme } from "@/contexts/ThemeContext";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { StyleSheet } from "react-native";
import AppView from "../ui/AppView";
import IconButton from "../ui/IconButton";

export default function DrawerHeaderRight({
  onPressLocation,
}: {
  onPressLocation?: () => void;
}) {
  const { colors, spacing, icons } = useTheme();

  return (
    <AppView style={[styles.row, { gap: spacing.sm, marginEnd: spacing.md }]}>
      <IconButton
        onPress={onPressLocation}
        icon={<Feather name="map-pin" size={icons.md} color={colors.text} />}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
});
