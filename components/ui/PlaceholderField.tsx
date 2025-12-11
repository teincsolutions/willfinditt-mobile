import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";
import AppView from "./AppView";

type Props = {
  label?: string;
  rightLabel?: string;
  value?: string;
  size?: "sm" | "md";
  placeholder?: string;
  secure?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightIconStyle?: StyleProp<ViewStyle>;
  leftIconStyle?: StyleProp<ViewStyle>;
  error?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export default function PlaceholderField({
  label,
  value,
  size = "md",
  placeholder,
  numberOfLines,
  leftIcon,
  rightIcon,
  rightIconStyle,
  leftIconStyle,
  style,
  inputStyle,
  rightLabel,
  onPress,
}: Props) {
  const { colors, input, inputSmall, spacing } = useTheme();

  const inputSizeStyle = size === "sm" ? inputSmall : input;
  return (
    <AppView style={style}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {label && (
          <AppText variant="sm" style={{ marginBottom: spacing.sm }}>
            {label}
          </AppText>
        )}

        {rightLabel && (
          <AppText variant="sm" style={{ marginBottom: spacing.sm, color:colors.purple }}>
            {rightLabel}
          </AppText>
        )}
      </View>

      <Pressable
        onPress={onPress}
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
          <AppView style={[{ marginRight: spacing.sm }, leftIconStyle]}>
            {leftIcon}
          </AppView>
        )}

        <AppText
          variant="md"
          numberOfLines={numberOfLines}
          style={[
            styles.input,
            { color: value ? colors.text : colors.placeholder },
          ]}
        >
          {value || placeholder}
        </AppText>

        {rightIcon && (
          <AppView style={[{ marginLeft: spacing.sm }, rightIconStyle]}>
            {rightIcon}
          </AppView>
        )}
      </Pressable>
    </AppView>
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
