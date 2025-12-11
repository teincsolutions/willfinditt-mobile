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
  value?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onClear?: () => void;
}

export function SearchBarPlaceholder({
  onPressFilter,
  placeholder = "Search...",
  filterValue,
  value,
  style,
  onClear,
  onPress,
}: SearchBarPlaceholderProps) {
  const { colors, icons, spacing, textButton } = useTheme();

  return (
    <PlaceholderField
      onPress={onPress}
      style={[{maxHeight: 40},style]}
      value={value}
      placeholder={placeholder}
      numberOfLines={1}
      size="sm"
      leftIcon={
        value?.length ? (
          <Feather onPress={onClear} name="x-circle" size={icons.md} color={colors.iconBlack} />
        ) : (
          <Feather name="search" size={icons.md} color={colors.iconBlack} />
        )
      }
      rightIcon={
        <TextButton
          style={{ height: textButton.height - spacing.sm, maxWidth: 120 }}
          gradientColors={[colors.primary, colors.secondary]}
          titleStyle={{ color: colors.textWhite }}
          numberOfLines={1}
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
