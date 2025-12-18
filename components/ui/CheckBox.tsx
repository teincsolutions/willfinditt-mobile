import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
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
  checkboxColor?: string;
  size?: number;
};

export default function CheckBox({
  label,
  description,
  value,
  onValueChange,
  style,
  disabled = false,
  textStyle,
  checkboxColor,
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
      <View style={{ minWidth:"30%", marginRight: spacing.md }}>
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
          borderRadius: 4,
          borderWidth: 2,
          borderColor: value ? checkboxColor || colors.primary : colors.border,
          backgroundColor: value
            ? checkboxColor || colors.primary
            : "transparent",
          alignItems: "center",
          alignSelf: "flex-end",
          justifyContent: "center",
        }}
      >
        {value && (
          <Ionicons
            name="checkmark"
            size={size * 0.75}
            color={colors.iconWhite}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
