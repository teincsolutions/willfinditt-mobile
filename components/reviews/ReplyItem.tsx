import { useTheme } from "@/contexts/ThemeContext";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../ui/AppText";

interface ReplyProps {
  avatar: string;
  name: string;
  text: string;
  time: string;
}

export function ReplyItem({ avatar, name, text, time }: ReplyProps) {
  const { colors, spacing, avatarSize } = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          marginLeft: spacing.xxxl, // indentation for reply
          paddingVertical: spacing.sm,
          paddingRight: spacing.lg,
        },
      ]}
    >
      {/* Reply avatar */}
      <Image
        source={{ uri: avatar }}
        style={[
          {
            marginRight: spacing.sm,
            height: avatarSize.sm,
            width: avatarSize.sm,
            borderRadius: avatarSize.sm,
            borderWidth: 1,
            borderColor: colors.border,
          },
        ]}
      />

      {/* Text content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <AppText style={[{ color: colors.textGray, fontWeight: "600" }]}>
            {name}
          </AppText>
          <AppText variant="sm" style={[{ color: colors.textLightGray }]}>
            {time}
          </AppText>
        </View>

        <AppText
          variant="sm"
          style={[{ color: colors.text, marginTop: spacing.xs }]}
        >
          {text}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
