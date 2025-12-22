// components/HeaderBackground/HeaderBackground.tsx

import { useTheme } from "@/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../ui/AppText";
import HeaderBack from "../ui/HeaderBack";
import { TextButton } from "../ui/TextButton";

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

export default function HeaderBackground({ title, subtitle, onBack }: Props) {
  const { colors, icons, spacing } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Circle diameter estimated from your screenshot
  const diameter = width * 1.8;

  const handleSkip = () => {
    router.push("/(drawers)");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
          paddingTop: insets.top + spacing.sm,
          height: 200 + insets.top + spacing.md,
        },
      ]}
    >
      {/* Large Circles */}
      <View
        style={[
          styles.circle,
          {
            width: diameter,
            height: diameter,
            backgroundColor: colors.primary, // main
            left: -diameter * 0.45,
            top: -diameter * 0.45,
          },
        ]}
      />

      <View
        style={[
          styles.circle,
          {
            width: diameter * 0.75,
            height: diameter * 0.75,
            backgroundColor: colors.accent, // mid orange
            left: -diameter * 0.35,
            top: -diameter * 0.25,
            opacity: 0.5,
          },
        ]}
      />

      <View
        style={[
          styles.circle,
          {
            width: diameter * 0.5,
            height: diameter * 0.5,
            backgroundColor: colors.secondary, // light orange/yellow blend
            left: -diameter * 0.22,
            top: -diameter * 0.12,
          },
        ]}
      />

      <View style={styles.buttons}>
        <HeaderBack onPress={onBack || (() => router.back())} />
        <TextButton
          style={{ height: 40, paddingHorizontal: spacing.xs }}
          icon={
            <Entypo
              color={colors.iconBlack}
              name="chevron-with-circle-right"
              size={icons.md}
            />
          }
          title="Skip"
          onPress={handleSkip}
        />
      </View>
      {/* TEXT CONTENT */}
      <View style={[styles.textWrapper, { marginTop: spacing.lg }]}>
        <AppText
          variant="xxl"
          style={{ color: colors.textWhite, fontWeight: "700" }}
        >
          {title}
        </AppText>

        {subtitle && (
          <AppText
            variant="md"
            style={{
              marginTop: spacing.sm,
              color: colors.textWhite,
              fontWeight: "700",
            }}
          >
            {subtitle}
          </AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    paddingHorizontal: 20,
    position: "relative",
  },
  circle: {
    position: "absolute",
    borderRadius: 9999,
  },
  textWrapper: {
    position: "relative",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
