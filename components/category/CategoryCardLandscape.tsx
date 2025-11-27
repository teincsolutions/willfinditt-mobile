import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { Category } from "@/types";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import AppView from "../ui/AppView";
import { Avatar } from "../ui/Avatar";
import Badge from "../ui/Badge";

interface Props {
  category: Category;
  count?: number;
  onPress: () => void;
}

export default function CategoryCardLandscape({
  category,
  count,
  onPress,
}: Props) {
  const { colors, spacing, radius } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderRadius: radius.md,
          padding: spacing.md,
        },
      ]}
    >
      {/* LEFT ICON IMAGE */}
      <Avatar source={{ uri: category.icon || "" }} size="lg" />

      {/* TEXT CONTENT */}
      <AppView style={{ flex: 1, marginLeft: spacing.md }}>
        {/* TITLE + COUNT BADGE */}
        <Badge count={count || 0} />

        {/* DESCRIPTION */}
        <AppText
          variant="sm"
          style={{ marginTop: 4, opacity: 0.6 }}
          numberOfLines={1}
        >
          {category.description || "—"}
        </AppText>
      </AppView>

      {/* RIGHT ARROW */}
      <Feather name="chevron-right" size={20} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#EEE",
  },

  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
});
