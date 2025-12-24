// InputField.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
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
  rightLabel?: string;
  value: string;
  size?: "sm" | "md";
  onChangeText?: (t: string) => void;
  onSubmit?: () => void;
  onBlur?: (e: any) => void;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string | boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  leftIconStyle?: StyleProp<ViewStyle>;
  rightIconStyle?: StyleProp<ViewStyle>;
  returnKeyLabel?: string;
  autoFocus?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?:'off' | 'username' | 'password' | 'email' | 'name' | 'tel' | 'street-address' | 'postal-code' | 'cc-number' | 'cc-csc' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year';
  returnKeyType?:'done' | 'go' | 'next' | 'search' | 'send';
  blurOnSubmit?: boolean;
};

const InputField = forwardRef<TextInput, Props>(function InputField(
  {
    label,
    rightLabel,
    value,
    size = "md",
    onChangeText,
    onSubmit,
    onBlur,
    placeholder,
    secure,
    autoCapitalize,
    keyboardType,
    leftIcon,
    rightIcon,
    returnKeyLabel,
    rightIconStyle,
    leftIconStyle,
    error,
    style,
    autoFocus,
    inputStyle,
    returnKeyType,
    blurOnSubmit,
    autoComplete,
  }: Props,
  ref
) {
  const { colors, input, inputSmall, spacing } = useTheme();
  const innerRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => innerRef.current as TextInput);

  const inputSizeStyle = size === "sm" ? inputSmall : input;
  return (
    <View style={style}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {label && (
          <AppText variant="sm" style={{ marginBottom: spacing.sm }}>
            {label}
          </AppText>
        )}

        {rightLabel && (
          <AppText
            variant="sm"
            style={{ marginBottom: spacing.sm, color: colors.purple }}
          >
            {rightLabel}
          </AppText>
        )}     
      </View>

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            height: inputSizeStyle.height,
            borderRadius: inputSizeStyle.radius,
            paddingHorizontal: inputSizeStyle.paddingHorizontal,
          },
          inputStyle,
        ]}
      >
        {leftIcon && (
          <View style={[{ marginRight: spacing.sm }, leftIconStyle]}>
            {leftIcon}
          </View>
        )}

        <TextInput
          ref={innerRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          returnKeyLabel={returnKeyLabel}
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
          style={[styles.input, { color: colors.text }]}
          onSubmitEditing={onSubmit}
          onBlur={onBlur}
          autoFocus={autoFocus}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          editable={true}
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
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  input: { flex: 1 },
});

export default InputField;
