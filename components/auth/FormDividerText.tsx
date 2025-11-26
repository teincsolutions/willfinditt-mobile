// FormDividerText.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../ui/AppText";

type Props = {
  text: string;
};

export default function FormDividerText({ text }: Props) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.row, { marginVertical: spacing.md }]}>
      <View style={[styles.line, { borderBottomColor: colors.border }]} />
      <AppText style={styles.text}>{text}</AppText>
      <View style={[styles.line, { borderBottomColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  line: { flex: 1, borderBottomWidth: 1 },
  text: { marginHorizontal: 8 },
});
