import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { useTheme } from "@/contexts/ThemeContext";
import { TickCircle } from "iconsax-react-nativejs";
import React from "react";
import { Modal, Pressable, ScrollView } from "react-native";

export interface SortOption {
  label: string;
  value: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: string;
  onSelectSort: (option: SortOption) => void;
}

const SORT_OPTIONS: SortOption[] = [
  { label: "Most Recent", value: "recent", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Oldest First", value: "oldest", sortBy: "createdAt", sortOrder: "asc" },
  { label: "Price: Low to High", value: "price_asc", sortBy: "price", sortOrder: "asc" },
  { label: "Price: High to Low", value: "price_desc", sortBy: "price", sortOrder: "desc" },
  { label: "Most Popular", value: "popular", sortBy: "views", sortOrder: "desc" },
];

export default function SortModal({
  visible,
  onClose,
  selectedSort,
  onSelectSort,
}: SortModalProps) {
  const { colors, spacing, radius, icons } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: colors.backgroundPrimary,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            maxHeight: "70%",
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <AppView
            style={{
              padding: spacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <AppText variant="xl" style={{ fontWeight: "600" }}>
              Sort By
            </AppText>
          </AppView>

          <ScrollView
            style={{ maxHeight: 400 }}
            showsVerticalScrollIndicator={false}
          >
            {SORT_OPTIONS.map((option) => {
              const isSelected = selectedSort === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onSelectSort(option);
                    onClose();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.lg,
                    backgroundColor: isSelected
                      ? colors.background
                      : "transparent",
                  }}
                >
                  <AppText
                    variant="md"
                    style={{
                      color: isSelected ? colors.primary : colors.text,
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    {option.label}
                  </AppText>
                  {isSelected && (
                    <TickCircle
                      size={icons.md}
                      color={colors.primary}
                      variant="Bold"
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export { SORT_OPTIONS };

