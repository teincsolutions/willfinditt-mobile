import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { RecentSearchAd } from "@/types/ad";
import React from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ProductCardSmall } from "../ads/ProductCardSmall";
import AppView from "../ui/AppView";

interface RecentSearchesProps {
  data: RecentSearchAd[];
  query: string;
  onAdPress?: (ad: RecentSearchAd) => void;
}
export default function RecentSearches({
  data,
  onAdPress,
}: RecentSearchesProps) {
  const { colors, spacing } = useTheme();

  if (!data.length) return null;

  return (
    <View
      style={{
        backgroundColor: colors.background,
        marginTop: spacing.xs,
      }}
    >
      <AppText
        style={[
          {
            marginVertical: spacing.md,
            fontWeight: "bold",
            marginHorizontal: spacing.md,
          },
        ]}
      >
        Recently Saved
      </AppText>
      <FlatList
        data={data}
        horizontal
          showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm }}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCardSmall
            ad={item}
            onPress={() => onAdPress && onAdPress(item)}
          />
        )}
        ItemSeparatorComponent={() => (
          <AppView style={{ height: 1, backgroundColor: colors.border }} />
        )}
      />
    </View>
  );
}
