import AppText from "@/components/ui/AppText";
import { useTheme } from "@/contexts/ThemeContext";
import { State } from "@/types/location";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Badge from "../ui/Badge";

interface Props {
  state: State;
  selected?: boolean;
  onPress: () => void;
}

export default function StateCard({ state, selected, onPress }: Props) {
  const { colors, icons, input, spacing } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed
            ? colors.backgroundGray
            : selected
            ? colors.backgroundPrimary
            : colors.inputBg,
          borderColor: selected ? colors.primary : colors.border,
          borderWidth: selected ? 2 : 1,
          height: input.height,
          borderRadius: input.radius,
          paddingHorizontal: input.paddingHorizontal,
        },
      ]}
    >
      {/* State Name */}
      <AppText
        variant="md"
        style={[
          styles.text,
          { color: selected ? colors.primary : colors.text },
        ]}
        numberOfLines={1}
      >
        {state.name}
      </AppText>

      <Badge
        style={{
          marginStart: spacing.md,
          backgroundColor: colors.blue,
        }}
        countStyle={{ color: colors.textWhite }}
        count={state._count?.cities || 0}
      />

      {/* Right Icon */}
      <Feather
        name="chevron-right"
        size={icons.md}
        color={selected ? colors.primary : colors.iconGray}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    flex: 1,
  },
});
