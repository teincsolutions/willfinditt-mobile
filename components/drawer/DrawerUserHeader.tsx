// components/Drawer/DrawerUserHeader.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";
import AppText from "../ui/AppText";
import { Avatar } from "../ui/Avatar";

export default function DrawerUserHeader({
  onPress,
}: {
  onPress?: () => void;
}) {
  const { spacing, colors, icons } = useTheme();
  const { user } = useAuth();

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <Pressable
      onPress={onPress}
      style={{
        alignItems: "center",
        gap: spacing.sm,
        paddingVertical: spacing.md,
      }}
    >
      <Avatar
        onPress={onPress}
        size="xl"
        verified={user?.sellerProfile?.isVerified}
        name={fullName}
        uri={user?.avatar}
      />

      <AppText variant="lg">{fullName}</AppText>
      <Feather
        style={{ position: "absolute", bottom: 65, right: 40 }}
        name="settings"
        size={icons.sm}
        color={colors.iconGray}
      />
      <AppText variant="sm" style={{ opacity: 0.7 }}>
        Joined {joinedDate}
      </AppText>
    </Pressable>
  );
}
