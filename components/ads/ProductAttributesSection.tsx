import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { Ad, AdFieldValue, CategoryField } from "@/types";
import React, { useMemo } from "react";
import { FlatList, View } from "react-native";
import AppView from "../ui/AppView";
import { Pill } from "../ui/Pill";
import { SignleAttributeCard } from "./SingleAttributeCard";

function mapAttributes(fieldValues: AdFieldValue[]) {
  const singles: { label: string; value: string }[] = [];
  const lists: { label: string; values: string[] }[] = [];

  for (const fv of fieldValues || []) {
    const field = fv.categoryField;
    if (!field) continue;

    const val = fv.value;

    // Handle CHECKBOX fields - value is a stringified JSON array
    if (field.type === "CHECKBOX") {
      try {
        const parsedValues = typeof val === "string" ? JSON.parse(val) : val;
        if (Array.isArray(parsedValues)) {
          lists.push({
            label: field.label,
            values:
              field.options
                ?.filter((opt) => parsedValues.includes(opt.value))
                .map((opt) => opt.label) || [],
          });
        }
      } catch (error) {
        console.warn(
          `Failed to parse CHECKBOX value for field ${field.name}:`,
          error
        );
        // Fallback: treat as single value if parsing fails
        singles.push({ label: field.label || field.name, value: String(val) });
      }
    }
    // Handle regular arrays (if any exist in your data)
    else if (Array.isArray(val)) {
      lists.push({ label: field.label || field.name, values: val });
    }
    // Handle all other field types (TEXT, NUMBER, SELECT, RADIO, DATE, BOOLEAN, TEXTAREA)
    else {
      singles.push({ label: field.label || field.name, value: String(val) });
    }
  }
  return { singles, lists };
}

export default function ProductAttributesSection({
  ad,
  categoryFields,
}: {
  ad: Ad;
  categoryFields: CategoryField[];
}) {
  const { spacing } = useTheme();

  const { singles, lists } = useMemo(
    () => mapAttributes((ad.fieldValues as any) || []),
    [ad.fieldValues]
  );

  return (
    <AppView style={{ paddingHorizontal: spacing.md }}>
      {/* singles grid */}
      {singles.length > 0 && (
        <FlatList
          data={singles}
          keyExtractor={(_, i) => `single-${i}`}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: spacing.md,
            gap: spacing.md,
          }}
          contentContainerStyle={{ gap: spacing.md }}
          renderItem={({ item }) => <SignleAttributeCard item={item} />}
        />
      )}

      {/* lists vertical */}
      {lists.map((l, idx) => (
        <View key={idx} style={{ marginBottom: spacing.md }}>
          <AppText variant="md" style={{ marginBottom: 8 }}>
            {l.label}
          </AppText>
          <FlatList
            data={l.values}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(v, i) => `${idx}-${i}`}
            renderItem={({ item }) => <Pill item={item} />}
            ItemSeparatorComponent={() => (
              <View style={{ width: spacing.sm }} />
            )}
          />
        </View>
      ))}
    </AppView>
  );
}
