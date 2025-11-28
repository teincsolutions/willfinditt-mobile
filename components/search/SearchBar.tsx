import { useTheme } from "@/contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { DirectDown } from "iconsax-react-nativejs";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import InputField from "../ui/InputField";
import { TextButton } from "../ui/TextButton";

interface SearchBarProps {
  value: string;
  onChangeText?: (t: string) => void;
  onSubmit?: () => void;
  onPressFilter?: () => void;
  filterValue?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onPressFilter,
  placeholder = "Search...",
  filterValue,
  style,
}: SearchBarProps) {
  const { colors, icons, spacing, textButton } = useTheme();

  return (
    <InputField
      style={style}
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      size="sm"
      onSubmit={onSubmit}
      leftIcon={
        <Feather name="search" size={icons.md} color={colors.iconBlack} />
      }
      rightIcon={
        value.length > 0 ? (
          <TextButton
            style={{ height: textButton.height - spacing.sm }}
            gradientColors={[colors.primary, colors.secondary]}
            titleStyle={{ color: colors.textWhite }}
            onPress={onSubmit}
            title="Search"
          />
        ) : (
          <TextButton
            style={{ height: textButton.height - spacing.sm }}
            gradientColors={[colors.primary, colors.secondary]}
            titleStyle={{ color: colors.textWhite }}
            title={filterValue || "All"}
            icon={
              <DirectDown
                variant="Bold"
                size={icons.sm}
                color={colors.iconWhite}
              />
            }
            onPress={onPressFilter}
          />
        )
      }
    />
  );
}
