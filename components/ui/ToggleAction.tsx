import { useTheme } from "@/contexts/ThemeContext";
import { DirectDown, DirectUp } from "iconsax-react-nativejs";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import SecondaryTextButton from "../ui/SecondaryTextButton";

export function ToggleAction({
  showAllText,
  showFewerText,
  style,
  toggle,
  icon,
  showIcon = true,
  toggleColor,
  onToggle,
}: {
  style?: StyleProp<ViewStyle>;
  toggle?: boolean;
  showAllText?: string;
  showFewerText?: string;
  icon?: React.ReactNode;
  toggleColor?: string;
  showIcon?: boolean;
  onToggle?: (showAll: boolean) => void;
}) {
  const { colors, icons } = useTheme();

  return (
    <View style={style}>
      {toggle ? (
        <SecondaryTextButton
          variant="lg"
          icon={
            showIcon &&
            (icon || (
              <DirectUp
                variant="Bold"
                color={colors.iconBlack}
                size={icons.sm}
              />
            ))
          }
          onPress={() => onToggle && onToggle(!toggle)}
          title={showFewerText || "See fewer"}
          titleStyle={{ color: toggleColor || colors.text }}
        />
      ) : (
        <SecondaryTextButton
          variant="lg"
          icon={
            showIcon && (
              <DirectDown
                variant="Bold"
                color={toggleColor || colors.iconBlack}
                size={icons.sm}
              />
            )
          }
          onPress={() => onToggle && onToggle(!toggle)}
          titleStyle={{ color: toggleColor || colors.text }}
          title={showAllText || "See all"}
        />
      )}
    </View>
  );
}
