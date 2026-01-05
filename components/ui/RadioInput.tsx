import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
    StyleProp,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import AppText from "./AppText";

type Props = {
  label?: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
  radioColor?: string;
  size?: number;
};

export default function RadioInput({
  label,
  description,
  value,
  onValueChange,
  style,
  disabled = false,
  textStyle,
  radioColor,
  size = 24,
}: Props) {
  const { colors, spacing } = useTheme();

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: spacing.sm,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <View style={{ minWidth: "30%", marginRight: spacing.md }}>
        {label && (
          <AppText
            variant="md"
            style={[{ marginBottom: spacing.xs }, textStyle]}
          >
            {label}
          </AppText>
        )}
        {description && (
          <AppText
            variant="sm"
            style={[{ opacity: 0.6, color: colors.textGray }, textStyle]}
          >
            {description}
          </AppText>
        )}
      </View>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: value ? radioColor || colors.primary : colors.border,
          backgroundColor: "transparent",
          alignItems: "center",
          alignSelf: "flex-end",
          justifyContent: "center",
        }}
      >
        {value && (
          <View
            style={{
              width: size * 0.5,
              height: size * 0.5,
              borderRadius: (size * 0.5) / 2,
              backgroundColor: radioColor || colors.primary,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
