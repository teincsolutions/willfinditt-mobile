import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { formatCurrency } from "@/lib/formatCurrency";
import { Ad } from "@/types";
import { Image } from "expo-image";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import AppView from "../ui/AppView";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export function AdInfoBlock({ ad }: { ad?: Ad }) {
  const { spacing, colors } = useTheme();
  return (
    <AppView style={{ paddingHorizontal: spacing.md }}>
      <AppView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: spacing.md,
        }}
      >
        <AppView style={{ gap: spacing.xs }}>
          <AppView>
            <AppText
              numberOfLines={3}
              variant="xl"
              style={{ fontWeight: "700" }}
            >
              {ad?.title}
            </AppText>
          </AppView>
          <AppView
            style={{
              gap: spacing.xs,
              width: "100%",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <AppText variant="md" style={{ opacity: 0.7 }}>
              {ad?.address || ad?.city?.name || "Unknown"}
            </AppText>

            <AppView
              style={{
                gap: spacing.xs,
                alignSelf: "flex-end",
              }}
            >
              <AppText variant="md" style={{ opacity: 0.7 }}>
                Price
              </AppText>
              {ad?.isNegotiable && (
                <AppText
                  variant="xs"
                  style={{
                    fontWeight: "400",
                    color: colors.success,
                    alignSelf: "flex-end",
                  }}
                >
                  (Negotiable)
                </AppText>
              )}
              <AppText
                variant="lg"
                style={{ fontWeight: "500", lineHeight: 24 }}
              >
                {Number(ad?.price) === 0
                  ? "Contact for price"
                  : formatCurrency(
                      ad?.price || 0,
                      "en-GH",
                      ad?.currency || "GHS"
                    )}
              </AppText>
            </AppView>
          </AppView>
        </AppView>
      </AppView>

      {/* thumbnails */}
      <FlatList
        data={ad?.images || []}
        horizontal
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            placeholder={{ blurhash }}
            style={styles.thumb}
          />
        )}
        contentContainerStyle={{ marginTop: spacing.md }}
        showsHorizontalScrollIndicator={false}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
});
