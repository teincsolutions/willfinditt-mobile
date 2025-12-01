import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo, useState } from "react";

import { useTheme } from "@/contexts/ThemeContext";
import { View } from "react-native";
import AppText from "../ui/AppText";
import PrimaryButton from "../ui/PrimaryButton";
import ToggleSwitch from "../ui/ToggleSwitch";

export interface NotificationSettingsSheetProps {
  close?: () => void;
}

export const NotificationSettingsSheet = forwardRef<
  BottomSheet,
  NotificationSettingsSheetProps
>((props, ref) => {
  const { spacing, colors } = useTheme();

  const snapPoints = useMemo(() => ["85%"], []);

  // Notification preferences state
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    promotions: false,
    newReviews: true,
    reviewReplies: true,
    newMessages: true,
    adStatusUpdates: true,
    priceDropAlerts: false,
    favoriteAdUpdates: true,
    systemAnnouncements: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    // Handle saving notification settings
    console.log("Notification settings saved:", settings);
    props.close?.();
  };

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      index={-1}
      enablePanDownToClose
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      )}
      backgroundStyle={{
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
      }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          paddingBottom: spacing.xl,
        }}
      >
        {/* Title */}
        <AppText
          variant="xl"
          style={{ textAlign: "center", marginBottom: spacing.sm }}
        >
          Notification Settings
        </AppText>

        {/* Subtitle */}
        <AppText
          variant="md"
          style={{
            textAlign: "center",
            opacity: 0.7,
            marginBottom: spacing.lg,
          }}
        >
          Manage how you receive notifications
        </AppText>

        {/* General Section */}
        <View style={{ marginBottom: spacing.lg }}>
          <AppText
            variant="lg"
            style={{
              fontWeight: "600",
              marginBottom: spacing.md,
              color: colors.primary,
            }}
          >
            General
          </AppText>

          <ToggleSwitch
            label="Push Notifications"
            description="Receive notifications on your device"
            value={settings.pushNotifications}
            onValueChange={() => handleToggle("pushNotifications")}
          />

          <ToggleSwitch
            label="Email Notifications"
            description="Receive notifications via email"
            value={settings.emailNotifications}
            onValueChange={() => handleToggle("emailNotifications")}
          />
        </View>

        {/* Marketing Section */}
        <View style={{ marginBottom: spacing.lg }}>
          <AppText
            variant="lg"
            style={{
              fontWeight: "600",
              marginBottom: spacing.md,
              color: colors.primary,
            }}
          >
            Marketing
          </AppText>

          <ToggleSwitch
            label="Promotions & Offers"
            description="Receive promotional offers and discounts"
            value={settings.promotions}
            onValueChange={() => handleToggle("promotions")}
          />
        </View>

        {/* Activity Section */}
        <View style={{ marginBottom: spacing.lg }}>
          <AppText
            variant="lg"
            style={{
              fontWeight: "600",
              marginBottom: spacing.md,
              color: colors.primary,
            }}
          >
            Activity
          </AppText>

          <ToggleSwitch
            label="New Messages"
            description="Get notified when you receive a new message"
            value={settings.newMessages}
            onValueChange={() => handleToggle("newMessages")}
          />

          <ToggleSwitch
            label="New Reviews"
            description="Get notified when someone reviews your ad"
            value={settings.newReviews}
            onValueChange={() => handleToggle("newReviews")}
          />

          <ToggleSwitch
            label="Review Replies"
            description="Get notified when someone replies to your review"
            value={settings.reviewReplies}
            onValueChange={() => handleToggle("reviewReplies")}
          />
          <ToggleSwitch
            label="Ad Status Updates"
            description="Get notified about changes to your ad status"
            value={settings.adStatusUpdates}
            onValueChange={() => handleToggle("adStatusUpdates")}
          />
        </View>

        {/* System Section */}
        <View style={{ marginBottom: spacing.lg }}>
          <AppText
            variant="lg"
            style={{
              fontWeight: "600",
              marginBottom: spacing.md,
              color: colors.primary,
            }}
          >
            System
          </AppText>

          <ToggleSwitch
            label="System Announcements"
            description="Important updates and announcements"
            value={settings.systemAnnouncements}
            onValueChange={() => handleToggle("systemAnnouncements")}
          />
        </View>

        {/* Save Button */}
        <PrimaryButton
          style={{ marginTop: spacing.md }}
          title="Save Settings"
          onPress={handleSave}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

NotificationSettingsSheet.displayName = "NotificationSettingsSheet";
