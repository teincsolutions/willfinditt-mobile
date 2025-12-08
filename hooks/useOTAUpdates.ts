import * as Updates from "expo-updates";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export type UpdateStatus = 
  | "idle"
  | "checking"
  | "downloading"
  | "ready"
  | "error"
  | "up-to-date";

interface UpdateInfo {
  isAvailable: boolean;
  manifest?: Updates.Manifest;
}

interface UseOTAUpdatesReturn {
  status: UpdateStatus;
  isChecking: boolean;
  isDownloading: boolean;
  isUpdateAvailable: boolean;
  isUpdatePending: boolean;
  updateInfo: UpdateInfo | null;
  error: Error | null;
  checkForUpdates: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
  reloadApp: () => Promise<void>;
  currentUpdateId: string | undefined;
  lastCheckTime: Date | null;
}

/**
 * Hook for managing Expo OTA updates
 * 
 * Features:
 * - Check for updates on mount and on demand
 * - Download updates in background
 * - Reload app to apply updates
 * - Track update status and errors
 * 
 * @param checkOnMount - Whether to check for updates on component mount (default: true)
 * @param autoDownload - Whether to automatically download available updates (default: false)
 */
export function useOTAUpdates(
  checkOnMount = true,
  autoDownload = false
): UseOTAUpdatesReturn {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  const isChecking = status === "checking";
  const isDownloading = status === "downloading";

  // Get current update ID
  const currentUpdateId = Updates.updateId ?? undefined;

  /**
   * Check for available updates
   */
  const checkForUpdates = useCallback(async () => {
    // Skip in development mode
    if (__DEV__) {
      console.log("OTA Updates: Skipping update check in development mode");
      return;
    }

    try {
      setStatus("checking");
      setError(null);

      const update = await Updates.checkForUpdateAsync();
      setLastCheckTime(new Date());

      if (update.isAvailable) {
        setIsUpdateAvailable(true);
        setUpdateInfo({
          isAvailable: true,
          manifest: update.manifest,
        });
        setStatus("idle");

        console.log("OTA Updates: Update available", {
          manifestId: update.manifest?.id,
        });

        // Auto-download if enabled
        if (autoDownload) {
          await downloadUpdate();
        }
      } else {
        setIsUpdateAvailable(false);
        setUpdateInfo({ isAvailable: false });
        setStatus("up-to-date");
        console.log("OTA Updates: App is up to date");
      }
    } catch (err) {
      const error = err as Error;
      console.error("OTA Updates: Error checking for updates", error);
      setError(error);
      setStatus("error");
    }
  }, [autoDownload]);

  /**
   * Download available update
   */
  const downloadUpdate = useCallback(async () => {
    if (!isUpdateAvailable) {
      console.log("OTA Updates: No update available to download");
      return;
    }

    try {
      setStatus("downloading");
      setError(null);

      const result = await Updates.fetchUpdateAsync();

      if (result.isNew) {
        setIsUpdatePending(true);
        setStatus("ready");
        console.log("OTA Updates: Update downloaded and ready");
      } else {
        setStatus("up-to-date");
        console.log("OTA Updates: Already on latest version");
      }
    } catch (err) {
      const error = err as Error;
      console.error("OTA Updates: Error downloading update", error);
      setError(error);
      setStatus("error");
    }
  }, [isUpdateAvailable]);

  /**
   * Reload app to apply downloaded update
   */
  const reloadApp = useCallback(async () => {
    if (!isUpdatePending) {
      console.log("OTA Updates: No pending update to apply");
      return;
    }

    try {
      await Updates.reloadAsync();
    } catch (err) {
      const error = err as Error;
      console.error("OTA Updates: Error reloading app", error);
      setError(error);
    }
  }, [isUpdatePending]);

  // Check for updates on mount if enabled
  useEffect(() => {
    if (checkOnMount && !__DEV__) {
      checkForUpdates();
    }
  }, [checkOnMount, checkForUpdates]);

  return {
    status,
    isChecking,
    isDownloading,
    isUpdateAvailable,
    isUpdatePending,
    updateInfo,
    error,
    checkForUpdates,
    downloadUpdate,
    reloadApp,
    currentUpdateId,
    lastCheckTime,
  };
}

/**
 * Check for updates and show alert dialog
 * Useful for manual update checking in settings
 */
export async function checkForUpdatesWithAlert(): Promise<void> {
  if (__DEV__) {
    Alert.alert(
      "Development Mode",
      "OTA updates are not available in development mode."
    );
    return;
  }

  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      Alert.alert(
        "Update Available",
        "A new version of the app is available. Would you like to download it now?",
        [
          { text: "Later", style: "cancel" },
          {
            text: "Download",
            onPress: async () => {
              try {
                await Updates.fetchUpdateAsync();
                Alert.alert(
                  "Update Ready",
                  "The update has been downloaded. The app will restart to apply the update.",
                  [
                    {
                      text: "Restart Now",
                      onPress: () => Updates.reloadAsync(),
                    },
                  ]
                );
              } catch (error) {
                Alert.alert(
                  "Download Failed",
                  "Failed to download the update. Please try again later."
                );
              }
            },
          },
        ]
      );
    } else {
      Alert.alert("You're Up to Date", "You are using the latest version of the app.");
    }
  } catch (error) {
    Alert.alert(
      "Check Failed",
      "Unable to check for updates. Please try again later."
    );
  }
}
