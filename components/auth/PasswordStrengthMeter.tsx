// PasswordStrengthMeter.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  strength: 0 | 1 | 2 | 3;
};

export default function PasswordStrengthMeter({ strength }: Props) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.row, { marginTop: spacing.sm }]}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              backgroundColor: colors.primary,
              opacity: strength > i ? 1 : 0.2,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6 },
  bar: { flex: 1, height: 6, borderRadius: 3 },
});
