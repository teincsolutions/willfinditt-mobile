// PrimaryButton.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export default function PrimaryButton({
  title,
  onPress,
  style,
  titleStyle,
  disabled,
  backgroundColor,
  loading,
}: Props) {
  const { colors, button, spacing } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[{ gap: spacing.md }]}
    >
      <LinearGradient
        colors={
          backgroundColor
            ? [backgroundColor, backgroundColor]
            : [colors.primary, colors.accent]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.btn,
          {
            height: button.height,
            borderRadius: button.radius,
            paddingHorizontal: button.paddingHorizontal,
            opacity: isDisabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        <AppText
          variant="lg"
          style={[
            {
              color: colors.textWhite,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            },
            titleStyle,
          ]}
        >
          {title}
        </AppText>
        {loading && <ActivityIndicator size="small" color={colors.iconGray} />}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
