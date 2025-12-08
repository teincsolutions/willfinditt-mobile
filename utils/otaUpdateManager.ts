import * as Updates from "expo-updates";
import { mmkvStorage } from "./mmkvStorage";

/**
 * OTA Update Manager Utility
 * 
 * Provides utility functions for managing Expo OTA updates
 */

const UPDATE_KEYS = {
    LAST_CHECK: "ota_last_check",
    LAST_UPDATE: "ota_last_update",
    UPDATE_COUNT: "ota_update_count",
    SKIP_VERSION: "ota_skip_version",
} as const;

/**
 * Get current update information
 */
export async function getCurrentUpdateInfo() {
    return {
        updateId: Updates.updateId,
        channel: Updates.channel,
        runtimeVersion: Updates.runtimeVersion,
        isEmbeddedLaunch: Updates.isEmbeddedLaunch,
        isEmergencyLaunch: Updates.isEmergencyLaunch,
        createdAt: Updates.createdAt,
        manifest: Updates.manifest,
    };
}

/**
 * Check if enough time has passed since last update check
 * @param intervalHours - Minimum hours between checks
 */
export function shouldCheckForUpdate(intervalHours: number = 4): boolean {
    const lastCheck = mmkvStorage.getNumber(UPDATE_KEYS.LAST_CHECK);

    if (!lastCheck) return true;

    const hoursSinceLastCheck = (Date.now() - lastCheck) / (1000 * 60 * 60);
    return hoursSinceLastCheck >= intervalHours;
}

/**
 * Record that we checked for updates
 */
export function recordUpdateCheck(): void {
    mmkvStorage.setNumber(UPDATE_KEYS.LAST_CHECK, Date.now());
}

/**
 * Record that an update was applied
 */
export function recordUpdateApplied(): void {
    mmkvStorage.setNumber(UPDATE_KEYS.LAST_UPDATE, Date.now());

    const currentCount = mmkvStorage.getNumber(UPDATE_KEYS.UPDATE_COUNT) || 0;
    mmkvStorage.setNumber(UPDATE_KEYS.UPDATE_COUNT, currentCount + 1);
}

/**
 * Get the last time updates were checked
 */
export function getLastUpdateCheckTime(): Date | null {
    const timestamp = mmkvStorage.getNumber(UPDATE_KEYS.LAST_CHECK);
    return timestamp ? new Date(timestamp) : null;
}

/**
 * Get the last time an update was applied
 */
export function getLastUpdateTime(): Date | null {
    const timestamp = mmkvStorage.getNumber(UPDATE_KEYS.LAST_UPDATE);
    return timestamp ? new Date(timestamp) : null;
}

/**
 * Get total number of updates applied
 */
export function getUpdateCount(): number {
    return mmkvStorage.getNumber(UPDATE_KEYS.UPDATE_COUNT) || 0;
}

/**
 * Mark a version to skip (user dismissed update)
 */
export function skipVersion(manifestId: string): void {
    mmkvStorage.setItem(UPDATE_KEYS.SKIP_VERSION, manifestId);
}

/**
 * Check if a version should be skipped
 */
export function isVersionSkipped(manifestId: string): boolean {
    const skippedVersion = mmkvStorage.getItem(UPDATE_KEYS.SKIP_VERSION);
    return skippedVersion === manifestId;
}

/**
 * Clear skipped version (when user manually checks for updates)
 */
export function clearSkippedVersion(): void {
    mmkvStorage.removeItem(UPDATE_KEYS.SKIP_VERSION);
}

/**
 * Check for updates with throttling
 * Only checks if enough time has passed since last check
 */
export async function checkForUpdatesThrottled(
    intervalHours: number = 4
): Promise<Updates.UpdateCheckResult | null> {
    if (__DEV__) {
        console.log("OTA: Skipping update check in development");
        return null;
    }

    if (!shouldCheckForUpdate(intervalHours)) {
        console.log("OTA: Skipping update check (throttled)");
        return null;
    }

    try {
        const result = await Updates.checkForUpdateAsync();
        recordUpdateCheck();

        if (result.isAvailable && result.manifest?.id) {
            // Check if this version was previously skipped
            if (isVersionSkipped(result.manifest.id)) {
                console.log("OTA: Update available but was skipped by user");
                return {
                    isAvailable: false, manifest: undefined, isRollBackToEmbedded: false,
                    reason: Updates.UpdateCheckResultNotAvailableReason.NO_UPDATE_AVAILABLE_ON_SERVER
                };
            }
        }

        return result;
    } catch (error) {
        console.error("OTA: Error checking for updates", error);
        return null;
    }
}

/**
 * Download and apply update
 */
export async function downloadAndApplyUpdate(): Promise<boolean> {
    if (__DEV__) {
        console.log("OTA: Cannot apply updates in development");
        return false;
    }

    try {
        const result = await Updates.fetchUpdateAsync();

        if (result.isNew) {
            recordUpdateApplied();
            await Updates.reloadAsync();
            return true;
        }

        return false;
    } catch (error) {
        console.error("OTA: Error downloading/applying update", error);
        return false;
    }
}

/**
 * Get update statistics
 */
export function getUpdateStats() {
    return {
        lastCheckTime: getLastUpdateCheckTime(),
        lastUpdateTime: getLastUpdateTime(),
        updateCount: getUpdateCount(),
        currentUpdateId: Updates.updateId,
        channel: Updates.channel,
    };
}
