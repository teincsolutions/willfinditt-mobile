import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import PlaceholderField from "@/components/ui/PlaceholderField";
import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Drawer from "expo-router/drawer";

export default function CategoriesScreen() {
  const { icons, spacing, colors } = useTheme();
  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Drawer.Screen
        options={{
          header: () => (
            <Header
              left={<DrawerHeaderToggle />}
              title="Support & About Us"
              containerStyle={{ paddingBottom: spacing.md }}
            />
          ),
        }}
      />

      <AppView
        style={{
          gap: spacing.md,
          paddingHorizontal: spacing.md,
          paddingTop: spacing.md,
        }}
      >
        <PlaceholderField
          leftIcon={
            <Feather
              name="help-circle"
              color={colors.iconGray}
              size={icons.md}
            />
          }
          value="Help & Support"
          onPress={() => router.push("/threads")}
          rightIcon={
            <Feather
              name="chevron-right"
              color={colors.iconGray}
              size={icons.md}
            />
          }
        />

        <PlaceholderField
          onPress={() => router.push("/pages/about")}
          leftIcon={
            <Feather name="info" color={colors.iconGray} size={icons.md} />
          }
          value="About Us"
          rightIcon={
            <Feather
              name="chevron-right"
              color={colors.iconGray}
              size={icons.md}
            />
          }
        />

        <PlaceholderField
          onPress={() => router.push("/pages/terms")}
          leftIcon={
            <Feather name="file-text" color={colors.iconGray} size={icons.md} />
          }
          value="Terms & Conditions"
          rightIcon={
            <Feather
              name="chevron-right"
              color={colors.iconGray}
              size={icons.md}
            />
          }
        />

        <PlaceholderField
          onPress={() => router.push("/pages/faq")}
          leftIcon={
            <Feather name="help-circle" color={colors.iconGray} size={icons.md} />
          }
          value="FAQ"
          rightIcon={
            <Feather
              name="chevron-right"
              color={colors.iconGray}
              size={icons.md}
            />
          }
        />
      </AppView>
    </AppView>
  );
}
