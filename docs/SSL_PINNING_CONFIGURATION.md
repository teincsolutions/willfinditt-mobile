# SSL Pinning Configuration

## Overview

This project uses the `expo-ssl-pinning` module to protect against Man-in-the-Middle (MITM) attacks by validating the server's SSL certificate against known public key hashes.

## Current Configuration

The SSL pinning is configured in `app.config.js`:

```javascript
{
  sslPinning: {
    hosts: {
      'api.willfind8.com': [
        'xjCqs7iKe/Ir4XPymYzObBAv7nYMf12RzcFWh4/nXnw=', // Primary certificate
      ]
    }
  }
}
```

## ⚠️ Important: Add Backup Certificate Hash

**Action Required:** Before deploying to production, you MUST add a backup certificate hash to prevent app lockout during certificate rotation.

### Steps:

1. **Get the backup certificate** from your SSL provider or generate a new certificate
2. **Generate the SPKI hash** for the backup certificate:
   ```bash
   openssl x509 -in backup-cert.pem -pubkey -noout | \
   openssl pkey -pubin -outform DER | \
   openssl dgst -sha256 -binary | \
   base64
   ```
3. **Add the backup hash** to `app.config.js`:
   ```javascript
   'api.willfind8.com': [
     'xjCqs7iKe/Ir4XPymYzObBAv7nYMf12RzcFWh4/nXnw=', // Current
     'YOUR_BACKUP_HASH_HERE', // Backup
   ]
   ```

## How It Works

### Build Time

1. The config plugin reads SSL pinning configuration from `app.config.js`
2. **iOS**: Injects configuration into `Info.plist`
3. **Android**: Injects configuration into `AndroidManifest.xml`

### Runtime

1. When the app makes HTTPS requests to `api.willfind8.com`
2. Native code validates the server's public key hash
3. If the hash matches any configured hash → connection proceeds
4. If no match → connection rejected (prevents MITM)

## Certificate Rotation Strategy

When you need to update your SSL certificate:

1. **Generate new certificate** and get its SPKI hash
2. **Update app.config.js** to include both old and new hashes:
   ```javascript
   'api.willfind8.com': [
     'OLD_HASH', // Current certificate
     'NEW_HASH', // New certificate
   ]
   ```
3. **Release app update** with both hashes
4. **Wait 2-4 weeks** for users to update
5. **Install new certificate** on server
6. **Next app version**: Optionally remove old hash

## Regenerating Current Certificate Hash

If you need to regenerate the hash for the current certificate:

```bash
# Using domain (recommended)
openssl s_client -connect api.willfind8.com:443 -servername api.willfind8.com </dev/null | \
openssl x509 -pubkey -noout | \
openssl pkey -pubin -outform DER | \
openssl dgst -sha256 -binary | \
base64

# Using certificate file
openssl x509 -in cert.pem -pubkey -noout | \
openssl pkey -pubin -outform DER | \
openssl dgst -sha256 -binary | \
base64
```

## Testing

### Test SSL Pinning in Development

1. **Build the app** with expo-dev-client:

   ```bash
   npx expo prebuild
   npx expo run:ios  # or run:android
   ```

2. **Make API requests** to `api.willfind8.com`
3. **Check logs**:
   - iOS: Look for "ExpoSslPinning" in Xcode console
   - Android: Filter Logcat for "ExpoSslPinning"

### Test Certificate Mismatch

To test that pinning is working:

1. **Temporarily change the hash** in `app.config.js` to an incorrect value
2. **Rebuild and run** the app
3. **Attempt API requests** → Should fail with SSL errors
4. **Restore correct hash** and rebuild

## Troubleshooting

### All API Requests Fail

**Possible causes:**

1. Incorrect SPKI hash in configuration
2. Certificate on server changed
3. Server using different certificate than expected

**Solution:**
Regenerate the hash using the command above and update `app.config.js`

### SSL Pinning Not Working

**Possible causes:**

1. App not rebuilt after config changes
2. Plugin not properly configured

**Solution:**

```bash
npx expo prebuild --clean
npx expo run:ios  # or run:android
```

## Security Best Practices

✅ **DO:**

- Always include at least 2 hashes (primary + backup)
- Pin only your own backend domains
- Monitor certificate expiration dates
- Test in staging before production

❌ **DON'T:**

- Pin third-party services (Firebase, Google, etc.)
- Deploy with only one hash
- Forget to update backup hash before expiry

## Module Location

The `expo-ssl-pinning` module is located at:

```
/home/eric/Projects/dev/expo-ssl-pinning
```

It's installed as a local file dependency in `package.json`:

```json
"expo-ssl-pinning": "file:../expo-ssl-pinning"
```

## Additional Resources

- Module README: `../expo-ssl-pinning/README.md`
- SSL Pinning Guide: `./docs/ssl-pinning-expo-native-module.md`

## Support

For issues with SSL pinning:

1. Check the troubleshooting section above
2. Review logs for "ExpoSslPinning" messages
3. Verify certificate hash is correct
4. Check module documentation
