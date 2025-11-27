import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  avatar: string;
  name: string;
  text: string;
  time: string;
  repliesCount?: number;
  onPressReplies?: () => void;
}

export default function CommentItem({
  avatar,
  name,
  text,
  time,
  repliesCount = 0,
  onPressReplies,
}: Props) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.row, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
      
      {/* Avatar + vertical line */}
      <View style={styles.leftColumn}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View
          style={[
            styles.line,
            {
              backgroundColor: colors.gray300,
              marginLeft: 20, // aligned under center of avatar
            },
          ]}
        />
      </View>

      {/* Comment content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[typography.body, { color: colors.gray800, fontWeight: "600" }]}>
            {name}
          </Text>
          <Text style={[typography.small, { color: colors.gray500 }]}>{time}</Text>
        </View>

        <Text style={[typography.body, { color: colors.gray800, marginTop: 4 }]}>
          {text}
        </Text>

        {/* Replies count */}
        {repliesCount > 0 && (
          <TouchableOpacity onPress={onPressReplies} style={{ marginTop: spacing.sm }}>
            <Text style={[typography.small, { color: colors.gray600 }]}>
              {repliesCount} replies
            </Text>
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
