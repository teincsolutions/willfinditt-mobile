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
  onPress: () => void;
}

export default function CategoryCardLandscape({ category, onPress }: Props) {
  const { colors, spacing, radius, avatarSize, icons } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderRadius: radius.md,
          padding: spacing.md,
          borderColor: colors.border,
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
        }}
      />

      {/* TEXT CONTENT */}
      <AppView style={{ flex: 1, marginLeft: spacing.md }}>
        {/* TITLE + COUNT BADGE */}
        <AppView
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* TITLE */}
          <AppText
            variant="lg"
            style={{ fontFamily: "Bold" }}
            numberOfLines={1}
          >
            {category.name || "—"}
          </AppText>

          <Badge
            style={{
              marginStart: spacing.md,
              backgroundColor: colors.backgroundPrimary,
            }}
            countStyle={{ color: colors.text }}
            count={category._count?.ads || 0}
          />
        </AppView>

        {/* DESCRIPTION */}
        <AppText variant="sm" numberOfLines={1}>
          {category.description || ""}
        </AppText>
      </AppView>

      {/* RIGHT ARROW */}
      <DirectRight size={icons.md} color={colors.accentRed} />
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
