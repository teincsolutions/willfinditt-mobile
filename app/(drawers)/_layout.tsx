import CustomDrawerContent from "@/components/drawer/CustomDrawerContent";
import DrawerHeaderRight from "@/components/ui/DrawerHeaderRight";
import DrawerHeaderTitle from "@/components/ui/DrawerHeaderTitle";
import DrawerHeaderToggle from "@/components/ui/DrawerHeaderToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { Drawer } from "expo-router/drawer";
import React from "react";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Drawer
      screenOptions={{
        drawerStyle: { width: "60%" },
      }}
      drawerContent={CustomDrawerContent}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Home",
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: colors.backgroundPrimary,
            opacity: 1,
          },
          headerTitleAlign: "center",
          headerLeft: () => <DrawerHeaderToggle />,
          headerTitle: () => <DrawerHeaderTitle />,
          headerRight: () => <DrawerHeaderRight />,
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          title: "Explore",
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: colors.backgroundPrimary,
          },
          headerLeft: () => <DrawerHeaderToggle />,
          headerTitle: () => <DrawerHeaderTitle />,
          headerRight: () => <DrawerHeaderRight />,
        }}
      />
    </Drawer>
  );
}
