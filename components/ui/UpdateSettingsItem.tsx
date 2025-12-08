import { useTheme } from "@/contexts/ThemeContext";
import { checkForUpdatesWithAlert } from "@/hooks/useOTAUpdates";
import { getCurrentUpdateInfo, getUpdateStats } from "@/utils/otaUpdateManager";
import * as Updates from "expo-updates";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface UpdateSettingsItemProps {
  onPress?: () => void;
}

/**
 * Update Settings Item Component
 * 
 * Displays current version info and allows manual update checks
 * Can be used in Settings screen
 * 
 * Usage:
 * ```tsx
 * <UpdateSettingsItem />
 * ```
 */
export function UpdateSettingsItem({ onPress }: UpdateSettingsItemProps) {
  const { colors, spacing } = useTheme();
  const [isChecking, setIsChecking] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<any>(null);

  React.useEffect(() => {
    loadUpdateInfo();
  }, []);

  const loadUpdateInfo = async () => {
    const info = await getCurrentUpdateInfo();
    const stats = getUpdateStats();
    setUpdateInfo({ ...info, ...stats });
  };

  const handleCheckForUpdates = async () => {
    if (isChecking) return;

    setIsChecking(true);
    try {
      await checkForUpdatesWithAlert();
      await loadUpdateInfo();
    } catch (error) {
      console.error("Error checking for updates:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleShowUpdateInfo = () => {
    if (!updateInfo) return;

    const infoText = `
Current Version: ${Updates.runtimeVersion || "Unknown"}
Update ID: ${updateInfo.updateId || "Embedded"}
Channel: ${updateInfo.channel || "None"}
Runtime Version: ${updateInfo.runtimeVersion || "N/A"}
Total Updates: ${updateInfo.updateCount || 0}
Last Check: ${updateInfo.lastCheckTime?.toLocaleString() || "Never"}
${updateInfo.lastUpdateTime ? `Last Update: ${updateInfo.lastUpdateTime.toLocaleString()}` : ""}
    `.trim();

    Alert.alert("Update Information", infoText, [{ text: "OK" }]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.item,
          {
            borderBottomColor: colors.border,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.md,
          },
        ]}
        onPress={onPress || handleCheckForUpdates}
        disabled={isChecking}
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Software Update
            </Text>
            <Text style={[styles.subtitle, { color: colors.textGray }]}>
              {__DEV__
                ? "Development Mode"
                : updateInfo?.updateId
                ? `Version ${Updates.runtimeVersion || "1.0.0"}`
                : "Check for updates"}
            </Text>
          </View>
          {isChecking ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Text style={[styles.arrow, { color: colors.textGray }]}>
              ›
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {!__DEV__ && updateInfo && (
        <TouchableOpacity
          style={[
            styles.infoButton,
            {
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderTopColor: colors.border,
            },
          ]}
          onPress={handleShowUpdateInfo}
        >
          <Text style={[styles.infoText, { color: colors.primary }]}>
            View Update Details
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  item: {
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  arrow: {
    fontSize: 24,
    fontWeight: "300",
  },
  infoButton: {
    borderTopWidth: 1,
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
