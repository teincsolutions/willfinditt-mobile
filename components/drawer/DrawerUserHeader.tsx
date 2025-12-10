// components/Drawer/DrawerUserHeader.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import React from "react";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";
import { Avatar } from "../ui/Avatar";

export default function DrawerUserHeader() {
  const { spacing } = useTheme();
  const { user } = useAuth();

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Recently";

  return (
    <AppView style={{ alignItems: "center", paddingVertical: spacing.lg }}>
      <Avatar 
        size="xl" 
        styleContainer={{ marginBottom: spacing.md }} 
        verified={user?.isVerified}
        uri={user?.avatar}
      />
      <AppText variant="lg" style={{ marginTop: spacing.md }}>
        {fullName}
      </AppText>

      <AppText variant="sm" style={{ marginTop: spacing.sm, opacity: 0.7 }}>
        Joined {joinedDate}
      </AppText>
    </AppView>
  );
}
