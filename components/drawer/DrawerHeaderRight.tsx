import { useTheme } from "@/contexts/ThemeContext";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import AppView from "../ui/AppView";
import IconButton from "../ui/IconButton";

export default function DrawerHeaderRight() {
  const { colors, spacing, icons } = useTheme();

  return (
    <AppView style={[styles.row, { gap: spacing.sm, marginEnd: spacing.md }]}>
      <IconButton
        onPress={() => {
          router.push({ pathname: "/notifications" });
        }}
        icon={<Feather name="bell" size={icons.md} color={colors.text} />}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
});
