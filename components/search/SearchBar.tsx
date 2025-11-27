import { useTheme } from "@/contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ArrowDirect } from "react-native-iconsax";
import InputField from "../ui/InputField";
import { TextButton } from "../ui/TextButton";

interface SearchBarProps {
  value: string;
  onChangeText?: (t: string) => void;
  onSubmit?: () => void;
  onPressFilter: () => void;
  filterValue?: string;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  filterValue,
}: SearchBarProps) {
  const { colors, icons, spacing } = useTheme();

  return (
    <InputField
      onChangeText={onChangeText}
      value={value}
      onSubmit={onSubmit}
      leftIcon={
        <Feather name="search" size={icons.md} color={colors.iconBlack} />
      }
      rightIcon={
        value.length > 0 ? (
          <TextButton onPress={onSubmit} title="Search" />
        ) : (
          <TextButton
            title={filterValue || "All"}
            icon={
              <ArrowDirect
                variant="Bold"
                size={icons.md}
                color={colors.iconWhite}
              />
            }
          />
        )
      }
      rightIconStyle={{ padding: spacing.xs }}
      leftIconStyle={{ padding: spacing.xs }}
    />
  );
}
