import { fcmService } from "@/services/fcmService";
import { storage } from "@/utils/mmkvStorage";
import { useCallback } from "react";
import { useMMKVObject } from "react-native-mmkv";
import { toast } from "sonner-native";

// ============================================
// Notification Topics Configuration
// ============================================

export const NOTIFICATION_TOPICS = {
  PROMOTIONS: "promotions",
  SYSTEM: "system",
  ADS: "ads",
} as const;

export type NotificationTopic =
  (typeof NOTIFICATION_TOPICS)[keyof typeof NOTIFICATION_TOPICS];

export interface NotificationTopicSettings {
  [NOTIFICATION_TOPICS.PROMOTIONS]: boolean;
  [NOTIFICATION_TOPICS.SYSTEM]: boolean;
  [NOTIFICATION_TOPICS.ADS]: boolean;
}

// ============================================
// Storage Key
// ============================================

const TOPIC_SETTINGS_KEY = "notification_topic_settings";

// ============================================
// Default Settings
// ============================================

const DEFAULT_TOPIC_SETTINGS: NotificationTopicSettings = {
  [NOTIFICATION_TOPICS.PROMOTIONS]: false,
  [NOTIFICATION_TOPICS.SYSTEM]: false,
  [NOTIFICATION_TOPICS.ADS]: false,
};

// ============================================
// Topic Subscription Hooks
// ============================================

export const useNotificationTopics = () => {
  // Use MMKV reactive hook for automatic re-renders and persistence
  const [topicSubscriptions, setTopicSubscriptions] =
    useMMKVObject<NotificationTopicSettings>(TOPIC_SETTINGS_KEY, storage);

  // Ensure we always have valid settings
  const currentSubscriptions = topicSubscriptions || DEFAULT_TOPIC_SETTINGS;

  const toggleTopicSubscription = useCallback(
    (topic: NotificationTopic) => {
      try {
        const isSubscribed = currentSubscriptions[topic];

        if (isSubscribed) {
          // Unsubscribe from FCM topic
          fcmService.unsubscribeFromTopic(topic);
          // Update local state
          setTopicSubscriptions((prev) =>
            prev
              ? { ...prev, [topic]: false }
              : { ...DEFAULT_TOPIC_SETTINGS, [topic]: false }
          );
          toast.success(
            `Unsubscribed from ${getTopicDisplayName(topic)} notifications`
          );
        } else {
          // Subscribe to FCM topic
          fcmService.subscribeToTopic(topic);
          // Update local state
          setTopicSubscriptions((prev) =>
            prev
              ? { ...prev, [topic]: true }
              : { ...DEFAULT_TOPIC_SETTINGS, [topic]: true }
          );
          toast.success(
            `Subscribed to ${getTopicDisplayName(topic)} notifications`
          );
        }
      } catch (error) {
        console.error(`Error toggling ${topic} subscription:`, error);
        toast.error(
          `Failed to update ${getTopicDisplayName(topic)} notifications`
        );
      }
    },
    [currentSubscriptions, setTopicSubscriptions]
  );

  const updateAllTopicSubscriptions = useCallback(
    (settings: NotificationTopicSettings) => {
      try {
        // Subscribe/unsubscribe based on new settings
        Object.entries(settings).forEach(([topic, enabled]) => {
          const topicKey = topic as NotificationTopic;
          const currentlyEnabled = currentSubscriptions[topicKey];

          if (enabled && !currentlyEnabled) {
            fcmService.subscribeToTopic(topicKey);
          } else if (!enabled && currentlyEnabled) {
            fcmService.unsubscribeFromTopic(topicKey);
          }
        });

        // Update local state
        setTopicSubscriptions(settings);
        toast.success("Notification preferences updated");
      } catch (error) {
        console.error("Error updating topic subscriptions:", error);
        toast.error("Failed to update notification preferences");
      }
    },
    [currentSubscriptions, setTopicSubscriptions]
  );

  return {
    topicSubscriptions: currentSubscriptions,
    toggleTopicSubscription,
    updateAllTopicSubscriptions,
    isLoading: false, // MMKV operations are synchronous
  };
};

// ============================================
// Utility Functions
// ============================================

const getTopicDisplayName = (topic: NotificationTopic): string => {
  switch (topic) {
    case NOTIFICATION_TOPICS.PROMOTIONS:
      return "Promotions";
    case NOTIFICATION_TOPICS.SYSTEM:
      return "System";
    case NOTIFICATION_TOPICS.ADS:
      return "Ad Updates";
    default:
      return topic;
  }
};
