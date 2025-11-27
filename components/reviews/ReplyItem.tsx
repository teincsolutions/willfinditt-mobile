import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface ReplyProps {
  avatar: string;
  name: string;
  text: string;
  time: string;
}

export default function ReplyItem({ avatar, name, text, time }: ReplyProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          marginLeft: 64, // indentation for reply
          paddingVertical: spacing.sm,
          paddingRight: spacing.lg,
        },
      ]}
    >
      {/* Reply avatar */}
      <Image
        source={{ uri: avatar }}
        style={[
          styles.avatar,
          {
            marginRight: spacing.sm,
          },
        ]}
      />

      {/* Text content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text
            style={[
              typography.body,
              { color: colors.gray800, fontWeight: "600" },
            ]}
          >
            {name}
          </Text>
          <Text style={[typography.small, { color: colors.gray500 }]}>
            {time}
          </Text>
        </View>

        <Text
          style={[
            typography.body,
            { color: colors.gray800, marginTop: 4 },
          ]}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
