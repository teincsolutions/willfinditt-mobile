import FilterChip from "@/components/ui/FilterChip";
import { useTheme } from "@/contexts/ThemeContext";
import { AdCondition } from "@/types";
import { Location, Sort } from "iconsax-react-nativejs";
import React from "react";
import { ScrollView } from "react-native";

interface HorizontalFiltersProps {
  selectedSortValue: string;
  selectedCondition?: AdCondition;
  minPrice?: number;
  maxPrice?: number;
  selectedCityId?: string;
  onPriceFilterPress: () => void;
  onSortPress: () => void;
  onLocationPress: () => void;
  onConditionPress?: () => void;
}

export default function HorizontalFilters({
  selectedSortValue,
  selectedCondition,
  minPrice,
  maxPrice,
  selectedCityId,
  onSortPress,
  onPriceFilterPress,
  onLocationPress,
  onConditionPress,
}: HorizontalFiltersProps) {
  const { colors, spacing, icons } = useTheme();

  const getSortLabel = () => {
    switch (selectedSortValue) {
      case "recent":
        return "Recent";
      case "oldest":
        return "Oldest";
      case "price_asc":
        return "Price ↑";
      case "price_desc":
        return "Price ↓";
      case "popular":
        return "Popular";
      default:
        return "Recent";
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
        marginTop: spacing.md,
      }}
    >
      {/* Sort Filter */}
      <FilterChip
        label={`Sort: ${getSortLabel()}`}
        selected={selectedSortValue !== "recent"}
        onPress={onSortPress}
        icon={
          <Sort
            size={icons.sm}
            color={
              selectedSortValue !== "recent"
                ? colors.iconWhite
                : colors.iconBlack
            }
          />
        }
      />
      {/* Condition Filter */}
      <FilterChip
        icon={
          <Sort
            size={icons.sm}
            color={selectedCondition ? colors.iconWhite : colors.iconBlack}
          />
        }
        label={selectedCondition || "Condition"}
        selected={!!selectedCondition}
        onPress={onConditionPress}
      />

      {/* Price Range Filter */}
      <FilterChip
        label={
          minPrice || maxPrice
            ? `Price: ${minPrice || 0} - ${maxPrice || "∞"}`
            : "Price Range"
        }
        selected={!!minPrice || !!maxPrice}
        onPress={onPriceFilterPress}
      />

      {/* Location Filter */}
      <FilterChip
        label="Location"
        selected={!!selectedCityId}
        onPress={onLocationPress}
        icon={
          <Location
            size={icons.sm}
            color={selectedCityId ? colors.iconWhite : colors.iconBlack}
          />
        }
      />
    </ScrollView>
  );
}
