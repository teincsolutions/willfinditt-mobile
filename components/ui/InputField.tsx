// InputField.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { KeyboardTypeOptions, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import AppText from "./AppText";

type Props = {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  style?: ViewStyle;
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
  style,
}: Props) {
  const { colors, input, spacing } = useTheme();

  return (
    <View style={[style]}>
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
