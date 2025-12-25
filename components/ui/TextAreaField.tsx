// TextAreaField.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

type Props = {
  label?: string;
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
  inputTextStyle?: StyleProp<TextStyle>;
  leftIconStyle?: StyleProp<ViewStyle>;
  rightIconStyle?: StyleProp<ViewStyle>;
  returnKeyLabel?: string;
  numberOfLines?: number;
  autoFocus?: boolean;
  returnKeyType?: import("react-native").ReturnKeyTypeOptions;
  blurOnSubmit?: boolean;
};

const TextAreaField = forwardRef<TextInput, Props>(function TextAreaField(
  {
    label,
    value,
    size = "md",
    onChangeText,
    onSubmit,
    onBlur,
    placeholder,
    numberOfLines,
    secure,
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
    inputTextStyle,
    returnKeyType,
    blurOnSubmit,
  }: Props,
  ref
) {
  const { colors, input, inputSmall, spacing } = useTheme();
  const innerRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => innerRef.current as TextInput);

  const inputSizeStyle = size === "sm" ? inputSmall : input;
  return (
    <View style={style}>
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
            borderRadius: inputSizeStyle.radius,
            paddingHorizontal: spacing.sm,
            alignItems:'flex-start'
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
          multiline
          numberOfLines={numberOfLines || 3}
          blurOnSubmit={blurOnSubmit}
          style={[
            styles.input,
            { color: colors.text, minHeight: 120, alignSelf: 'center', textAlignVertical: 'top' },
            inputTextStyle,
          ]}
          onSubmitEditing={onSubmit}
          onBlur={onBlur}
          autoFocus={autoFocus}
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
  input: { flex: 1, alignItems: "flex-start" },
});

export default TextAreaField;
