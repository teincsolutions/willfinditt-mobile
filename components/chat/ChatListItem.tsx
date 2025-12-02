import { useTheme } from "@/hooks/useTheme";
import { Chat } from "@/types/chat";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "../ui/AppText";
import { Avatar } from "../ui/Avatar";
import Badge from "../ui/Badge";

type Props = {
  chat: Chat;
  currentUserId: string;
  onPress?: () => void;
};

export default function ChatListItem({
  chat,
  currentUserId,
  onPress,
}: Props) {
  const { colors, spacing, radius, icons } = useTheme();
  // adTitle from adId
  const adTitle = "Kike Sportwear Club Fleece";
  // Determine the other participant (not current user)
  const otherUser =
    chat.senderId === currentUserId ? chat.receiver : chat.sender;

  // Format time
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const displayName = [otherUser.firstName, otherUser.lastName]
    .filter(Boolean)
    .join(" ") || otherUser.username;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? colors.backgroundGray : colors.background,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Avatar */}
      <Avatar
        source={otherUser.avatar ? { uri: otherUser.avatar } : undefined}
        size="lg"
        verified={false}
      />

      {/* Content */}
      <View style={[styles.content, { marginLeft: spacing.md }]}>
        {/* Top Row: Name and Time */}
        <View style={styles.topRow}>
          <AppText
            variant="md"
            fontWeight="medium"
            style={{ color: colors.accentBlue, flex: 1 }}
            numberOfLines={1}
          >
            {displayName}
          </AppText>
          <AppText
            variant="xs"
            style={{ color: colors.textGray, marginLeft: spacing.sm }}
          >
            {formatTime(chat.lastMessageAt)}
          </AppText>
        </View>

        {/* Ad Title (optional) */}
        {adTitle && (
          <View style={[styles.adTitleRow, { marginTop: spacing.xs }]}>
            <Feather
              name="package"
              size={icons.sm}
              color={colors.iconGray}
              style={{ marginRight: spacing.xs }}
            />
            <AppText
              variant="sm"
              style={{ color: colors.textLightGray, flex: 1 }}
              numberOfLines={1}
            >
              {adTitle}
            </AppText>
          </View>
        )}

        {/* Last Message and Badge */}
        <View style={[styles.bottomRow, { marginTop: spacing.xs }]}>
          <AppText
            variant="sm"
            style={{ color: colors.text, flex: 1 }}
            numberOfLines={1}
          >
            {chat.lastMessage || "No messages yet"}
          </AppText>
          {chat.unreadCount && chat.unreadCount > 0 && (
            <Badge
              count={chat.unreadCount}
              style={{ marginLeft: spacing.sm }}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  adTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
