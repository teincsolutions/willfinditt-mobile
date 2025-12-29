import { useTheme } from "@/contexts/ThemeContext";
import { NotificationResponse } from "@/services/pushNotificationService";
import { formatDistanceToNow } from "date-fns";
import { Pressable } from "react-native";
import AppText from "../ui/AppText";
import AppView from "../ui/AppView";

interface NotificationCardProps {
  notification: NotificationResponse;
  onPress: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <Pressable
      style={{
        backgroundColor: notification.read
          ? colors.background
          : colors.backgroundSecondary,
        padding: spacing.md,
        marginHorizontal: spacing.md,
        marginVertical: spacing.xs,
        borderRadius: spacing.sm,
        borderLeftWidth: 3,
        borderLeftColor: notification.read ? colors.border : colors.primary,
      }}
      onPress={onPress}
    >
      <AppView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <AppView style={{ flex: 1 }}>
          <AppText
            style={{
              ...typography.body,
              fontWeight: notification.read ? "400" : "600",
              color: notification.read ? colors.textGray : colors.text,
            }}
          >
            {notification.title}
          </AppText>
          <AppText
            style={{
              ...typography.caption,
              color: colors.textGray,
              marginTop: spacing.xs,
            }}
          >
            {notification.body}
          </AppText>
          <AppText
            style={{
              ...typography.caption,
              color: colors.textLightGray,
              marginTop: spacing.xs,
            }}
          >
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </AppText>
        </AppView>
      </AppView>
    </Pressable>
  );
};
