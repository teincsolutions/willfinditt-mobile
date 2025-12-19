import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../ui/AppText";
import MarkdownText from "../ui/MarkdownText";

type Props = {
  text: string;
  time?: string;
  isSender?: boolean; // true -> right (me), false -> left (other)
  side?: "left" | "right"; // deprecated: kept for backward compatibility
  isDelivered?: boolean;
  isRead?: boolean;
};

export default function ChatBubble({
  text,
  time,
  isSender,
  side = "left",
  isDelivered,
  isRead,
}: Props) {
  const { colors, spacing, radius } = useTheme();

  const isRight = isSender ?? side === "right";

  // Status indicator for sender messages
  const statusText = isRead ? (
    "✓✓"
  ) : isDelivered ? (
    "✓"
  ) : (
    <Ionicons name="time-outline" size={12} color={colors.iconWhite} />
  );
  const statusColor = isRead
    ? colors.primary
    : isRight
    ? colors.textWhite
    : colors.textGray;

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
            backgroundColor: isRight
              ? colors.primary
              : colors.backgroundPrimary,
            padding: spacing.md,
            borderTopEndRadius: radius.lg,
            borderTopStartRadius: radius.lg,
            borderBottomRightRadius: isRight ? undefined : radius.lg,
            borderBottomLeftRadius: !isRight ? undefined : radius.lg,
            marginHorizontal: spacing.md,
          },
        ]}
      >
        <MarkdownText
          text={text}
          textColor={isRight ? colors.textWhite : colors.textGray}
          style={{ color: isRight ? colors.textWhite : colors.textGray }}
        />

        {time ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: spacing.xs,
            }}
          >
            <AppText
              variant="xs"
              style={[
                styles.time,
                { color: isRight ? colors.textWhite : colors.textGray },
              ]}
            >
              {time}
            </AppText>

            {/* Status indicator shown for sender messages */}
            {isRight ? (
              <AppText
                variant="xs"
                style={{
                  marginLeft: spacing.xs,
                  color: statusColor,
                }}
              >
                {statusText}
              </AppText>
            ) : null}
          </View>
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
