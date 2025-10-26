# Build Instructions for Carbon Footprint Tracker

## Prerequisites
- Node.js installed
- Expo CLI installed globally: `npm install -g expo-cli`
- EAS CLI installed globally: `npm install -g eas-cli`
- Expo account (free): https://expo.dev/signup

## Development

### Run on Android Emulator/Device
```bash
npm start
# Then press 'a' for Android
```

### Run on iOS Simulator (Mac only)
```bash
npm start
# Then press 'i' for iOS
```

### Run on Web
```bash
npm start
# Then press 'w' for web
```

## Building APK for Android

### Method 1: EAS Build (Recommended)

1. **Login to Expo**
   ```bash
   eas login
   ```

2. **Configure the project**
   ```bash
   eas build:configure
   ```

3. **Build APK for testing (Preview build)**
   ```bash
   eas build --platform android --profile preview
   ```
   This creates an APK file you can install directly on Android devices.

4. **Build for Production**
   ```bash
   eas build --platform android --profile production
   ```

5. **Download the APK**
   - After the build completes, you'll get a link to download the APK
   - Or check your builds at: https://expo.dev/accounts/[your-account]/projects/carbon-footprint-tracker/builds

### Method 2: Local Build (Advanced)

If you want to build locally without EAS:

1. **Prebuild native projects**
   ```bash
   npx expo prebuild
   ```
   This creates `android/` and `ios/` folders.

2. **Build Android APK locally**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Build Profiles

The `eas.json` file defines three build profiles:

- **development**: For development builds with debugging
- **preview**: Creates APK for internal testing (no Google Play)
- **production**: For production builds (AAB for Google Play)

## Environment Variables

For Firebase configuration, you can use environment variables:

1. Create `.env` file (already in .gitignore):
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   ```

2. Update `firebase.config.ts` to use these variables

## Troubleshooting

### Build fails with "No bundle identifier"
- Make sure `app.json` has `android.package` and `ios.bundleIdentifier` set

### "eas command not found"
- Install EAS CLI: `npm install -g eas-cli`

### Build takes too long
- EAS builds run on Expo's servers, so build time depends on queue
- Free tier has limited build minutes per month

## Additional Resources

- [Expo Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Build](https://docs.expo.dev/build/setup/)
- [Publishing to Google Play](https://docs.expo.dev/submit/android/)
