import DrawerHeaderToggle from "@/components/drawer/DrawerHeaderToggle";
import { NotificationCard } from "@/components/notification/NotificationCard";
import AppText from "@/components/ui/AppText";
import AppView from "@/components/ui/AppView";
import { Header } from "@/components/ui/Header";
import { useAuth } from "@/hooks/useAuth";
import {
    useMarkDevicePushNotificationsReadBulk,
    useMarkPushNotificationsReadBulk,
    useNotificationsWithAutoMark,
} from "@/hooks/useOneNightNotifications";
import { useTheme } from "@/hooks/useTheme";
import { fcmService } from "@/services/fcmService";
import { NotificationResponse } from "@/services/pushNotificationService";
import { mmkvStorage } from "@/utils/mmkvStorage";
import { handleNotificationRouting } from "@/utils/notificationRouting";
import Drawer from "expo-router/drawer";
import React, { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, spacing, icons, typography } = useTheme();
  const { user, isAuthenticated } = useAuth();
  // Get device token directly from persistent storage for non-authenticated users
  const deviceToken = mmkvStorage.getItem("fcm_token");
  const hasMarkedRead = useRef(false);

  // Clear badge when notifications page is opened
  useEffect(() => {
    fcmService.clearBadge();
  }, []);

  // Use the combined hook that handles loading
  const {
    data: notificationsData,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
    refetch,
  } = useNotificationsWithAutoMark(user?.id, deviceToken, {
    limit: 20, // Smaller page size for infinite scroll
  });
  
  const markUserReadBulkMutation = useMarkPushNotificationsReadBulk();
  const markDeviceReadBulkMutation = useMarkDevicePushNotificationsReadBulk();

  console.log("Notifications error:", error?.message);
  // Flatten the paginated data
  const allNotifications =
    notificationsData?.pages?.flatMap((page) => page.data) || [];

  // Auto-mark all unread notifications as read when screen loads
  useEffect(() => {
    if (!hasMarkedRead.current && allNotifications.length > 0) {
      const unreadIds = allNotifications
        .filter((notif) => !notif.read)
        .map((notif) => notif.id);

      if (unreadIds.length > 0) {
        hasMarkedRead.current = true;
        
        if (user?.id) {
          // Mark user notifications as read
          markUserReadBulkMutation.mutate({
            userId: user.id,
            targetIds: unreadIds,
          });
        } else if (deviceToken) {
          // Mark device notifications as read
          markDeviceReadBulkMutation.mutate({
            fcmToken: deviceToken,
            targetIds: unreadIds,
          });
        }
      }
    }
  }, [allNotifications.length, user?.id, deviceToken]);

  const handleNotificationPress = (notification: NotificationResponse) => {
    // Handle routing based on notification type and data
    handleNotificationRouting(notification);
  };

  const renderNotification = ({ item }: { item: NotificationResponse }) => (
    <NotificationCard
      notification={item}
      onPress={() => handleNotificationPress(item)}
    />
  );

  const renderEmpty = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.xl,
      }}
    >
      <AppText
        style={{
          ...typography.body,
          color: colors.textGray,
          textAlign: "center",
        }}
      >
        No notifications yet
      </AppText>
      <AppText
        style={{
          ...typography.caption,
          color: colors.textLightGray,
          textAlign: "center",
          marginTop: spacing.sm,
        }}
      >
        {isAuthenticated
          ? "You'll see your push notifications here"
          : "You'll see notifications sent to your device here"}
      </AppText>
    </View>
  );

  return (
    <AppView style={{ flex: 1 }}>
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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={allNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={{ padding: spacing.md, alignItems: "center" }}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: insets.bottom + spacing.md,
          }}
        />
      )}
    </AppView>
  );
}

