import { useAuth } from "@/hooks/useAuth";
import { fcmService } from "@/services/fcmService";
import { storage } from "@/utils/mmkvStorage";
import { useCallback } from "react";
import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVObject,
  useMMKVString
} from "react-native-mmkv";
import { toast } from "sonner-native";

// ============================================
// MMKV Hook Usage Guide
// ============================================
//
// React Native MMKV provides several hooks for different data types:
//
// 1. useMMKVString(key, storage?) - For string values
//    const [value, setValue] = useMMKVString("my_key");
//    - Returns: [string | undefined, (value: string | undefined) => void]
//    - Use case: User names, tokens, preferences as strings
//
// 2. useMMKVBoolean(key, storage?) - For boolean values
//    const [value, setValue] = useMMKVBoolean("my_key");
//    - Returns: [boolean | undefined, (value: boolean | undefined) => void]
//    - Use case: Feature toggles, settings switches, flags
//
// 3. useMMKVNumber(key, storage?) - For numeric values
//    const [value, setValue] = useMMKVNumber("my_key");
//    - Returns: [number | undefined, (value: number | undefined) => void]
//    - Use case: Counters, sizes, indices, timestamps
//
// 4. useMMKVObject<T>(key, storage?) - For complex objects
//    const [value, setValue] = useMMKVObject<MyType>("my_key");
//    - Returns: [T | undefined, (value: T | undefined) => void]
//    - Use case: Structured data, settings objects, user preferences
//    - Automatically handles JSON serialization/deserialization
//
// 5. useMMKVBuffer(key, storage?) - For binary data
//    const [value, setValue] = useMMKVBuffer("my_key");
//    - Returns: [Uint8Array | undefined, (value: Uint8Array | undefined) => void]
//    - Use case: Images, files, encrypted data
//
// 6. useMMKVListener(keys, callback, storage?) - Listen for changes
//    useMMKVListener(["key1", "key2"], (key, value) => {...});
//    - Use case: React to storage changes across the app
//
// 7. useMMKVKeys(storage?) - Get all keys
//    const keys = useMMKVKeys();
//    - Returns: string[]
//    - Use case: Debugging, bulk operations
//
// All hooks automatically:
// - Persist data to MMKV storage
// - Trigger re-renders when values change
// - Work with the provided storage instance (falls back to default if not provided)
//
// ============================================

export const NOTIFICATION_TOPICS = {
  PROMOTIONS: "promotions",
  SYSTEM: "system",
  ADS: "ads",
} as const;

export type NotificationTopic =
  (typeof NOTIFICATION_TOPICS)[keyof typeof NOTIFICATION_TOPICS];

// Define which topics are promotional (require authentication)
export const PROMOTIONAL_TOPICS: NotificationTopic[] = [
  NOTIFICATION_TOPICS.PROMOTIONS,
  NOTIFICATION_TOPICS.ADS,
];

// Define which topics are general system topics (available to all users)
export const SYSTEM_TOPICS: NotificationTopic[] = [
  NOTIFICATION_TOPICS.SYSTEM,
];

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
// Example MMKV Hook Usages for Different Data Types
// ============================================

/*
// STRING STORAGE EXAMPLE:
// Use useMMKVString for storing simple string values
const [userName, setUserName] = useMMKVString("user_name", storage);
// - Automatically persists to MMKV
// - Returns [string | undefined, (value: string | undefined) => void]
// - Great for user preferences, settings, etc.

// BOOLEAN STORAGE EXAMPLE:
// Use useMMKVBoolean for true/false values
const [isDarkMode, setIsDarkMode] = useMMKVBoolean("dark_mode", storage);
// - Returns [boolean | undefined, (value: boolean | undefined) => void]
// - Perfect for toggles, flags, feature switches

// NUMBER STORAGE EXAMPLE:
// Use useMMKVNumber for numeric values
const [fontSize, setFontSize] = useMMKVNumber("font_size", storage);
// - Returns [number | undefined, (value: number | undefined) => void]
// - Ideal for counters, sizes, indices, etc.

// OBJECT STORAGE EXAMPLE (currently used):
// Use useMMKVObject for complex objects (automatically JSON serialized)
const [settings, setSettings] = useMMKVObject<MySettings>("app_settings", storage);
// - Returns [T | undefined, (value: T | undefined) => void]
// - Handles JSON serialization/deserialization automatically
// - Best for structured data like user preferences, app state, etc.

// BUFFER STORAGE EXAMPLE:
// Use useMMKVBuffer for binary data
const [imageData, setImageData] = useMMKVBuffer("cached_image", storage);
// - Returns [Uint8Array | undefined, (value: Uint8Array | undefined) => void]
// - Useful for caching binary data like images, files, etc.
*/

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
  // OBJECT: Topic subscriptions (complex structured data)
  const [topicSubscriptions, setTopicSubscriptions] =
    useMMKVObject<NotificationTopicSettings>(TOPIC_SETTINGS_KEY, storage);

  // BOOLEAN: Master notification toggle
  const [notificationsEnabled, setNotificationsEnabled] = useMMKVBoolean(
    "notifications_master_toggle",
    storage
  );

  // STRING: Last notification preference update timestamp
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useMMKVString(
    "notification_settings_updated_at",
    storage
  );

  // NUMBER: Total notifications received counter
  const [totalNotificationsReceived, setTotalNotificationsReceived] = useMMKVNumber(
    "total_notifications_count",
    storage
  );

  // Get authentication state
  const { isAuthenticated } = useAuth();

  // Ensure we always have valid settings
  const currentSubscriptions = topicSubscriptions || DEFAULT_TOPIC_SETTINGS;

  const toggleTopicSubscription = useCallback(
    (topic: NotificationTopic) => {
      try {
        // Check if user is trying to subscribe to a promotional topic without being authenticated
        const isPromotionalTopic = PROMOTIONAL_TOPICS.includes(topic);
        const isSystemTopic = SYSTEM_TOPICS.includes(topic);

        if (isPromotionalTopic && !isAuthenticated) {
          toast.error("Please login to subscribe to promotional notifications");
          return;
        }

        // Only allow system topics for non-authenticated users
        if (!isAuthenticated && !isSystemTopic) {
          toast.error("Please login to subscribe to this type of notifications");
          return;
        }

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
    [currentSubscriptions, setTopicSubscriptions, isAuthenticated]
  );

  const updateAllTopicSubscriptions = useCallback(
    (settings: NotificationTopicSettings) => {
      try {
        // Filter settings based on authentication status
        const filteredSettings = { ...settings };

        if (!isAuthenticated) {
          // For non-authenticated users, only allow system topics
          PROMOTIONAL_TOPICS.forEach(topic => {
            if (filteredSettings[topic]) {
              filteredSettings[topic] = false;
            }
          });
        }

        // Subscribe/unsubscribe based on filtered settings
        Object.entries(filteredSettings).forEach(([topic, enabled]) => {
          const topicKey = topic as NotificationTopic;
          const currentlyEnabled = currentSubscriptions[topicKey];

          if (enabled && !currentlyEnabled) {
            fcmService.subscribeToTopic(topicKey);
          } else if (!enabled && currentlyEnabled) {
            fcmService.unsubscribeFromTopic(topicKey);
          }
        });

        // Update local state
        setTopicSubscriptions(filteredSettings);

        if (!isAuthenticated && Object.values(settings).some((enabled, index) =>
          enabled && PROMOTIONAL_TOPICS.includes(Object.keys(settings)[index] as NotificationTopic)
        )) {
          toast.success("Notification preferences updated. Login to access promotional notifications.");
        } else {
          toast.success("Notification preferences updated");
        }
      } catch (error) {
        console.error("Error updating topic subscriptions:", error);
        toast.error("Failed to update notification preferences");
      }
    },
    [currentSubscriptions, setTopicSubscriptions, isAuthenticated]
  );

  const isTopicAvailable = useCallback(
    (topic: NotificationTopic): boolean => {
      if (isAuthenticated) {
        return true; // Authenticated users can subscribe to all topics
      }
      return SYSTEM_TOPICS.includes(topic); // Non-authenticated users can only subscribe to system topics
    },
    [isAuthenticated]
  );

  const updateNotificationCounter = useCallback(() => {
    // NUMBER: Increment total notifications received
    setTotalNotificationsReceived(prev => (prev || 0) + 1);
  }, [setTotalNotificationsReceived]);

  const updateLastModifiedTimestamp = useCallback(() => {
    // STRING: Update timestamp when settings change
    setLastUpdateTimestamp(new Date().toISOString());
  }, [setLastUpdateTimestamp]);

  const toggleMasterNotifications = useCallback(() => {
    // BOOLEAN: Toggle master notification setting
    setNotificationsEnabled(prev => !prev);
    updateLastModifiedTimestamp();
  }, [setNotificationsEnabled, updateLastModifiedTimestamp]);

  const enforceAuthenticationRestrictions = useCallback(() => {
    if (!isAuthenticated) {
      // Unsubscribe from all promotional topics for non-authenticated users
      const updatedSettings = { ...currentSubscriptions };
      let hasChanges = false;

      PROMOTIONAL_TOPICS.forEach(topic => {
        if (updatedSettings[topic]) {
          fcmService.unsubscribeFromTopic(topic);
          updatedSettings[topic] = false;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setTopicSubscriptions(updatedSettings);
        console.log("Unsubscribed from promotional topics due to logout");
      }
    }
  }, [currentSubscriptions, setTopicSubscriptions, isAuthenticated]);

  return {
    // Core topic subscriptions (OBJECT)
    topicSubscriptions: currentSubscriptions,

    // Additional MMKV-stored values
    notificationsEnabled: notificationsEnabled ?? true, // BOOLEAN - defaults to true
    lastUpdateTimestamp, // STRING
    totalNotificationsReceived: totalNotificationsReceived ?? 0, // NUMBER - defaults to 0

    // Core functions
    toggleTopicSubscription,
    updateAllTopicSubscriptions,
    enforceAuthenticationRestrictions,
    isTopicAvailable,

    // Additional utility functions
    updateNotificationCounter,
    updateLastModifiedTimestamp,
    toggleMasterNotifications,

    // Auth state
    isAuthenticated,
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
