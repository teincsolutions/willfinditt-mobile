// HeaderBack.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "../ui/AppText";

type Props = {
  onPress: () => void;
  title?: string;
};

export default function HeaderBack({ onPress, title }: Props) {
  const { spacing } = useTheme();

  return (
    <View style={[styles.row, { padding: spacing.md }]}>
      <Pressable onPress={onPress} style={styles.button}>
        <AppText>{"<"}</AppText>
      </Pressable>

      {title && (
        <AppText variant="lg" style={styles.title}>
          {title}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  button: { paddingRight: 12 },
  title: { marginLeft: 8 },
});
