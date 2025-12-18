# SSL Pinning via Expo Native Module (Expo Bare + EAS)

## Overview

This document describes how to implement SSL certificate / public-key pinning in an Expo Bare React Native application using an Expo Native Module.

## Why SSL Pinning

SSL pinning protects against Man-in-the-Middle (MITM) attacks by trusting only known certificates or public keys.

## Architecture

axios / fetch
-> React Native Networking
-> Native Networking

- Android: OkHttp CertificatePinner
- iOS: NSURLSession SPKI validation

## Preconditions

- Expo Bare workflow
- EAS Build enabled
- Native Android and iOS access

## Step 1: Create Expo Native Module

```bash
npx create-expo-module expo-ssl-pinning
```

This is the only command you need. It creates the module structure with everything required.

## Step 2: Configure the Module as a Config Plugin

### Key Concept (Important)

Every Expo Native Module can also be a Config Plugin. This is built-in.

Expo automatically loads:

- `expo-module.config.json`
- The plugin entry defined there
- During `expo prebuild` / `eas build`

### Edit `expo-module.config.json`

Located at the root of your module, edit it like this:

```json
{
  "name": "expo-ssl-pinning",
  "version": "1.0.0",
  "platforms": ["ios", "android"],
  "ios": {
    "modules": ["ExpoSslPinningModule"]
  },
  "android": {
    "modules": ["expo.modules.sslpinning.ExpoSslPinningModule"]
  },
  "plugin": {
    "file": "./plugin.js"
  }
}
```

👉 This tells Expo:

- "This module has a config plugin"
- "Run it at build time"

### Create `plugin.js` at Module Root

Add this file at the root of your module (not in `/plugins`):

```javascript
const { withInfoPlist, withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withExpoSslPinning(config, props) {
  const pinning = props?.sslPinning;
  if (!pinning) return config;

  // iOS → Info.plist
  config = withInfoPlist(config, (cfg) => {
    cfg.modResults.SSL_PINNING = pinning;
    return cfg;
  });

  // Android → AndroidManifest meta-data
  config = withAndroidManifest(config, (cfg) => {
    const app = cfg.modResults.manifest.application[0];
    app["meta-data"] = app["meta-data"] || [];

    app["meta-data"].push({
      $: {
        "android:name": "SSL_PINNING",
        "android:value": JSON.stringify(pinning),
      },
    });

    return cfg;
  });

  return config;
};
```

✔ This is inside the module  
✔ This is Expo-native-module style  
✔ No external plugin folder

## Step 3: Android SSL Pinning

File: android/.../ExpoSslPinningModule.kt

Use OkHttp CertificatePinner scoped to api.yourdomain.com.

## Step 4: iOS SSL Pinning

Create SSLTrustManager.swift and validate SPKI hash inside URLSession challenge handler.

## Step 5: JavaScript

No JS changes required. axios works unchanged.

## Step 6: Use the Module in Your App

### Add to `app.config.js` (or `app.json`)

In your consumer app (the main React Native app), configure the plugin:

```javascript
export default {
  expo: {
    plugins: [
      [
        "expo-ssl-pinning",
        {
          sslPinning: {
            hosts: {
              "api.yourdomain.com": [
                "PRIMARY_BASE64_SPKI_HASH",
                "BACKUP_BASE64_SPKI_HASH",
              ],
            },
          },
        },
      ],
    ],
  },
};
```

Replace:

- `api.yourdomain.com` with your actual API domain
- `PRIMARY_BASE64_SPKI_HASH` with your generated hash (see Step 7)
- `BACKUP_BASE64_SPKI_HASH` with a backup certificate hash

**Important:** Always include at least 2 hashes (primary + backup) to prevent lockout during certificate rotation.

## Step 7: Generate SPKI Hash

Use openssl to generate base64 sha256 public key hash.

### Option A: You Have Cert File

Command

```bash
openssl x509 -in cert.pem -pubkey -noout | \
openssl pkey -pubin -outform DER | \
openssl dgst -sha256 -binary | \
base64
```

### Option B: You Only Have the Domain (No Cert File)

You can extract the cert directly from the server.

Command

```bash
openssl s_client -connect api.yourdomain.com:443 -servername api.yourdomain.com </dev/null | \
openssl x509 -pubkey -noout | \
openssl pkey -pubin -outform DER | \
openssl dgst -sha256 -binary | \
base64
```

## Step 8: Build

```bash
expo prebuild
eas build
```

## Notes

- Pin only your backend domains
- Never pin Firebase, Google, Expo services
- Always include a backup key
