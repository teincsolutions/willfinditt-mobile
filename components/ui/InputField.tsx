// InputField.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import AppText from "./AppText";

type Props = {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: any;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
};

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
  keyboardType,
  leftIcon,
  rightIcon,
  error,
}: Props) {
  const { colors, input, spacing } = useTheme();

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label && (
        <AppText variant="sm" style={{ marginBottom: spacing.sm }}>
          {label}
        </AppText>
      )}

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            height: input.height,
            borderRadius: input.radius,
            paddingHorizontal: input.paddingHorizontal,
          },
        ]}
      >
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secure}
          keyboardType={keyboardType}
          style={[styles.input, { color: colors.text }]}
        />

        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>

      {error && <AppText style={{ color: colors.error }}>{error}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  input: { flex: 1 },
  icon: { marginRight: 8 },
});
