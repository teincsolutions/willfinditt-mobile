import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { Category } from "@/types";
import { Image } from "expo-image";
import { DirectRight } from "iconsax-react-nativejs";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import AppView from "../ui/AppView";
import Badge from "../ui/Badge";

interface Props {
  category: Category;
  selected?: boolean;
  onPress: () => void;
}

export default function CategoryCardLandscape({ category, selected, onPress }: Props) {
  const { colors, spacing, radius, avatarSize, icons } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderRadius: radius.md,
          paddingVertical: spacing.sm,
          paddingHorizontal:spacing.md,
          borderColor: selected ? colors.primary : colors.border,
          borderWidth: 1,
        },
      ]}
    >
      {/* LEFT ICON IMAGE */}
      <Image
        source={{ uri: category.icon || "" }}
        style={{
          width: avatarSize.lg,
          height: avatarSize.lg,
          borderRadius:avatarSize.lg,
          borderWidth: 2,
          backgroundColor: colors.backgroundGray,
          borderColor: colors.backgroundPrimary,
          flexShrink: 0,
        }}
      />

      {/* TEXT CONTENT — minWidth: 0 lets the text yield inside the row on
          Android instead of overflowing/pushing siblings. */}
      <AppView
        style={{
          flex: 1,
          flexShrink: 1,
          minWidth: 0,
          marginLeft: spacing.md,
          marginRight: spacing.sm,
        }}
      >
        {/* TITLE + COUNT BADGE */}
        <AppView
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            minWidth: 0,
          }}
        >
          {/* TITLE */}
          <AppText
            variant="lg"
            style={{ fontFamily: "Bold", flex: 1, flexShrink: 1, minWidth: 0 }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {category.name || "—"}
          </AppText>

          <Badge
            style={{
              flexShrink: 0,
              backgroundColor: colors.primary,
            }}
            countStyle={{ color: colors.textWhite }}
            count={category._count?.ads || 0}
            label="Ads"
          />
        </AppView>

        {/* DESCRIPTION */}
        <AppText
          variant="sm"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ flexShrink: 1, minWidth: 0 }}
        >
          {category.description || ""}
        </AppText>
      </AppView>

      {/* RIGHT ARROW — fixed size, never shrinks */}
      <AppView style={{ flexShrink: 0 }}>
        <DirectRight size={icons.md} color={colors.accentRed} />
      </AppView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});
