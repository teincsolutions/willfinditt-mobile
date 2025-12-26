import { useTheme } from "@/contexts/ThemeContext";
import { useOTAUpdates } from "@/hooks/useOTAUpdates";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface OTAUpdateBannerProps {
  /**
   * Whether to automatically download updates when available
   * @default false
   */
  autoDownload?: boolean;
  
  /**
   * Whether to check for updates on mount
   * @default true
   */
  checkOnMount?: boolean;
  
  /**
   * Custom styles for the banner container
   */
  containerStyle?: object;
}

/**
 * OTA Update Banner Component
 * 
 * Displays a banner when updates are available and manages the update flow.
 * Only shows when there's an actual update available or update is downloaded and ready to apply.
 * Does not show on errors or when no update is available.
 * 
 * Usage:
 * ```tsx
 * <OTAUpdateBanner autoDownload={false} checkOnMount={true} />
 * ```
 */
export function OTAUpdateBanner({
  autoDownload = false,
  checkOnMount = true,
  containerStyle,
}: OTAUpdateBannerProps) {
  const { colors, spacing } = useTheme();
  const {
    status,
    isUpdateAvailable,
    isUpdatePending,
    isDownloading,
    downloadUpdate,
    reloadApp,
  } = useOTAUpdates(checkOnMount, autoDownload);

  // Don't show banner in development
  if (__DEV__) {
    return null;
  }

  // Only show banner when there's an actual update available or pending
  // Don't show on errors or when no update is available
  if (!isUpdateAvailable && !isUpdatePending) {
    return null;
  }

  const handleDownload = async () => {
    await downloadUpdate();
  };

  const handleReload = async () => {
    await reloadApp();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isUpdatePending
            ? colors.success
            : colors.primary,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        },
        containerStyle,
      ]}
    >
      <View style={styles.content}>
        {isUpdatePending ? (
          <>
            <Text style={[styles.text, { color: colors.textWhite }]}>
              Update ready! Restart to apply.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.textWhite }]}
              onPress={handleReload}
            >
              <Text style={[styles.buttonText, { color: colors.success }]}>
                Restart
              </Text>
            </TouchableOpacity>
          </>
        ) : isDownloading ? (
          <>
            <Text style={[styles.text, { color: colors.textWhite }]}>
              Downloading update...
            </Text>
            <ActivityIndicator color={colors.iconWhite} size="small" />
          </>
        ) : (
          <>
            <Text style={[styles.text, { color: colors.textWhite }]}>
              New update available
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.textWhite }]}
              onPress={handleDownload}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>
                Download
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
