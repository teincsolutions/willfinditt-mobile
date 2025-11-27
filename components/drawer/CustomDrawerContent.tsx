import { useTheme } from "@/contexts/ThemeContext";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import React from "react";

import DrawerMenuItem from "./DrawerMenuItem";
import DrawerPromoCard from "./DrawerPromoCard";
import DrawerUserHeader from "./DrawerUserHeader";

export default function CustomDrawerContent() {
  const { colors, icons, spacing } = useTheme();

  return (
    <DrawerContentScrollView
      style={{
        backgroundColor: colors.background,
        padding: spacing.md,
      }}
    >
      {/* USER HEADER */}
      <DrawerUserHeader />
      {/* MENU ITEMS */}
      <DrawerMenuItem
        label="Edit Profile"
        onPress={() => {}}
        icon={
          <MaterialCommunityIcons
            name="account-edit"
            size={icons.md}
            color={colors.text}
          />
        }
      />
      <DrawerMenuItem
        label="Categories"
        onPress={() => {}}
        icon={<Feather name="grid" size={icons.md} color={colors.text} />}
      />
      <DrawerMenuItem
        label="Favorites"
        onPress={() => {}}
        icon={
          <MaterialCommunityIcons
            name="heart-outline"
            size={icons.md}
            color={colors.text}
          />
        }
      />
      <DrawerMenuItem
        label="Messages"
        count={2}
        onPress={() => {}}
        icon={
          <Feather name="message-square" size={icons.md} color={colors.text} />
        }
      />
      <DrawerMenuItem
        label="Notifications"
        count={2}
        onPress={() => {}}
        icon={<Feather name="bell" size={icons.md} color={colors.text} />}
      />
      <DrawerMenuItem
        label="Security"
        onPress={() => {}}
        icon={<Feather name="shield" size={icons.md} color={colors.text} />}
      />
      <DrawerMenuItem
        label="Support"
        onPress={() => {}}
        icon={<Feather name="headphones" size={icons.md} color={colors.text} />}
      />
      {/* PROMO CARD */}
      <DrawerPromoCard />
      {/* LOGOUT */}
      <DrawerMenuItem
        label="Logout"
        onPress={() => {}}
        labelStyle={{ color: colors.accentRed }}
        icon={
          <Feather name="log-out" size={icons.md} color={colors.accentRed} />
        }
      />
    </DrawerContentScrollView>
  );
}
