# Troubleshooting Guide

## App Stuck on Loading Spinner

If your app is stuck on the loading spinner and won't proceed to the login screen, try these solutions:

### Solution 1: Check Firebase Configuration
1. Verify your Firebase credentials in `firebase.config.ts` are correct
2. Make sure your Firebase project is active in the Firebase Console
3. Ensure Authentication is enabled in Firebase Console

### Solution 2: Clear Cache and Restart
```bash
# Stop the Metro bundler
# Then run:
cd carbon-footprint-tracker
npm start -- --reset-cache
```

### Solution 3: Check Console Logs
Look for these messages in your terminal:
- "Initializing Firebase..."
- "Firebase app initialized successfully"
- "Firebase Auth initialized successfully"
- "Firestore initialized successfully"
- "AuthProvider: Setting up auth state listener"
- "AuthProvider: Auth state changed"

If you don't see these messages, there's an initialization issue.

### Solution 4: Timeout Protection
The app now has a 5-second timeout. If Firebase doesn't respond within 5 seconds, the app will automatically proceed to the login screen. This prevents infinite loading.

### Solution 5: Check Network Connection
- Make sure your device/emulator has internet access
- Firebase requires internet for initial authentication
- Try switching between WiFi and mobile data

### Solution 6: Reinstall Dependencies
```bash
cd carbon-footprint-tracker
rm -rf node_modules
npm install
```

### Solution 7: Check Expo Go Version
Make sure you're using the latest version of Expo Go on your mobile device.

## Common Error Messages

### "Firebase: Error (auth/network-request-failed)"
- Check your internet connection
- Verify Firebase project is active
- Check if your API key is correct

### "Firebase: Error (auth/invalid-api-key)"
- Your Firebase API key in `firebase.config.ts` is incorrect
- Get the correct key from Firebase Console > Project Settings

### "Firebase: Error (auth/app-deleted)"
- Your Firebase project may have been deleted
- Create a new project or restore the old one

## Debug Mode

To see detailed logs, check your terminal where you ran `npm start`. You should see:

```
AuthProvider: Setting up auth state listener
Firebase app initialized successfully
Firebase Auth initialized successfully
Firestore initialized successfully
```

If the app times out after 5 seconds, you'll see:
```
AuthProvider: Timeout reached, stopping initialization
```

This means Firebase couldn't initialize properly. Check your Firebase configuration and internet connection.

## Still Having Issues?

1. Check the Metro bundler terminal for error messages
2. Look at the Expo Go app logs (shake device > "Show Dev Menu" > "Debug Remote JS")
3. Verify all dependencies are installed: `npm install`
4. Try on a different device or emulator
5. Check Firebase Console for any service outages

## Quick Test

To test if Firebase is working, you can temporarily add this to `App.tsx`:

```typescript
import { auth } from './src/services/firebaseService';

console.log('Firebase Auth instance:', auth ? 'OK' : 'FAILED');
```

If you see "FAILED", there's a Firebase initialization problem.
