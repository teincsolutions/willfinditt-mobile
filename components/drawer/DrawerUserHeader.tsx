// components/Drawer/DrawerUserHeader.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import { Avatar } from "../ui/Avatar";

export default function DrawerUserHeader() {
  const { spacing } = useTheme();

  return (
    <AppView style={{ alignItems: "center", paddingVertical: spacing.lg }}>
      <Avatar styleContainer={{ marginBottom: spacing.md }} verified />
      <AppText variant="lg" style={{ marginTop: spacing.md }}>
        Silvia Aful
      </AppText>

      <AppText variant="sm" style={{ marginTop: spacing.sm, opacity: 0.7 }}>
        Joined Nov 12, 2025
      </AppText>
    </AppView>
  );
}
