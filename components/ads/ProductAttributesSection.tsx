import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { Ad, AdFieldValue, CategoryFieldType } from "@/types";
import React, { useMemo } from "react";
import { View } from "react-native";
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
    if (field.type === CategoryFieldType.CHECKBOX ) {
      try {
        console.log('Parsing CHECKBOX field value:', val);
        const parsedValues = typeof val === "string" ? val.split(",") : val;
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
        singles.push({ label: field.label || field.name, value: field.options?.find(opt => opt.value === val)?.label || String(val) });
      }
    }
    // Handle all other field types (TEXT, NUMBER, SELECT, RADIO, DATE, BOOLEAN, TEXTAREA)
    else {
      singles.push({ label: field.label || field.name, value: field.options?.find(opt => opt.value === val)?.label || String(val) });
    }
  }
  return { singles, lists };
}

export default function ProductAttributesSection({ ad }: { ad?: Ad }) {
  const { spacing } = useTheme();

  const { singles, lists } = useMemo(
    () => mapAttributes(ad?.fieldValues || []),
    [ad?.fieldValues]
  );
  if (ad?.condition) {
    singles.unshift({ label: "Condition", value: ad?.condition });
  }

  return (
    <AppView style={{ paddingHorizontal: spacing.md }}>
      {/* singles grid */}
      <View style={{ gap: spacing.md }}>
        {/* Split singles into rows of 2 */}
        {singles.length > 0 &&
          Array.from(
            { length: Math.ceil(singles.length / 2) },
            (_, rowIndex) => (
              <View
                key={`row-${rowIndex}`}
                style={{
                  flexDirection: "row",
                  gap: spacing.md,
                  marginBottom: spacing.md,
                }}
              >
                {singles
                  .slice(rowIndex * 2, rowIndex * 2 + 2)
                  .map((item, colIndex) => (
                    <View
                      key={`single-${rowIndex}-${colIndex}`}
                      style={{ flex: 1 }}
                    >
                      <SignleAttributeCard item={item} />
                    </View>
                  ))}
              </View>
            )
          )}
      </View>
      {/* lists vertical */}
      {lists.map((l, idx) => (
        <View key={idx} style={{ marginBottom: spacing.md }}>
          <AppText variant="md" style={{ marginBottom: 8 }}>
            {l.label}
          </AppText>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: spacing.sm,
            }}
          >
            {l.values.map((item, i) => (
              <Pill key={`${idx}-${i}`} item={item} />
            ))}
          </View>
        </View>
      ))}
    </AppView>
  );
}
