import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TabButton } from "./TabButton";

type Props = {
  active: "login" | "register";
  onChange: (value: "login" | "register") => void;
};

export default function AuthTabSwitcher({ active, onChange }: Props) {
  const { colors, spacing, radius, button } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundGray,
          padding: spacing.sm,
          borderRadius: radius.xxl,
        },
      ]}
    >
      {/* LOGIN TAB */}
      <TabButton
        onPress={() => onChange("login")}
        title="Login"
        active={active === "login"}
      />

      {/* REGISTER TAB */}
      <TabButton
        title="Register"
        onPress={() => onChange("register")}
        active={active === "register"}
      />
    </View>
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
