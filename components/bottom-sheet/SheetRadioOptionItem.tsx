import { useTheme } from "@/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, View } from "react-native";
import AppText from "../ui/AppText";

export type Option =
  | string
  | {
      id: string;
      name: string;
      subtitle?: string;
    };

export default function SheetRadioOptionItem({
  item,
  selected,
  onPress,
}: {
  item: Option;
  selected?: boolean;
  onPress: () => void;
}) {
  const { colors, spacing, icons } = useTheme();

  // normalize data
  const name = typeof item === "string" ? item : item.name;
  const subtitle = typeof item === "string" ? undefined : item.subtitle;

  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.backgroundPrimary,
        borderRadius: 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.sm,
      }}
    >
      {/* LEFT SIDE */}
      <View style={{ flex: 1 }}>
        <AppText variant="md">{name}</AppText>

        {subtitle ? (
          <AppText variant="sm" style={{ opacity: 0.6, marginTop: 4 }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {/* Radio */}
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          {
            width: icons.md,
            height: icons.md,
            borderRadius: icons.md,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        {selected ? (
          <View
            style={{
              width: icons.md / 1.4,
              height: icons.md / 1.4,
              borderRadius: icons.md,
              borderWidth: 1,
              borderColor: colors.backgroundPrimary,
              backgroundColor: colors.primary,
            }}
          />
        ) : (
          <View
            style={{
              width: icons.md / 1.4,
              height: icons.md / 1.4,

              borderRadius: icons.md,
              backgroundColor: colors.backgroundPrimary,
            }}
          />
        )}
      </LinearGradient>
    </Pressable>
  );
}
