// CountryCodePicker.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import AppText from "./AppText";

type Props = {
  code: string;
  flag: string;
  onPress: () => void;
};

export default function CountryCodePicker({ code, flag, onPress }: Props) {
  const { spacing } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { paddingRight: spacing.sm }]}
    >
      <AppText>{flag}</AppText>
      <AppText style={{ marginLeft: 6 }}>{code}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
});
