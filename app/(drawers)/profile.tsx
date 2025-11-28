import { ChangeEmailSheet } from "@/components/bottom-sheet/ChangeEmailSheet";
import { ChangePhoneNumberSheet } from "@/components/bottom-sheet/ChangePhoneNumber";
import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Avatar } from "@/components/ui/Avatar";
import { Header } from "@/components/ui/Header";
import PlaceholderField from "@/components/ui/PlaceholderField";
import { TextButton } from "@/components/ui/TextButton";
import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import Drawer from "expo-router/drawer";
import { useRef, useState } from "react";
import { ScrollView } from "react-native";

export default function ProfileScreen() {
  const { icons, spacing, colors, radius, fontSizes } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const changeEmailSheetRef = useRef<BottomSheet>(null);
  const changePhoneNumberSheetRef = useRef<BottomSheet>(null);

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
          inputStyle={{ borderRadius: radius.md }}
          value={"Silvia"}
          rightIcon={
            <Feather
              name="chevron-right"
              color={colors.iconGray}
              size={icons.md}
            />
          }
        />

        <PlaceholderField
          leftIcon={
            <Feather name="user" color={colors.iconGray} size={icons.md} />
          }
          label="Lastname"
          inputStyle={{ borderRadius: radius.md }}
          value={"Aful"}
          rightIcon={
            <Feather
              name="chevron-right"
              color={colors.iconGray}
              size={icons.md}
            />
          }
        />

        <PlaceholderField
          leftIcon={
            <Feather name="mail" color={colors.iconGray} size={icons.md} />
          }
          label="Email"
          inputStyle={{ borderRadius: radius.md }}
          value={"samplename@gmail.com"}
          rightIcon={
            <AppView
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <Feather
                name="check-circle"
                color={colors.green}
                size={icons.sm}
              />
              <Feather
                name="chevron-right"
                color={colors.iconGray}
                size={icons.md}
              />
            </AppView>
          }
          onPress={() => {
            console.log("Change Email Pressed");
            changeEmailSheetRef.current?.expand();
          }}
        />

        <PlaceholderField
          leftIcon={
            <Feather name="phone" color={colors.iconGray} size={icons.md} />
          }
          label="Phone number"
          inputStyle={{ borderRadius: radius.md }}
          value={"+2330246092155"}
          onPress={() => changePhoneNumberSheetRef.current?.expand()}
          rightIcon={
            <AppView
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <Feather
                name="check-circle"
                color={colors.green}
                size={icons.sm}
              />
              <Feather
                name="chevron-right"
                color={colors.iconGray}
                size={icons.md}
              />
            </AppView>
          }
        />
      </ScrollView>
      <ChangeEmailSheet ref={changeEmailSheetRef} />
      <ChangePhoneNumberSheet ref={changePhoneNumberSheetRef} />
    </AppView>
  );
}
