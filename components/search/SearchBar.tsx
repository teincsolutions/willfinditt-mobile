import { useTheme } from "@/contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { CloseCircle, DirectDown } from "iconsax-react-nativejs";
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
  showFilter?: boolean;
  showSearchButton?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onPressFilter,
  placeholder = "Search...",
  filterValue,
  showFilter = false,
  showSearchButton = true,
  autoFocus = false,
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
      autoFocus={autoFocus}
      leftIcon={
        value.length > 0 ? (
          <CloseCircle
            onPress={() => onChangeText && onChangeText("")}
            size={icons.md}
            color={colors.iconBlack}
          />
        ) : (
          <Feather name="search" size={icons.md} color={colors.iconBlack} />
        )
      }
      rightIcon={
        value.length > 0 && showSearchButton ? (
          <TextButton
            style={{ height: textButton.height - spacing.sm }}
            gradientColors={[colors.primary, colors.secondary]}
            titleStyle={{ color: colors.textWhite }}
            onPress={onSubmit}
            title="Search"
          />
        ) : (
          showFilter && (
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
        )
      }
    />
  );
}
