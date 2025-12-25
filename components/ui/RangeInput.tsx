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
import RangeSlider from "./RangeSlider";

type Props = {
  label?: string;
  minValue?: string;
  maxValue?: string;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  onMinChange?: (t: string) => void;
  onMaxChange?: (t: string) => void;
  onMinBlur?: (e: any) => void;
  onMaxBlur?: (e: any) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  keyboardType?: KeyboardTypeOptions;
  minError?: string;
  maxError?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
};

export default function RangeInput({
  label,
  minValue,
  maxValue,
  min = 0,
  max = undefined,
  size = "md",
  onMinChange,
  onMaxChange,
  onMinBlur,
  onMaxBlur,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  keyboardType = "numeric",
  minError,
  maxError,
  style,
  inputStyle,
}: Props) {
  const { colors, input, inputSmall, spacing } = useTheme();

  const inputSizeStyle = size === "sm" ? inputSmall : input;
  const hasError = minError || maxError;

  return (
    <View style={style}>
      {label && (
        <AppText variant="sm" style={{ marginBottom: spacing.sm }}>
          {label}
        </AppText>
      )}

      {maxValue && minValue && (
        <RangeSlider
          min={min}
          max={max || 100000}
          low={Number(minValue)}
          high={Number(maxValue)}
          onChange={({ low, high }) => {
            onMinChange?.(low.toString());
            onMaxChange?.(high.toString());
          }}
          style={{
            width: "100%",
            paddingHorizontal: spacing.md,
            marginBottom: spacing.md,
            marginTop: spacing.md,
            marginHorizontal: "auto",
          }}
        />
      )}

      <View
        style={[
          styles.rangeContainer,
          {
            gap: spacing.sm,
          },
        ]}
      >
        {/* Min Input */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.inputBg,
              borderColor: minError ? colors.error : colors.border,
              height: inputSizeStyle.height,
              borderRadius: inputSizeStyle.radius,
              paddingHorizontal: inputSizeStyle.paddingHorizontal,
            },
            inputStyle,
          ]}
        >
          <TextInput
            value={minValue}
            onChangeText={onMinChange}
            placeholder={minPlaceholder}
            placeholderTextColor={colors.placeholder}
            keyboardType={keyboardType}
            style={[styles.input, { color: colors.text }]}
            onBlur={onMinBlur}
          />
        </View>

        {/* Separator */}
        <AppText variant="md" style={{ alignSelf: "center" }}>
          -
        </AppText>

        {/* Max Input */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.inputBg,
              borderColor: maxError ? colors.error : colors.border,
              height: inputSizeStyle.height,
              borderRadius: inputSizeStyle.radius,
              paddingHorizontal: inputSizeStyle.paddingHorizontal,
            },
            inputStyle,
          ]}
        >
          <TextInput
            value={maxValue}
            onChangeText={onMaxChange}
            placeholder={maxPlaceholder}
            placeholderTextColor={colors.placeholder}
            keyboardType={keyboardType}
            style={[styles.input, { color: colors.text }]}
            onBlur={onMaxBlur}
          />
        </View>
      </View>

      {/* Error Messages */}
      {hasError && (
        <View style={{ marginTop: spacing.xs }}>
          {minError && (
            <AppText variant="sm" style={{ color: colors.error }}>
              {minError}
            </AppText>
          )}
          {maxError && (
            <AppText variant="sm" style={{ color: colors.error }}>
              {maxError}
            </AppText>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rangeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    textAlign: "center",
  },
});
