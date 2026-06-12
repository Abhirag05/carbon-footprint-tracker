# App Crashing After Splash Screen - Troubleshooting Guide

## Common Causes & Solutions

### 1. Firebase Configuration Issue (Most Common)

**Problem**: The app can't connect to Firebase, causing a crash.

**Solution**: Verify your Firebase credentials in `.env` file

Check that your `.env` file has all these values filled in:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_actual_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Important**: Make sure there are NO quotes around the values!

❌ Wrong:
```env
EXPO_PUBLIC_FIREBASE_API_KEY="AIzaSyB..."
```

✅ Correct:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyB...
```

### 2. Missing Firebase Setup

**Check Firebase Console**:
1. Go to https://console.firebase.google.com/
2. Select your project
3. Verify these are enabled:
   - ✅ Authentication → Email/Password enabled
   - ✅ Firestore Database created
   - ✅ Security Rules configured

### 3. Network Permissions

Make sure your phone has internet connection and the app has network permissions.

### 4. Rebuild with Correct Configuration

After fixing `.env`, rebuild:

```bash
# Clean build
eas build -p android --profile preview --clear-cache
```

## Quick Fix Steps

### Step 1: Verify .env File

```bash
# Check if .env exists
dir .env

# View contents (make sure values are filled)
type .env
```

### Step 2: Test Firebase Connection

Create a test to verify Firebase works:

1. Open Firebase Console
2. Go to Authentication
3. Try to manually add a test user
4. If this works, Firebase is set up correctly

### Step 3: Check Logs

To see the actual error, connect your phone via USB and run:

```bash
# For Android
adb logcat | findstr "ReactNativeJS"
```

This will show you the exact error message.

### Step 4: Rebuild with Debug Info

Build a debug version to see errors:

```bash
npx expo prebuild
cd android
gradlew.bat assembleDebug
```

Install the debug APK and check logs.

## Alternative: Build Without Firebase (Test)

To test if Firebase is the issue, temporarily disable Firebase:

1. Comment out Firebase initialization in `App.tsx`
2. Rebuild
3. If app works, Firebase is the issue

## Most Likely Solution

**The crash is probably because:**
1. `.env` file is not being read in the production build
2. Firebase credentials are missing or incorrect

**Fix**: Make sure your `.env` file is in the project root and rebuild:

```bash
# Verify .env location
cd carbon-footprint-tracker
dir .env

# Rebuild
eas build -p android --profile preview --clear-cache
```

## Need More Help?

Run this command and share the output:

```bash
# Check environment variables are set
npx expo config --type public
```

This will show if your environment variables are being loaded correctly.

## Emergency Fix: Hardcode Firebase Config (Temporary)

If you need the app working NOW, temporarily hardcode Firebase config:

1. Open `firebase.config.ts`
2. Replace with:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export default firebaseConfig;
```

3. Rebuild

**Note**: This is NOT secure for production, but will help you test if Firebase is the issue.

## Contact Support

If none of these work, the issue might be:
- Device compatibility
- Android version issue
- Missing native dependencies

Share the error logs from `adb logcat` for more specific help.
