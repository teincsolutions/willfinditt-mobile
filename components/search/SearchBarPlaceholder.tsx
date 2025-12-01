import { useTheme } from "@/contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { Location } from "iconsax-react-nativejs";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import PlaceholderField from "../ui/PlaceholderField";
import { TextButton } from "../ui/TextButton";

interface SearchBarPlaceholderProps {
  onPressFilter?: () => void;
  filterValue?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function SearchBarPlaceholder({
  onPressFilter,
  placeholder = "Search...",
  filterValue,
  style,
  onPress,
}: SearchBarPlaceholderProps) {
  const { colors, icons, spacing, textButton } = useTheme();

  return (
    <PlaceholderField
      onPress={onPress}
      style={style}
      placeholder={placeholder}
      size="sm"
      leftIcon={
        <Feather name="search" size={icons.md} color={colors.iconBlack} />
      }
      rightIcon={
        <TextButton
          style={{ height: textButton.height - spacing.sm }}
          gradientColors={[colors.primary, colors.secondary]}
          titleStyle={{ color: colors.textWhite }}
          title={filterValue || "Ghana"}
          icon={
            <Location variant="Bold" size={icons.sm} color={colors.iconWhite} />
          }
          onPress={onPressFilter}
        />
      }
    />
  );
}
