import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppText from "../ui/AppText";

export default function ChatBubbleRight({
  text,
  time,
}: {
  text: string;
  time?: string;
}) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        { marginVertical: spacing.sm, alignItems: "flex-end" },
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: colors.primary,
            padding: spacing.md,
            borderRadius: radius.lg,
            borderBottomRightRadius: radius.sm,
          },
        ]}
      >
        <Text style={[{ color: colors.textWhite }]}>{text}</Text>

        {time ? (
          <AppText
            variant="sm"
            style={[
              styles.time,
              { marginTop: spacing.xs, color: colors.textWhite },
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
    paddingLeft: "20%",
  },
  bubble: {
    maxWidth: "88%",
  },
  time: {
    alignSelf: "flex-end",
  },
});
