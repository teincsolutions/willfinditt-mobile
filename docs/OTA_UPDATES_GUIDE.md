# Expo OTA Updates Implementation Guide

## Overview

This implementation provides a complete OTA (Over-The-Air) update system for the WillFinditt mobile app using Expo Updates.

## Features

- ✅ Automatic update checks on app launch
- ✅ Background update downloads
- ✅ User-friendly update banner
- ✅ Manual update checking in settings
- ✅ Update throttling to prevent excessive checks
- ✅ Update statistics tracking
- ✅ Skip version functionality
- ✅ MMKV persistence for update data

## Configuration

### app.json

The app is already configured with:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/a1cc53be-bfd0-48ae-8957-04067be533e2"
    }
  }
}
```

## Components

### 1. OTAUpdateBanner

A banner that displays at the top of the app when updates are available.

**Location:** `components/ui/OTAUpdateBanner.tsx`

**Props:**
- `autoDownload?: boolean` - Auto-download updates when available (default: false)
- `checkOnMount?: boolean` - Check for updates on mount (default: true)
- `containerStyle?: object` - Custom styles for the banner

**Usage in Root Layout:**

```tsx
import { OTAUpdateBanner } from "@/components/ui/OTAUpdateBanner";

export default function RootLayout() {
  return (
    <>
      <OTAUpdateBanner checkOnMount autoDownload={false} />
      {/* Your app content */}
    </>
  );
}
```

### 2. UpdateSettingsItem

A settings screen component for manual update checks.

**Location:** `components/ui/UpdateSettingsItem.tsx`

**Usage in Settings Screen:**

```tsx
import { UpdateSettingsItem } from "@/components/ui/UpdateSettingsItem";

export default function SettingsScreen() {
  return (
    <ScrollView>
      {/* Other settings */}
      <UpdateSettingsItem />
    </ScrollView>
  );
}
```

## Hooks

### useOTAUpdates

Main hook for managing OTA updates.

**Location:** `hooks/useOTAUpdates.ts`

**Parameters:**
- `checkOnMount?: boolean` - Check for updates on mount (default: true)
- `autoDownload?: boolean` - Auto-download updates (default: false)

**Returns:**

```typescript
{
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
```

**Usage:**

```tsx
import { useOTAUpdates } from "@/hooks/useOTAUpdates";

function MyComponent() {
  const {
    isUpdateAvailable,
    isUpdatePending,
    checkForUpdates,
    downloadUpdate,
    reloadApp,
  } = useOTAUpdates(true, false);

  return (
    <View>
      {isUpdateAvailable && (
        <Button title="Download Update" onPress={downloadUpdate} />
      )}
      {isUpdatePending && (
        <Button title="Restart App" onPress={reloadApp} />
      )}
    </View>
  );
}
```

### checkForUpdatesWithAlert

Utility function for checking updates with native alert dialog.

**Usage:**

```tsx
import { checkForUpdatesWithAlert } from "@/hooks/useOTAUpdates";

<Button
  title="Check for Updates"
  onPress={checkForUpdatesWithAlert}
/>
```

## Utilities

### OTA Update Manager

**Location:** `utils/otaUpdateManager.ts`

**Functions:**

#### Update Information
- `getCurrentUpdateInfo()` - Get current update details
- `getUpdateStats()` - Get update statistics

#### Throttling
- `shouldCheckForUpdate(intervalHours)` - Check if enough time passed
- `checkForUpdatesThrottled(intervalHours)` - Check with throttling

#### Tracking
- `recordUpdateCheck()` - Record when checked
- `recordUpdateApplied()` - Record when update applied
- `getLastUpdateCheckTime()` - Get last check time
- `getLastUpdateTime()` - Get last update time
- `getUpdateCount()` - Get total updates count

#### Version Management
- `skipVersion(manifestId)` - Mark version to skip
- `isVersionSkipped(manifestId)` - Check if version skipped
- `clearSkippedVersion()` - Clear skipped version

#### Quick Actions
- `downloadAndApplyUpdate()` - Download and apply update in one call

## Publishing Updates

### 1. Development Updates

```bash
# Publish to development channel
eas update --branch development --message "Bug fixes"
```

### 2. Preview Updates

```bash
# Publish to preview channel
eas update --branch preview --message "New features for testing"
```

### 3. Production Updates

```bash
# Publish to production channel
eas update --branch production --message "Version 1.0.1 - Bug fixes and improvements"
```

## Update Flow

### Automatic Update Flow

1. App launches
2. `OTAUpdateBanner` checks for updates (if not throttled)
3. If update available, banner shows "New update available"
4. User clicks "Download"
5. Update downloads in background
6. Banner shows "Update ready! Restart to apply"
7. User clicks "Restart"
8. App reloads with new version

### Manual Update Flow

1. User goes to Settings
2. Taps "Software Update"
3. Alert shows update status
4. If available, user chooses to download
5. After download, alert prompts restart
6. User confirms restart
7. App reloads with new version

## Best Practices

### 1. Update Throttling

Don't check for updates too frequently:

```typescript
// Check at most every 4 hours
if (shouldCheckForUpdate(4)) {
  await checkForUpdates();
}
```

### 2. Background Downloads

Enable auto-download for better UX:

```tsx
<OTAUpdateBanner autoDownload={true} />
```

### 3. User Control

Always give users control:
- Show what's new in updates
- Allow them to skip versions
- Provide manual check option

### 4. Error Handling

Always handle update errors gracefully:

```typescript
const { error, status } = useOTAUpdates();

if (error) {
  console.error("Update error:", error);
  // Show user-friendly message
}
```

## Testing

### Test in Development

OTA updates don't work in development mode. To test:

1. Create a development build:
```bash
eas build --profile development --platform android
```

2. Install the build on device

3. Publish an update:
```bash
eas update --branch development
```

4. Open the app and check for updates

### Test Update Channels

Create different update channels for different environments:

```json
// eas.json
{
  "build": {
    "development": {
      "channel": "development"
    },
    "preview": {
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

## Monitoring

### View Update Metrics

Check Expo dashboard for:
- Update download count
- Update success rate
- Active versions
- Rollout percentage

### Debug Information

Get debug info in console:

```typescript
const info = await getCurrentUpdateInfo();
console.log("Update Info:", info);

const stats = getUpdateStats();
console.log("Update Stats:", stats);
```

## Common Issues

### 1. Updates Not Showing

**Problem:** App doesn't show available updates

**Solutions:**
- Verify runtime version matches in app.json
- Check update channel configuration
- Ensure not in development mode
- Clear app data and reinstall

### 2. Update Download Fails

**Problem:** Update download fails or hangs

**Solutions:**
- Check internet connection
- Verify Expo project ID is correct
- Check for CORS issues
- Try manual update check

### 3. App Doesn't Restart After Update

**Problem:** Update downloads but app doesn't restart

**Solutions:**
- Ensure `Updates.reloadAsync()` is called
- Check for errors in console
- Verify update was actually downloaded

## Environment Variables

Add to `.env` file:

```env
EXPO_PUBLIC_UPDATE_CHANNEL=production
EXPO_PUBLIC_UPDATE_CHECK_INTERVAL=4
```

## Security Considerations

1. **Code Signing:** EAS Update uses code signing automatically
2. **Runtime Version:** Controls compatibility between JS and native code
3. **Rollback:** Can rollback bad updates via Expo dashboard
4. **Gradual Rollout:** Roll out updates gradually to percentage of users

## Resources

- [Expo Updates Documentation](https://docs.expo.dev/versions/latest/sdk/updates/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [Publishing Updates Guide](https://docs.expo.dev/eas-update/getting-started/)

## Support

For issues or questions about OTA updates:
1. Check console logs for errors
2. Review Expo dashboard for update status
3. Test with development build
4. Contact Expo support if needed
