# Setup Checklist

Use this checklist to ensure your Carbon Footprint Tracker app is properly configured.

## Initial Setup

### 1. Project Setup
- [ ] Repository cloned
- [ ] Navigate to `carbon-footprint-tracker` directory
- [ ] Node.js installed (v16 or higher)
- [ ] Expo CLI installed (`npm install -g expo-cli`)

### 2. Dependencies
```bash
npm install
```
- [ ] Dependencies installed successfully
- [ ] No error messages during installation

### 3. Environment Configuration

#### Create .env file
```bash
cp .env.example .env
```
- [ ] `.env` file created
- [ ] `.env` file is in project root (same level as `package.json`)

#### Get Firebase Credentials
1. [ ] Go to [Firebase Console](https://console.firebase.google.com/)
2. [ ] Select or create your project
3. [ ] Go to Project Settings
4. [ ] Scroll to "Your apps" section
5. [ ] Copy configuration values

#### Update .env file
Open `.env` and update these values:
- [ ] `EXPO_PUBLIC_FIREBASE_API_KEY`
- [ ] `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `EXPO_PUBLIC_FIREBASE_APP_ID`

### 4. Firebase Configuration

#### Enable Authentication
1. [ ] Go to Firebase Console → Authentication
2. [ ] Click "Get Started"
3. [ ] Enable "Email/Password" sign-in method
4. [ ] Save changes

#### Create Firestore Database
1. [ ] Go to Firebase Console → Firestore Database
2. [ ] Click "Create database"
3. [ ] Choose "Start in production mode"
4. [ ] Select a location
5. [ ] Click "Enable"

#### Set Security Rules
1. [ ] Go to Firestore → Rules tab
2. [ ] Copy rules from `src/services/firebaseService.ts` comments
3. [ ] Paste into Rules editor
4. [ ] Click "Publish"

Example rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /activities/{activityId} {
      allow read, write: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && userId == request.auth.uid;
    }
  }
}
```

### 5. Security Verification

- [ ] `.env` file exists
- [ ] `.env` is listed in `.gitignore`
- [ ] Run `git status` - `.env` should NOT appear
- [ ] `.env.example` exists (safe to commit)
- [ ] No hardcoded credentials in source code

### 6. Start Development Server

```bash
npm start
```

- [ ] Development server starts without errors
- [ ] QR code appears
- [ ] No Firebase configuration errors

### 7. Test on Device/Emulator

#### iOS (Mac only)
```bash
npm run ios
```
- [ ] iOS simulator opens
- [ ] App loads successfully
- [ ] No error screens

#### Android
```bash
npm run android
```
- [ ] Android emulator opens
- [ ] App loads successfully
- [ ] No error screens

#### Physical Device
- [ ] Install Expo Go app
- [ ] Scan QR code
- [ ] App loads successfully

## Functionality Testing

### Authentication
- [ ] Open app
- [ ] See login/register screen
- [ ] Create new account
- [ ] Successfully register
- [ ] Log out
- [ ] Log back in
- [ ] Authentication works

### Activity Tracking
- [ ] Navigate to "Add Activity" tab
- [ ] Select activity type (Transportation)
- [ ] Fill in details
- [ ] Submit activity
- [ ] See success message
- [ ] Activity appears in log

### Activity Log
- [ ] Navigate to "Log" tab
- [ ] See list of activities
- [ ] Tap on an activity
- [ ] Swipe to delete
- [ ] Confirm deletion works

### Dashboard
- [ ] Navigate to "Home" tab
- [ ] See total emissions
- [ ] See chart with data
- [ ] Change time period (week/month/year)
- [ ] Chart updates correctly

### Insights
- [ ] Navigate to "Insights" tab
- [ ] See category breakdown
- [ ] See recommendations
- [ ] Data displays correctly

### Profile
- [ ] Navigate to "Profile" tab
- [ ] See user email
- [ ] See statistics
- [ ] Log out button works

### Offline Functionality
- [ ] Turn off WiFi/data
- [ ] Add an activity
- [ ] See "offline" indicator
- [ ] Activity saved locally
- [ ] Turn on WiFi/data
- [ ] Activity syncs automatically
- [ ] Offline indicator disappears

## UI/UX Testing

### Visual
- [ ] Colors are consistent
- [ ] Text is readable
- [ ] Icons display correctly
- [ ] Spacing looks good
- [ ] No layout issues

### Interactions
- [ ] Buttons respond to taps
- [ ] Forms are easy to use
- [ ] Navigation is smooth
- [ ] Animations are smooth
- [ ] Haptic feedback works (on device)

### Responsive
- [ ] Test on small screen (iPhone SE)
- [ ] Test on large screen (iPad)
- [ ] Portrait orientation works
- [ ] Landscape orientation works (if supported)

## Documentation Review

- [ ] Read [README.md](./README.md)
- [ ] Read [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- [ ] Read [SECURITY.md](./SECURITY.md)
- [ ] Understand project structure
- [ ] Know where to find help

## Common Issues

### Issue: "Missing required environment variables"
**Solution**: 
- Verify `.env` file exists
- Check all variables are set
- Restart dev server

### Issue: "Firebase configuration is invalid"
**Solution**:
- Double-check Firebase credentials
- Verify no extra spaces in `.env`
- Check Firebase project is set up

### Issue: "Authentication failed"
**Solution**:
- Verify Email/Password is enabled in Firebase
- Check Firebase credentials are correct
- Try creating a new account

### Issue: "Cannot read activities"
**Solution**:
- Verify Firestore is created
- Check security rules are set
- Ensure user is authenticated

### Issue: App won't start
**Solution**:
```bash
# Clear cache and restart
npm start -- --clear

# Or reinstall dependencies
rm -rf node_modules
npm install
npm start
```

## Production Deployment

### Before Deploying

- [ ] All tests pass
- [ ] No console errors
- [ ] Security rules are set
- [ ] Separate Firebase project for production
- [ ] Production `.env` configured
- [ ] App icon and splash screen updated
- [ ] Privacy policy created
- [ ] Terms of service created

### Build Configuration

#### Android
```bash
npm run build:android:production
```
- [ ] Build completes successfully
- [ ] APK/AAB generated
- [ ] Test on physical device

#### iOS
```bash
npm run build:ios:production
```
- [ ] Build completes successfully
- [ ] IPA generated
- [ ] Test on physical device

### App Store Submission

- [ ] App Store Connect account ready
- [ ] Google Play Console account ready
- [ ] Screenshots prepared
- [ ] App description written
- [ ] Keywords selected
- [ ] Privacy policy URL added
- [ ] Support URL added

## Maintenance Checklist

### Weekly
- [ ] Check for dependency updates
- [ ] Review error logs
- [ ] Monitor Firebase usage
- [ ] Check user feedback

### Monthly
- [ ] Update dependencies
- [ ] Review security rules
- [ ] Audit Firebase costs
- [ ] Backup data

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] User analytics review
- [ ] Feature planning

## Team Onboarding

When adding a new team member:

- [ ] Share repository access
- [ ] Provide Firebase credentials securely
- [ ] Share this checklist
- [ ] Review documentation together
- [ ] Pair program first feature
- [ ] Add to communication channels

## Resources

- [README.md](./README.md) - Main documentation
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Environment setup
- [SECURITY.md](./SECURITY.md) - Security guidelines
- [UI_POLISH_GUIDE.md](./UI_POLISH_GUIDE.md) - UI/UX features
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Documentation](https://reactnative.dev/)

## Getting Help

If you're stuck:

1. Check the troubleshooting sections
2. Review the documentation
3. Search for error messages
4. Check Firebase Console for issues
5. Ask the team for help

## Success Criteria

Your setup is complete when:

✅ App starts without errors
✅ Can create an account
✅ Can add activities
✅ Can view activities
✅ Can see insights
✅ Offline mode works
✅ All tests pass
✅ No security warnings

---


