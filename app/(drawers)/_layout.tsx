import CustomDrawerContent from "@/components/drawer/CustomDrawerContent";
import DrawerHeaderRight from "@/components/drawer/DrawerHeaderRight";
import DrawerHeaderTitle from "@/components/drawer/DrawerHeaderTitle";
import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import { Header } from "@/components/ui/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React from "react";

export default function TabLayout() {
  const { spacing } = useTheme();

  return (
    <Drawer
      screenOptions={{
        drawerStyle: { width: "70%" },
        header: ({ route, options }: DrawerHeaderProps) => (
          <Header
            left={<DrawerHeaderToggle />}
            title={options.title}
            containerStyle={{ paddingVertical: spacing.sm }}
          />
        ),
      }}
      drawerContent={CustomDrawerContent}
    >
      <Drawer.Screen
        name="index"
        options={{
          header: () => (
            <Header
              left={<DrawerHeaderToggle />}
              right={<DrawerHeaderRight />}
              title={<DrawerHeaderTitle />}
              containerStyle={{ paddingVertical: spacing.sm, zIndex: 1000 }}
            />
          ),
        }}
      />
      <Drawer.Screen name="profile" />
      <Drawer.Screen name="favorites" />
      <Drawer.Screen name="messages" />
      <Drawer.Screen name="notifications" />
      <Drawer.Screen name="settings" options={{ headerShown: false }} />
      <Drawer.Screen name="support" />
    </Drawer>
  );
}
