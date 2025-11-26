// components/HeaderBackground/HeaderBackground.tsx

import { useTheme } from "@/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import AppText from "../ui/AppText";
import HeaderBack from "../ui/HeaderBack";
import { TextButton } from "../ui/TextButton";

type Props = {
  title: string;
  subtitle?: string;
};

export default function HeaderBackground({ title, subtitle }: Props) {
  const { colors, icons, spacing } = useTheme();
  const { width } = useWindowDimensions();

  // Circle diameter estimated from your screenshot
  const diameter = width * 1.8;

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
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
            backgroundColor: colors.acent, // mid orange
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
        <HeaderBack onPress={() => router.back()} />
        <TextButton
          icon={
            <Entypo
              color={colors.iconBlack}
              name="chevron-with-circle-right"
              size={icons.md}
            />
          }
          title="Skip"
          onPress={() => router.back()}
        />
      </View>
      {/* TEXT CONTENT */}
      <View style={[styles.textWrapper, {marginTop:spacing.lg}]}>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 80,
    position: "relative",
    height: 324,
  },
  circle: {
    position: "absolute",
    borderRadius: 9999,
  },
  textWrapper: {
    position: "relative",
    width: "70%",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
