import { useTheme } from "@/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

type Props = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
};

export default function IconButton({ onPress, style, icon }: Props) {
  const { icons, iconButton, colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          height: iconButton.size,
          width: iconButton.size,
          borderRadius: iconButton.radius,
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      {icon ? (
        icon
      ) : (
        <Entypo
          name="chevron-with-circle-left"
          color={colors.iconBlack}
          size={icons.md}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});
