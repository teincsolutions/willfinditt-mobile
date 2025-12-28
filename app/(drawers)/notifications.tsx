import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import { useAuth } from "@/hooks/useAuth";
import { useMarkPushNotificationRead, usePushNotifications } from "@/hooks/useOneNightNotifications";
import { useTheme } from "@/hooks/useTheme";
import { NotificationResponse } from "@/services/pushNotificationService";
import { formatDistanceToNow } from "date-fns";
import Drawer from "expo-router/drawer";
import React from "react";
import { ActivityIndicator, FlatList, RefreshControl, TouchableOpacity, View } from "react-native";

interface NotificationItemProps {
  notification: NotificationResponse;
  onPress: () => void;
  onMarkRead: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onMarkRead,
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: notification.read ? colors.background : colors.backgroundSecondary,
        padding: spacing.md,
        marginHorizontal: spacing.md,
        marginVertical: spacing.xs,
        borderRadius: spacing.sm,
        borderLeftWidth: 3,
        borderLeftColor: notification.read ? colors.border : colors.primary,
      }}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
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
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </AppText>
        </View>
        {!notification.read && (
          <TouchableOpacity
            onPress={onMarkRead}
            style={{
              padding: spacing.xs,
              backgroundColor: colors.primary,
              borderRadius: spacing.xs,
            }}
          >
            <AppText style={{ ...typography.caption, color: colors.background, fontSize: 10 }}>
              Mark Read
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const { colors, spacing, icons, typography } = useTheme();
  const { user } = useAuth();

  const {
    data: notificationsData,
    isLoading,
    isRefetching,
    refetch,
  } = usePushNotifications(user?.id || "", { limit: 50 });

  const markReadMutation = useMarkPushNotificationRead();

  const handleNotificationPress = (notification: NotificationResponse) => {
    // Handle routing based on notification type and data
    handleNotificationRouting(notification);

    // Mark as read if not already
    if (!notification.read) {
      markReadMutation.mutate({
        notificationId: notification.id,
        userId: user?.id || "",
      });
    }
  };

  const handleMarkRead = (notification: NotificationResponse) => {
    markReadMutation.mutate({
      notificationId: notification.id,
      userId: user?.id || "",
    });
  };

  const renderNotification = ({ item }: { item: NotificationResponse }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
      onMarkRead={() => handleMarkRead(item)}
    />
  );

  const renderEmpty = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
      <AppText style={{ ...typography.body, color: colors.textGray, textAlign: "center" }}>
        No notifications yet
      </AppText>
      <AppText style={{ ...typography.caption, color: colors.textLightGray, textAlign: "center", marginTop: spacing.sm }}>
        You'll see your push notifications here
      </AppText>
    </View>
  );

  return (
    <AppView style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Drawer.Screen
        options={{
          header: () => (
            <Header
              left={<DrawerHeaderToggle style={{ marginStart: 0 }} />}
              title="Notifications"
              containerStyle={{
                paddingHorizontal: spacing.md,
                paddingBottom: spacing.lg,
              }}
            />
          ),
        }}
      />
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notificationsData?.data || []}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={{ flexGrow: 1, paddingTop: spacing.md }}
        />
      )}
    </AppView>
  );
}

import { handleNotificationRouting } from "@/utils/notificationRouting";
