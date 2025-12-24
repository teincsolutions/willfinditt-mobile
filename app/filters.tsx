import { SelectableListSheet } from "@/components/bottom-sheet/SelectableBottomSheet";
import SheetRadioOptionItem from "@/components/bottom-sheet/SheetRadioOptionItem";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import CheckBox from "@/components/ui/CheckBox";
import IconButton from "@/components/ui/IconButton";
import InputField from "@/components/ui/InputField";
import PlaceholderField from "@/components/ui/PlaceholderField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import RangeInput from "@/components/ui/RangeInput";
import SearchableSelectModal from "@/components/ui/SearchableSelectModal";
import TextAreaField from "@/components/ui/TextAreaField";
import { TextButton } from "@/components/ui/TextButton";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { useCategory } from "@/hooks/useCategories";
import { useCategoryFields } from "@/hooks/useCategoryFields";
import { useCityById } from "@/hooks/useLocations";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { useTheme } from "@/hooks/useTheme";
import { AdCondition, CategoryField, CategoryFieldType } from "@/types";
import { Feather } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router, Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const { colors, spacing, radius, icons } = useTheme();
  const insets = useSafeAreaInsets();
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
    setFieldValues,
    clearFilterOptions,
  } = useSearchFilters();

  // Fetch category name if categoryId exists
  const { data: category } = useCategory(categoryId || "");

  // Get selected city from location selection
  const { data: selectedCity } = useCityById(cityId!);

  // Fetch category fields for dynamic filtering
  const { data: categoryFields, isLoading: loadingFields } = useCategoryFields(
    categoryId || ""
  );

  // Local state for conditions (array for multiple selection)
  const [selectedCondition, setSelectedCondition] = useState(
    filters?.conditions || []
  );
  // Local state for price range
  const [priceRange, setPriceRangeLocal] = React.useState({
    low: filters?.priceMin || 0,
    high: filters?.priceMax || 100000,
  });

  // Local state for sort
  const [selectedSort, setSelectedSort] = React.useState(
    `${filters?.sortBy || "createdAt"}-${filters?.sortOrder || "desc"}`
  );

  // Local state for dynamic field values
  const [dynamicFieldValues, setDynamicFieldValues] = useState<
    Record<string, string>
  >({});

  // State for select modals
  const [selectModalVisible, setSelectModalVisible] = useState<{
    [key: string]: boolean;
  }>({});

  // Update local state when filters change
  useEffect(() => {
    setSelectedCondition(filters?.conditions || []);
    setPriceRangeLocal({
      low: filters?.priceMin || 0,
      high: filters?.priceMax || 100000,
    });
    setSelectedSort(
      `${filters?.sortBy || "createdAt"}-${filters?.sortOrder || "desc"}`
    );

    // Initialize dynamic field values from filters
    if (filters?.fieldValues) {
      const fieldValuesMap: Record<string, string> = {};
      filters.fieldValues.forEach((fv) => {
        fieldValuesMap[`field_${fv.categoryFieldId}`] = fv.value;
      });
      setDynamicFieldValues(fieldValuesMap);
    } else {
      setDynamicFieldValues({});
    }
  }, [filters]);

  // Reset dynamic fields when category changes
  useEffect(() => {
    if (categoryId && categoryFields) {
      // Initialize field values from filters if they match current category
      const fieldValuesMap: Record<string, string> = {};
      if (filters?.fieldValues) {
        filters.fieldValues.forEach((fv) => {
          const fieldExists = categoryFields.find(
            (f) => f.id === fv.categoryFieldId
          );
          if (fieldExists) {
            fieldValuesMap[`field_${fv.categoryFieldId}`] = fv.value;
          }
        });
      }
      setDynamicFieldValues(fieldValuesMap);
    }
  }, [categoryId, categoryFields, filters?.fieldValues]);

  const handleOpenCategory = () => {
    router.push({
      pathname: "/categories",
      params: { source: "filters" },
    });
  };

  const handleOpenLocation = () => {
    router.push({
      pathname: "/locations/regions",
      params: { source: "filters" },
    });
  };

  const handleFieldValueChange = (fieldId: string, value: string) => {
    setDynamicFieldValues((prev) => ({
      ...prev,
      [`field_${fieldId}`]: value,
    }));
  };

  const handleApplyFilters = () => {
    console.log("Applying filters...");
    // Apply conditions
    setConditions(selectedCondition.length > 0 ? selectedCondition : undefined);

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

    // Apply dynamic field values
    if (categoryFields && categoryFields.length > 0) {
      const fieldValuesArray = categoryFields
        .map((field) => ({
          categoryFieldId: field.id,
          value: dynamicFieldValues[`field_${field.id}`] || "",
        }))
        .filter((fv) => fv.value.trim() !== "");

      setFieldValues(
        fieldValuesArray.length > 0 ? fieldValuesArray : undefined
      );
    }

    // Navigate back to results
    router.dismiss();
  };

  const handleResetFilters = () => {
    clearFilterOptions();
    setSelectedCondition([]);
    setPriceRangeLocal({ low: 0, high: 100000 });
    setSelectedSort("createdAt-desc");
    setDynamicFieldValues({});
  };

  const renderDynamicFilterField = (field: CategoryField) => {
    const fieldKey = `field_${field.id}`;
    const fieldValue = dynamicFieldValues[fieldKey] || "";

    switch (field.type) {
      case CategoryFieldType.TEXT:
        return (
          <InputField
            key={field.id}
            label={field.label}
            value={fieldValue}
            onChangeText={(value) => handleFieldValueChange(field.id, value)}
            placeholder={`Filter by ${field.label.toLowerCase()}`}
            style={{ marginBottom: spacing.md }}
          />
        );

      case CategoryFieldType.NUMBER:
        return (
          <InputField
            key={field.id}
            label={field.label}
            value={fieldValue}
            onChangeText={(value) => handleFieldValueChange(field.id, value)}
            placeholder={`Filter by ${field.label.toLowerCase()}`}
            keyboardType="numeric"
            style={{ marginBottom: spacing.md }}
          />
        );

      case CategoryFieldType.TEXTAREA:
        return (
          <TextAreaField
            key={field.id}
            label={field.label}
            value={fieldValue}
            onChangeText={(value) => handleFieldValueChange(field.id, value)}
            placeholder={`Filter by ${field.label.toLowerCase()}`}
            numberOfLines={3}
            style={{ marginBottom: spacing.md }}
          />
        );

      case CategoryFieldType.SELECT:
        return (
          <AppView key={field.id} style={{ marginBottom: spacing.lg }}>
            <PlaceholderField
              label={field.label}
              placeholder={`Select ${field.label.toLowerCase()}`}
              value={
                field.options?.find((opt: any) => opt.value === fieldValue)
                  ?.label || ""
              }
              onPress={() => {
                setSelectModalVisible((prev) => ({
                  ...prev,
                  [field.id]: true,
                }));
              }}
              inputStyle={{
                backgroundColor: colors.selectBg,
                paddingRight: spacing.sm,
              }}
              rightIcon={
                <IconButton
                  onPress={() => {
                    setSelectModalVisible((prev) => ({
                      ...prev,
                      [field.id]: true,
                    }));
                  }}
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

            <SearchableSelectModal
              key={field.id}
              visible={selectModalVisible[field.id] || false}
              onClose={() =>
                setSelectModalVisible((prev) => ({
                  ...prev,
                  [field.id]: false,
                }))
              }
              options={field.options || []}
              value={fieldValue}
              onSelect={(value) => {
                handleFieldValueChange(field.id, value.toString());
                setSelectModalVisible((prev) => ({
                  ...prev,
                  [field.id]: false,
                }));
              }}
              title={`Select ${field.label.toLowerCase()}`}
            />
          </AppView>
        );

      case CategoryFieldType.RADIO:
        return (
          <AppView key={field.id} style={{ marginBottom: spacing.lg }}>
            <PlaceholderField
              label={field.label}
              placeholder={`Select ${field.label.toLowerCase()}`}
              value={
                field.options?.find((opt: any) => opt.value === fieldValue)
                  ?.label || ""
              }
              onPress={() => {
                setSelectModalVisible((prev) => ({
                  ...prev,
                  [field.id]: true,
                }));
              }}
              inputStyle={{
                backgroundColor: colors.selectBg,
                paddingRight: spacing.sm,
              }}
              rightIcon={
                <IconButton
                  onPress={() => {
                    setSelectModalVisible((prev) => ({
                      ...prev,
                      [field.id]: true,
                    }));
                  }}
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

            <SearchableSelectModal
              key={field.id}
              visible={selectModalVisible[field.id] || false}
              onClose={() =>
                setSelectModalVisible((prev) => ({
                  ...prev,
                  [field.id]: false,
                }))
              }
              options={field.options || []}
              value={fieldValue}
              onSelect={(value) => {
                handleFieldValueChange(field.id, value.toString());
                setSelectModalVisible((prev) => ({
                  ...prev,
                  [field.id]: false,
                }));
              }}
              title={`Select ${field.label.toLowerCase()}`}
            />
          </AppView>
        );

      case CategoryFieldType.CHECKBOX:
        const checkboxValues = fieldValue ? fieldValue.split(",") : [];
        return (
          <View key={field.id} style={{ marginBottom: spacing.md }}>
            <AppText
              variant="sm"
              style={{ marginBottom: spacing.sm, fontWeight: "600" }}
            >
              {field.label}
            </AppText>
            <View style={{ gap: spacing.sm }}>
              {field.options?.map((option: any) => {
                const isChecked = checkboxValues.includes(option.value);
                return (
                  <CheckBox
                    key={option.value}
                    label={option.label}
                    value={isChecked}
                    onValueChange={(checked) => {
                      const newValues = checked
                        ? [...checkboxValues, option.value]
                        : checkboxValues.filter(
                            (v: string) => v !== option.value
                          );
                      handleFieldValueChange(field.id, newValues.join(","));
                    }}
                  />
                );
              })}
            </View>
          </View>
        );

      case CategoryFieldType.BOOLEAN:
        return (
          <ToggleSwitch
            key={field.id}
            label={field.label}
            value={fieldValue === "true"}
            onValueChange={(val) =>
              handleFieldValueChange(field.id, val ? "true" : "false")
            }
            style={{ marginBottom: spacing.md }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{ headerStyle: { backgroundColor: colors.background } }}
      />
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
          <PlaceholderField
            label="Condition"
            placeholder="Select condition"
            value={
              conditionOptions.find(
                (option) => option.value === selectedCondition?.[0]
              )?.name || ""
            }
            onPress={() => {
              conditionSheetRef.current?.expand();
            }}
            rightIcon={
              <IconButton
                onPress={() => {
                  conditionSheetRef.current?.expand();
                }}
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

        {/* Dynamic Category Fields */}
        {categoryId && categoryFields && categoryFields.length > 0 && (
          <AppView style={{ marginBottom: spacing.lg }}>
            {loadingFields ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              categoryFields.map((field) => renderDynamicFilterField(field))
            )}
          </AppView>
        )}

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
          paddingBottom: insets.bottom,
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
          titleStyle={{ color: colors.blue, fontWeight: "600" }}
        />
      </AppView>

      {/* Bottom Sheets */}
      <SelectableListSheet
        ref={conditionSheetRef}
        title="Condition"
        snapPoints={["50%"]}
        data={conditionOptions}
        onDone={() => {
          conditionSheetRef.current?.close();
        }}
        renderItem={({ item, index }) => (
          <SheetRadioOptionItem
            item={item}
            selected={selectedCondition.includes(item.value)}
            onPress={() => {
              setSelectedCondition([item.value]);
              conditionSheetRef.current?.close();
            }}
          />
        )}
      />
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
