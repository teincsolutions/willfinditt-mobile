import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";
import InputField from "./InputField";
import { Pill } from "./Pill";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SearchableSelectModalProps {
  visible: boolean;
  onClose: () => void;
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onSelect: (value: string | number | (string | number)[]) => void;
  multiple?: boolean;
  title?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  style?: StyleProp<ViewStyle>;
}

export default function SearchableSelectModal({
  visible,
  onClose,
  options,
  value,
  onSelect,
  multiple = false,
  title = "Select Option",
  placeholder = "Search...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  style,
}: SearchableSelectModalProps) {
  const { colors, spacing, radius } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] =
    useState<SelectOption[]>(options);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchQuery, options]);

  const handleSelect = (optionValue: string | number) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.includes(optionValue);

      if (isSelected) {
        // Remove from selection
        const newValues = currentValues.filter((v) => v !== optionValue);
        onSelect(newValues);
      } else {
        // Add to selection
        onSelect([...currentValues, optionValue]);
      }
    } else {
      // Single select - close modal after selection
      onSelect(optionValue);
      onClose();
    }
  };

  const isSelected = (optionValue: string | number): boolean => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const getSelectedLabels = (): string[] => {
    if (multiple && Array.isArray(value)) {
      return value
        .map((v) => options.find((opt) => opt.value === v)?.label)
        .filter(Boolean) as string[];
    }
    return [];
  };

  const handleDone = () => {
    onClose();
  };

  const handleClearAll = () => {
    if (multiple) {
      onSelect([]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={[
            {
              backgroundColor: colors.background,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              maxHeight: "80%",
              paddingBottom: spacing.xl,
            },
            style,
          ]}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
              paddingBottom: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <AppText variant="lg" style={{ fontWeight: "600" }}>
              {title}
            </AppText>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Selected Items Pills (Multiple Mode) */}
          {multiple && getSelectedLabels().length > 0 && (
            <View
              style={{
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.md,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: spacing.sm,
                }}
              >
                <AppText variant="sm" style={{ color: colors.textGray }}>
                  Selected ({getSelectedLabels().length})
                </AppText>
                <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
                  <AppText
                    variant="sm"
                    style={{ color: colors.primary, fontWeight: "600" }}
                  >
                    Clear All
                  </AppText>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: spacing.sm,
                }}
              >
                {getSelectedLabels().map((label, index) => (
                  <Pill key={index} item={label} />
                ))}
              </View>
            </View>
          )}

          {/* Search Input */}
          <View
            style={{
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.md,
              paddingBottom: spacing.sm,
            }}
          >
            <InputField
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={searchPlaceholder}
              leftIcon={
                <Ionicons name="search" size={20} color={colors.placeholder} />
              }
              rightIcon={
                searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={colors.placeholder}
                    />
                  </TouchableOpacity>
                ) : undefined
              }
            />
          </View>

          {/* Options List */}
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value.toString()}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
            }}
            renderItem={({ item }) => {
              const selected = isSelected(item.value);
              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <AppText
                    variant="md"
                    style={{
                      flex: 1,
                      color: selected ? colors.primary : colors.text,
                      fontWeight: selected ? "600" : "400",
                    }}
                  >
                    {item.label}
                  </AppText>
                  {selected && (
                    <Ionicons
                      name={multiple ? "checkbox" : "checkmark-circle"}
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View
                style={{
                  paddingVertical: spacing.xl,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={colors.textGray}
                  style={{ marginBottom: spacing.md }}
                />
                <AppText
                  variant="md"
                  style={{ color: colors.textGray, textAlign: "center" }}
                >
                  {emptyMessage}
                </AppText>
              </View>
            }
          />

          {/* Done Button (Multiple Mode) */}
          {multiple && (
            <View
              style={{
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.md,
              }}
            >
              <TouchableOpacity
                onPress={handleDone}
                activeOpacity={0.8}
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: spacing.md,
                  borderRadius: radius.md,
                  alignItems: "center",
                }}
              >
                <AppText
                  variant="md"
                  style={{ color: colors.iconWhite, fontWeight: "600" }}
                >
                  Done
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
