import { ChangeEmailSheet } from "@/components/bottom-sheet/ChangeEmailSheet";
import { ChangePasswordSheet } from "@/components/bottom-sheet/ChangePasswordSheet";
import { ChangePhoneNumberSheet } from "@/components/bottom-sheet/ChangePhoneNumber";
import { ChangeUsernameSheet } from "@/components/bottom-sheet/ChangeUsernameSheet";
import { NotificationSettingsSheet } from "@/components/bottom-sheet/NotificationSettingsSheet";
import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import AppView from "@/components/ui/AppView";
import FormDividerText from "@/components/ui/FormDividerText";
import { Header } from "@/components/ui/Header";
import PlaceholderField from "@/components/ui/PlaceholderField";
import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { ScrollView } from "react-native";

export default function CategoriesScreen() {
  const { icons, spacing, colors, radius } = useTheme();
  const changeEmailSheetRef = useRef<BottomSheet>(null);
  const changePhoneNumberSheetRef = useRef<BottomSheet>(null);
  const changePasswordSheetRef = useRef<BottomSheet>(null);
  const changeUsernameSheetRef = useRef<BottomSheet>(null);
  const notificationSettingsSheetRef = useRef<BottomSheet>(null);

  return (
    <>
      <Header
        left={<DrawerHeaderToggle />}
        title="Settings & Security"
        containerStyle={{
          paddingBottom: spacing.lg,
        }}
      />
      <ScrollView
        contentContainerStyle={{
          padding: spacing.md,
          gap: spacing.md,
        }}
        style={{ backgroundColor: colors.background }}
      >
        <PlaceholderField
          leftIcon={
            <Feather name="user" color={colors.iconGray} size={icons.md} />
          }
          label="Username"
          inputStyle={{ borderRadius: radius.md }}
          value={"@johndoe"}
          onPress={() => changeUsernameSheetRef.current?.expand()}
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

        <FormDividerText text="Notifications" />

        <PlaceholderField
          leftIcon={
            <Feather name="bell" color={colors.iconGray} size={icons.md} />
          }
          label="Notifications"
          inputStyle={{ borderRadius: radius.md }}
          value="Manage notification preferences"
          onPress={() => notificationSettingsSheetRef.current?.expand()}
          rightIcon={
            <Feather
              name="chevron-right"
              color={colors.iconGray}
              size={icons.md}
            />
          }
        />

        <FormDividerText text="Security" />

        <PlaceholderField
          leftIcon={
            <Feather name="lock" color={colors.iconGray} size={icons.md} />
          }
          label="Password"
          inputStyle={{ borderRadius: radius.md }}
          value="Change Password"
          onPress={() => changePasswordSheetRef.current?.snapToIndex(0)}
          rightIcon={
            <Feather
              name="chevron-right"
              color={colors.iconGray}
              size={icons.md}
            />
          }
        />
      </ScrollView>
      <ChangeEmailSheet ref={changeEmailSheetRef} />
      <ChangePhoneNumberSheet ref={changePhoneNumberSheetRef} />
      <ChangeUsernameSheet ref={changeUsernameSheetRef} />
      <ChangePasswordSheet ref={changePasswordSheetRef} />
      <NotificationSettingsSheet ref={notificationSettingsSheetRef} />
    </>
  );
}
