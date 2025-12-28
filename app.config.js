
import config from './app.json';

export default ({ config: expoConfig }) => {
  // Check if we're building with EAS
  const isEasBuild = process.env.EAS_BUILD === 'true';

  // Get secure API key from environment
  const oneNightNotifyApiKey = process.env.ONE_NIGHT_NOTIFY_API_KEY || 'your-secure-api-key-here';

  if (isEasBuild) {
    // When building with EAS, don't specify googleServicesFile
    // EAS will automatically use the files from secrets
    console.log('🔧 EAS Build: Using Firebase config from EAS secrets');
    console.log('🔑 API Key loaded from EAS environment');
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
  } else {
    // For local development, use local config files
    console.log('🔧 Local Development: Using local Firebase config files');
    console.log('🔑 API Key loaded from local .env');
    return {
      ...config,
      expo: {
        ...config.expo,
        extra: {
          ...config.expo.extra,
          ONE_NIGHT_NOTIFY_API_KEY: oneNightNotifyApiKey,
        },
        android: {
          ...config.expo.android,
          googleServicesFile: './config/google-services.json',
        },
        ios: {
          ...config.expo.ios,
          googleServicesFile: './config/GoogleService-Info.plist',
        },
      },
    };
  }
};