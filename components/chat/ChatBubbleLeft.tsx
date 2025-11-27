import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../ui/AppText";

export default function ChatBubbleLeft({
  text,
  time,
}: {
  text: string;
  time?: string;
}) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={[styles.wrap, { marginVertical: spacing.sm }]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: colors.secondary,
            padding: spacing.md,
            borderRadius: radius.lg,
            borderBottomLeftRadius: radius.sm,
          },
        ]}
      >
        <AppText style={[{ color: colors.textGray }]}>{text}</AppText>

        {time ? (
          <AppText
            variant="sm"
            style={[
              styles.time,
              { color: colors.textGray, marginTop: spacing.xs },
            ]}
          >
            {time}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingRight: "20%",
  },
  bubble: {},
  time: {
    alignSelf: "flex-end",
  },
});
