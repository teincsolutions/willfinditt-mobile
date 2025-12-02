import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../ui/AppText";
import MarkdownText from "../ui/MarkdownText";

type Props = {
  text: string;
  time?: string;
  isSender?: boolean; // true -> right (me), false -> left (other)
  side?: "left" | "right"; // deprecated: kept for backward compatibility
};

export default function ChatBubble({ text, time, isSender, side = "left" }: Props) {
  const { colors, spacing, radius } = useTheme();

  const isRight = isSender ?? (side === "right");

  return (
    <View
      style={[
        styles.wrap,
        {
          marginVertical: spacing.sm,
          alignItems: isRight ? "flex-end" : undefined,
          paddingLeft: isRight ? "20%" : 0,
          paddingRight: !isRight ? "20%" : 0,
        },
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isRight ? colors.primary : colors.backgroundPrimary,
            padding: spacing.md,
            borderTopEndRadius: radius.lg,
            borderTopStartRadius: radius.lg,
            borderBottomRightRadius: isRight ? undefined : radius.lg,
            borderBottomLeftRadius: !isRight ? undefined : radius.lg,
            marginHorizontal:spacing.md,
          },
        ]}
      >
        <MarkdownText
          text={text}
          textColor={isRight ? colors.textWhite : colors.textGray}
          style={{ color: isRight ? colors.textWhite : colors.textGray }}
        />

        {time ? (
          <AppText
            variant="xs"
            style={[
              styles.time,
              { color: isRight ? colors.textWhite : colors.textGray, marginTop: spacing.xs },
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
  wrap: {},
  bubble: { maxWidth: "88%" },
  time: { alignSelf: "flex-end" },
});
