// InputField.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

type Props = {
  label?: string;
  value: string;
  onChangeText?: (t: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  style?: StyleProp<ViewStyle>;
  leftIconStyle?: StyleProp<ViewStyle>;
  rightIconStyle?: StyleProp<ViewStyle>;
};

export default function InputField({
  label,
  value,
  onChangeText,
  onSubmit,
  placeholder,
  secure,
  keyboardType,
  leftIcon,
  rightIcon,
  rightIconStyle,
  leftIconStyle,
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
        {leftIcon && (
          <View style={[{ marginRight: spacing.sm }, leftIconStyle]}>
            {leftIcon}
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secure}
          keyboardType={keyboardType}
          style={[styles.input, { color: colors.text }]}
          onSubmitEditing={onSubmit}
        />

        {rightIcon && (
          <View style={[{ marginLeft: spacing.sm }, rightIconStyle]}>
            {rightIcon}
          </View>
        )}
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
});
