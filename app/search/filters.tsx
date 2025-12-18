import { SelectableListSheet } from "@/components/bottom-sheet/SelectableBottomSheet";
import SheetRadioOptionItem from "@/components/bottom-sheet/SheetRadioOptionItem";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import IconButton from "@/components/ui/IconButton";
import { Pill } from "@/components/ui/Pill";
import PlaceholderField from "@/components/ui/PlaceholderField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import RangeInput from "@/components/ui/RangeInput";
import { TextButton } from "@/components/ui/TextButton";
import { useCategory } from "@/hooks/useCategories";
import { useLocationSelection } from "@/hooks/useLocationSelection";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { useTheme } from "@/hooks/useTheme";
import { AdCondition } from "@/types";
import { Feather } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";

const conditionOptions = [
  { id: AdCondition.NEW, name: "New", value: AdCondition.NEW },
  { id: AdCondition.LIKE_NEW, name: "Like New", value: AdCondition.LIKE_NEW },
  { id: AdCondition.GOOD, name: "Good", value: AdCondition.GOOD },
  { id: AdCondition.FAIR, name: "Fair", value: AdCondition.FAIR },
  { id: AdCondition.POOR, name: "Poor", value: AdCondition.POOR },
];

const sortOptions = [
  { id: "createdAt-desc", name: "Newest First", value: "createdAt-desc" },
  { id: "createdAt-asc", name: "Oldest First", value: "createdAt-asc" },
  { id: "price-asc", name: "Price: Low to High", value: "price-asc" },
  { id: "price-desc", name: "Price: High to Low", value: "price-desc" },
  { id: "title-asc", name: "Title: A to Z", value: "title-asc" },
  { id: "title-desc", name: "Title: Z to A", value: "title-desc" },
];

export default function FiltersScreen() {
  const { colors, spacing, radius, icons, fontSizes } = useTheme();
  const conditionSheetRef = useRef<BottomSheet>(null);
  const sortSheetRef = useRef<BottomSheet>(null);

  const {
    filters,
    categoryId,
    cityId,
    activeFiltersCount,
    setConditions,
    setPriceRange,
    setSorting,
    clearFilterOptions,
  } = useSearchFilters();

  // Fetch category name if categoryId exists
  const { data: category } = useCategory(categoryId || "");
  
  // Get selected city from location selection
  const { selectedCity } = useLocationSelection();

  // Local state for conditions (array for multiple selection)
  const [selectedConditions, setSelectedConditions] = React.useState<
    AdCondition[]
  >(filters?.conditions || []);

  // Local state for price range
  const [priceRange, setPriceRangeLocal] = React.useState({
    low: filters?.priceMin || 0,
    high: filters?.priceMax || 100000,
  });

  // Local state for sort
  const [selectedSort, setSelectedSort] = React.useState(
    `${filters?.sortBy || "createdAt"}-${filters?.sortOrder || "desc"}`
  );

  // Update local state when filters change
  useEffect(() => {
    setSelectedConditions(filters?.conditions || []);
    setPriceRangeLocal({
      low: filters?.priceMin || 0,
      high: filters?.priceMax || 100000,
    });
    setSelectedSort(
      `${filters?.sortBy || "createdAt"}-${filters?.sortOrder || "desc"}`
    );
  }, [filters]);

  const handleOpenCategory = () => {
    router.push({
      pathname: "/search/categories",
      params: { source: "filters" },
    });
  };

  const handleOpenLocation = () => {
    router.push({
      pathname: "/search/locations/regions",
      params: { source: "filters" },
    });
  };

  const handleToggleCondition = (condition: AdCondition) => {
    setSelectedConditions((prev) => {
      if (prev.includes(condition)) {
        return prev.filter((c) => c !== condition);
      } else {
        return [...prev, condition];
      }
    });
  };

  const handleApplyFilters = () => {
    // Apply conditions
    setConditions(
      selectedConditions.length > 0 ? selectedConditions : undefined
    );

    // Apply price range (only if not default values)
    if (priceRange.low !== 0 || priceRange.high !== 100000) {
      setPriceRange(
        priceRange.low > 0 ? priceRange.low : undefined,
        priceRange.high < 100000 ? priceRange.high : undefined
      );
    } else {
      setPriceRange(undefined, undefined);
    }

    // Apply sorting
    const [sortBy, sortOrder] = selectedSort.split("-");
    setSorting(sortBy, sortOrder as "asc" | "desc");

    // Navigate back to results
    router.back();
  };

  const handleResetFilters = () => {
    clearFilterOptions();
    setSelectedConditions([]);
    setPriceRangeLocal({ low: 0, high: 100000 });
    setSelectedSort("createdAt-desc");
  };

  return (
    <>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: spacing.md,
        }}
      >
        {/* Category Filter */}
        <AppView style={{ marginBottom: spacing.lg }}>
          <PlaceholderField
            onPress={handleOpenCategory}
            placeholder="Select a category"
            label="Category"
            rightLabel={categoryId ? "Change" : undefined}
            inputStyle={{
              backgroundColor: colors.selectBg,
              paddingRight: spacing.sm,
            }}
            value={category?.name || ""}
            rightIcon={
              <IconButton
                onPress={handleOpenCategory}
                style={{
                  backgroundColor: colors.iconLightGray,
                  borderRadius: radius.sm,
                }}
                icon={
                  <Feather
                    name="chevron-down"
                    size={icons.sm}
                    color={colors.iconGray}
                  />
                }
              />
            }
          />
        </AppView>
        {/* Location Filter */}
        <AppView style={{ marginBottom: spacing.lg }}>
          <PlaceholderField
            onPress={handleOpenLocation}
            placeholder="Select a location"
            label="Location"
            rightLabel={selectedCity ? "Change" : undefined}
            inputStyle={{
              backgroundColor: colors.selectBg,
              paddingRight: spacing.sm,
            }}
            value={selectedCity?.name || ""}
            rightIcon={
              <IconButton
                onPress={handleOpenLocation}
                style={{
                  backgroundColor: colors.iconLightGray,
                  borderRadius: radius.sm,
                }}
                icon={
                  <Feather
                    name="map-pin"
                    size={icons.sm}
                    color={colors.iconGray}
                  />
                }
              />
            }
          />
        </AppView>

        {/* Price Range */}
        <AppView style={{ marginBottom: spacing.lg }}>
          <RangeInput
            label="Price Range"
            minValue={priceRange.low.toString()}
            maxValue={priceRange.high.toString()}
            onMinChange={(value) =>
              setPriceRangeLocal((prev) => ({
                ...prev,
                low: Number(value) || 0,
              }))
            }
            onMaxChange={(value) =>
              setPriceRangeLocal((prev) => ({
                ...prev,
                high: Number(value) || 100000,
              }))
            }
          />
        </AppView>

        {/* Condition Filter */}
        <AppView style={{ marginBottom: spacing.lg }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: spacing.sm,
            }}
          >
            <AppText variant="sm" fontWeight="medium">
              Condition
            </AppText>
            {selectedConditions.length > 0 && (
              <TextButton
                title="Clear"
                onPress={() => setSelectedConditions([])}
                titleStyle={{ fontSize: fontSizes.sm }}
              />
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: spacing.sm,
            }}
          >
            {conditionOptions.map((option) => (
              <Pill
                key={option.id}
                item={option.name}
                selected={selectedConditions.includes(option.value)}
                onPress={() => handleToggleCondition(option.value)}
              />
            ))}
          </View>
        </AppView>

        {/* Sort By */}
        <AppView style={{ marginBottom: spacing.lg }}>
          <PlaceholderField
            onPress={() => sortSheetRef.current?.expand()}
            placeholder="Select sort order"
            label="Sort By"
            inputStyle={{
              backgroundColor: colors.selectBg,
              paddingRight: spacing.sm,
            }}
            value={
              sortOptions.find((opt) => opt.value === selectedSort)?.name || ""
            }
            rightIcon={
              <IconButton
                onPress={() => sortSheetRef.current?.expand()}
                style={{
                  backgroundColor: colors.iconLightGray,
                  borderRadius: radius.sm,
                }}
                icon={
                  <Feather
                    name="chevron-down"
                    size={icons.sm}
                    color={colors.iconGray}
                  />
                }
              />
            }
          />
        </AppView>

        {/* Active Filters Count */}
        {activeFiltersCount > 0 && (
          <AppView
            style={{
              padding: spacing.md,
              backgroundColor: colors.primaryLight,
              borderRadius: radius.md,
              marginBottom: spacing.lg,
            }}
          >
            <AppText variant="sm" style={{ color: colors.primary }}>
              {activeFiltersCount} active filter
              {activeFiltersCount > 1 ? "s" : ""}
            </AppText>
          </AppView>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <AppView
        style={{
          padding: spacing.md,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          gap: spacing.sm,
        }}
      >
        <PrimaryButton
          title="Apply Filters"
          onPress={handleApplyFilters}
          style={{ marginBottom: spacing.xs }}
        />
        <TextButton
          title="Reset All Filters"
          onPress={handleResetFilters}
          titleStyle={{ color: colors.textGray }}
        />
      </AppView>

      {/* Bottom Sheets */}
      <SelectableListSheet
        ref={sortSheetRef}
        title="Sort By"
        snapPoints={["50%"]}
        data={sortOptions}
        onDone={() => {
          sortSheetRef.current?.close();
        }}
        renderItem={({ item, index }) => (
          <SheetRadioOptionItem
            item={item}
            selected={selectedSort === item.value}
            onPress={() => {
              setSelectedSort(item.value);
              sortSheetRef.current?.close();
            }}
          />
        )}
      />
    </>
  );
}
