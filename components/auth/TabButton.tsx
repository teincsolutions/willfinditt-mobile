import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import AppText from "../ui/AppText";

type Props = {
  active?: boolean;
  onPress?: () => void;
  title: string;
};

export function TabButton({ active, title, onPress }: Props) {
  const { colors, radius, button } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tab,
        {
          borderRadius: radius.xl,
          backgroundColor: active ? colors.background : "transparent",
        },
        active && {
          borderColor: colors.border,
          borderWidth: button.borderWidth,
        },
      ]}
    >
      <AppText
        variant="md"
        style={{
          opacity: active ? 1 : 0.5,
          fontWeight: active ? "600" : "400",
        }}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
});
