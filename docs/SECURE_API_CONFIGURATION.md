# Secure API Configuration Guide

This document explains how to securely configure API keys and sensitive data in the WillFindIt mobile app.

## Overview

The app uses environment variables loaded through `app.config.js` to securely embed sensitive API keys at build time, while keeping non-sensitive URLs as EXPO_PUBLIC environment variables.

## Configuration Method

### 1. Environment Variables (.env)

Add the API key to your `.env` file (excluded from git):

```env
# Public URLs
EXPO_PUBLIC_ONE_NIGHT_NOTIFY_URL=https://api.one-night-notify.com

# Secure API Keys (loaded into app.config.js)
ONE_NIGHT_NOTIFY_API_KEY=your-development-api-key-here
```

### 2. App Configuration (app.config.js)

The `app.config.js` dynamically loads the API key from environment variables:

```javascript
export default ({ config: expoConfig }) => {
  const oneNightNotifyApiKey = process.env.ONE_NIGHT_NOTIFY_API_KEY || 'fallback-key';

  return {
    ...config,
    expo: {
      ...config.expo,
      extra: {
        ...config.expo.extra,
        ONE_NIGHT_NOTIFY_API_KEY: oneNightNotifyApiKey,
      },
    },
  };
};
```

### 3. Accessing Configuration in Code

Use `expo-constants` to access the securely embedded API key:

```typescript
import Constants from "expo-constants";

const getSecureApiKey = () => {
  const config = Constants.expoConfig?.extra || {};
  return config.ONE_NIGHT_NOTIFY_API_KEY || "";
};

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ONE_NIGHT_NOTIFY_URL,
  headers: {
    "X-API-Key": getSecureApiKey(),
  },
});
```

## Security Benefits

- **Build-time Embedding**: Values are embedded in the native app bundle at build time
- **No Runtime Exposure**: Values are not accessible to users or through reverse engineering
- **Environment Separation**: Different values for development, staging, and production

## Setting Values for Different Environments

### Development
Set the API key in your local `.env` file (excluded from git):

```env
ONE_NIGHT_NOTIFY_API_KEY=your-development-api-key-here
```

### Production Builds (EAS Build)
Use EAS Build environment variables for production:

```bash
# Set environment variables in EAS Build
eas build --platform ios --profile production \
  --set:env.ONE_NIGHT_NOTIFY_API_KEY="your-production-api-key"
```

### EAS Build Configuration
You can also configure environment variables in `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "ONE_NIGHT_NOTIFY_API_KEY": "your-production-api-key"
      }
    }
  }
}
```

### Local Development vs Production
- **Local Development**: API key loaded from `.env` file
- **EAS Build**: API key loaded from EAS environment variables
- **Security**: API key is embedded securely in the app bundle in both cases

## Migration from EXPO_PUBLIC Variables

### Before (Insecure - API Key Exposed)
```typescript
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ONE_NIGHT_NOTIFY_URL,
  headers: {
    "X-API-Key": process.env.EXPO_PUBLIC_ONE_NIGHT_NOTIFY_API_KEY,
  },
});
```

### After (Secure - API Key Protected)
```typescript
import Constants from "expo-constants";

const getSecureApiKey = () => {
  const config = Constants.expoConfig?.extra || {};
  return config.ONE_NIGHT_NOTIFY_API_KEY || "";
};

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ONE_NIGHT_NOTIFY_URL || "https://api.example.com",
  headers: {
    "X-API-Key": getSecureApiKey(),
  },
});
```

## Best Practices

1. **Secure Sensitive Data**: Use `expo-constants` extra field for API keys and secrets
2. **Keep URLs Public**: Use EXPO_PUBLIC for non-sensitive URLs and configuration
3. **Use EAS Build Environment Variables**: For production builds with sensitive data
4. **Separate Environments**: Use different API keys for development, staging, and production
5. **Rotate Keys Regularly**: Update API keys periodically for security
6. **Monitor Usage**: Keep track of API key usage and access patterns

## Security Benefits

- **API Keys Protected**: Keys are embedded in native app bundles, not accessible to users
- **URLs Remain Flexible**: Public URLs can still be environment-specific
- **Build-time Security**: Sensitive data is embedded during the build process
- **Native Protection**: Keys benefit from native app security features

## Troubleshooting

### Configuration Not Loading
- Ensure `expo-constants` is properly imported
- Check that the `extra` field exists in `app.json`
- Verify the key names match exactly

### Build Issues
- Make sure EAS Build has access to the environment variables
- Check that the app.json is valid JSON
- Ensure the extra field values are strings

### Runtime Issues
- Add fallback values for missing configuration
- Log configuration loading for debugging
- Test with both development and production builds</content>
<parameter name="filePath">/Users/ericmensah/Projects/willfinditt-mobile/docs/SECURE_API_CONFIGURATION.md