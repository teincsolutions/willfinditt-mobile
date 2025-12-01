import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Avatar } from "@/components/ui/Avatar";
import { Header } from "@/components/ui/Header";
import PlaceholderField from "@/components/ui/PlaceholderField";
import { TextButton } from "@/components/ui/TextButton";
import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import Drawer from "expo-router/drawer";
import { useState } from "react";
import { ScrollView } from "react-native";

export default function ProfileScreen() {
  const { icons, spacing, colors, radius, fontSizes } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.background }}>
      <Drawer.Screen
        options={{
          header: () => (
            <Header
              left={<DrawerHeaderToggle />}
              right={
                <TextButton
                  onPress={() => {
                    setIsEditing(!isEditing);
                  }}
                  title={isEditing ? "Save" : "Edit"}
                  titleStyle={{
                    color: colors.textWhite,
                    fontSize: fontSizes.md,
                  }}
                  style={{ borderRadius: radius.md }}
                  backgroundColor={colors.primary}
                />
              }
              rightSideStyle={{ marginRight: spacing.md }}
            />
          ),
        }}
      />
      <AppView
        style={{ height: 120, backgroundColor: colors.backgroundPrimary }}
      />

      <ScrollView
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
        }}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          gap: spacing.md,
        }}
      >
        <AppView
          style={{
            alignItems: "center",
            paddingVertical: spacing.lg,
            zIndex: 100,
          }}
        >
          <Avatar
            borderSize={4}
            size="xxl"
            styleContainer={{ marginBottom: spacing.md }}
            verified
          />
          <AppText variant="lg" style={{ marginTop: spacing.md }}>
            Silvia Aful
          </AppText>

          <AppText variant="sm" style={{ marginTop: spacing.sm, opacity: 0.7 }}>
            Joined Nov 12, 2025
          </AppText>
        </AppView>

        <PlaceholderField
          leftIcon={
            <Feather name="user" color={colors.iconGray} size={icons.md} />
          }
          label="Firstname"
          value={"Silvia"}
        />

        <PlaceholderField
          leftIcon={
            <Feather name="user" color={colors.iconGray} size={icons.md} />
          }
          label="Lastname"
          value={"Aful"}
        />

        <PlaceholderField
          leftIcon={
            <Feather name="calendar" color={colors.iconGray} size={icons.md} />
          }
          label="Date of Birth"
          value={"12th Dec 1998"}
        />
      </ScrollView>
    </AppView>
  );
}
