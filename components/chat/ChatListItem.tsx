import { useAd } from "@/hooks/useAds";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { formatTime } from "@/lib/formatTime";
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

export default function ChatListItem({ chat, onPress }: Props) {
  const { colors, spacing, radius, icons } = useTheme();
  const { user } = useAuth();
  // adTitle from adId
  const {data: ad} =useAd(chat?.adId||"");
  // Determine the other participant (not current user)
  const otherUser =
    chat.senderId === user?.id ? chat.receiver : chat.sender;
  const displayName =
    [otherUser.firstName, otherUser.lastName].filter(Boolean).join(" ") ||
    otherUser.username;

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
      <Avatar uri={otherUser.avatar} size="lg" verified={false} />

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
        {ad ? (
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
              {ad.title}
            </AppText>
          </View>
        ) : null}

        {/* Last Message and Badge */}
        <View style={[styles.bottomRow, { marginTop: spacing.xs }]}>
          <AppText
            variant="sm"
            style={{ color: colors.text, flex: 1 }}
            numberOfLines={1}
          >
            {chat.lastMessage || "No messages yet"}
          </AppText>
          {chat.unreadCount && chat.unreadCount > 0 ? (
            <Badge
              count={chat.unreadCount}
              style={{ marginLeft: spacing.sm }}
            />
          ) : null}
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
