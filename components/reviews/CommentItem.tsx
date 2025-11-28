import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../ui/AppText";

interface Props {
  avatar: string;
  name: string;
  text: string;
  time: string;
  repliesCount?: number;
  onPressReplies?: () => void;
}

export function CommentItem({
  avatar,
  name,
  text,
  time,
  repliesCount = 0,
  onPressReplies,
}: Props) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.row,
        { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
      ]}
    >
      {/* Avatar + vertical line */}
      <View style={styles.leftColumn}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View
          style={[
            styles.line,
            {
              backgroundColor: colors.backgroundGray,
              marginLeft: 20, // aligned under center of avatar
            },
          ]}
        />
      </View>

      {/* Comment content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <AppText
            variant="md"
            style={[{ color: colors.text, fontWeight: "600" }]}
          >
            {name}
          </AppText>
          <AppText style={[{ color: colors.textGray }]}>{time}</AppText>
        </View>
        <AppText style={[{ color: colors.text, marginTop: 4 }]}>{text}</AppText>

        {/* Replies count */}
        {repliesCount > 0 && (
          <TouchableOpacity
            onPress={onPressReplies}
            style={{ marginTop: spacing.sm }}
          >
            <AppText variant="sm" style={[{ color: colors.textGray }]}>
              {repliesCount} replies
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  leftColumn: {
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: 4,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
