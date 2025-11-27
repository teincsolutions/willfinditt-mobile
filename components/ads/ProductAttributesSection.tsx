
import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { Ad, CategoryField } from "@/types";
import React, { useMemo } from "react";
import { FlatList, View } from "react-native";
import AppView from "../ui/AppView";
import { Pill } from "../ui/Pill";
import { SignleAttributeCard } from "./SingleAttributeCard";

type FieldValue = { fieldId: string; value: any };

function mapAttributes(
  fieldValues: FieldValue[],
  categoryFields: CategoryField[]
) {
  const byId = new Map(categoryFields.map((f) => [f.id, f]));
  const singles: { label: string; value: string }[] = [];
  const lists: { label: string; values: string[] }[] = [];

  for (const fv of fieldValues || []) {
    const field = byId.get(fv.fieldId);
    if (!field) continue;
    const val = fv.value;
    if (Array.isArray(val)) {
      lists.push({ label: field.label || field.name, values: val });
    } else {
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
    () => mapAttributes((ad.fieldValues as any) || [], categoryFields || []),
    [ad, categoryFields]
  );

  return (
    <AppView style={{ paddingHorizontal: spacing.lg }}>
      {/* singles grid */}
      {singles.length > 0 && (
        <FlatList
          data={singles}
          keyExtractor={(_, i) => `single-${i}`}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: spacing.md,
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
