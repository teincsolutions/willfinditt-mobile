import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import InputField from "@/components/ui/InputField";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import { Pressable, View } from "react-native";

interface PriceRangeFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min?: number, max?: number) => void;
  currency?: string;
}

export default function PriceRangeFilter({
  minPrice,
  maxPrice,
  onPriceChange,
  currency = "GHS",
}: PriceRangeFilterProps) {
  const { colors, spacing, radius } = useTheme();
  const [localMin, setLocalMin] = useState(minPrice?.toString() || "");
  const [localMax, setLocalMax] = useState(maxPrice?.toString() || "");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = () => {
    const min = localMin ? parseFloat(localMin) : undefined;
    const max = localMax ? parseFloat(localMax) : undefined;
    onPriceChange(min, max);
    setIsExpanded(false);
  };

  const handleClear = () => {
    setLocalMin("");
    setLocalMax("");
    onPriceChange(undefined, undefined);
  };

  const hasValue = minPrice || maxPrice;

  return (
    <AppView>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radius.lg,
          backgroundColor: hasValue ? colors.primary : colors.background,
          borderWidth: 1,
          borderColor: hasValue ? colors.primary : colors.border,
          gap: spacing.xs,
        }}
      >
        <AppText
          variant="sm"
          style={{
            color: hasValue ? colors.textWhite : colors.text,
            fontWeight: hasValue ? "600" : "400",
          }}
        >
          {hasValue
            ? `${currency} ${minPrice || 0} - ${maxPrice || "∞"}`
            : "Price Range"}
        </AppText>
      </Pressable>

      {isExpanded && (
        <AppView
          style={{
            marginTop: spacing.sm,
            padding: spacing.md,
            backgroundColor: colors.backgroundPrimary,
            borderRadius: radius.md,
            gap: spacing.md,
          }}
        >
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <InputField
              placeholder="Min"
              value={localMin}
              onChangeText={setLocalMin}
              keyboardType="numeric"
              size="sm"
              style={{ flex: 1 }}
            />
            <AppText
              variant="md"
              style={{ alignSelf: "center", color: colors.textGray }}
            >
              -
            </AppText>
            <InputField
              placeholder="Max"
              value={localMax}
              onChangeText={setLocalMax}
              keyboardType="numeric"
              size="sm"
              style={{ flex: 1 }}
            />
          </View>

          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <Pressable
              onPress={handleClear}
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                borderRadius: radius.md,
                backgroundColor: colors.background,
                alignItems: "center",
              }}
            >
              <AppText variant="sm" style={{ color: colors.text }}>
                Clear
              </AppText>
            </Pressable>
            <Pressable
              onPress={handleApply}
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                borderRadius: radius.md,
                backgroundColor: colors.primary,
                alignItems: "center",
              }}
            >
              <AppText variant="sm" style={{ color: colors.textWhite }}>
                Apply
              </AppText>
            </Pressable>
          </View>
        </AppView>
      )}
    </AppView>
  );
}
