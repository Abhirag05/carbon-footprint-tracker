# Firebase Backend Setup Guide

This guide walks you through setting up Firebase backend services for the Carbon Footprint Tracker app.

## Prerequisites

- A Google account
- Access to [Firebase Console](https://console.firebase.google.com/)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `carbon-footprint-tracker` (or your preferred name)
4. (Optional) Enable Google Analytics if desired
5. Click **"Create project"** and wait for setup to complete

## Step 2: Register Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Register app with nickname: `Carbon Footprint Tracker`
3. **Do NOT** check "Also set up Firebase Hosting" (unless you plan to use it)
4. Click **"Register app"**
5. Copy the `firebaseConfig` object values
6. Update `firebase.config.ts` with your actual values:

```typescript
const firebaseConfig = {
  apiKey: "AIza...",              // Your API key
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 3: Enable Firebase Authentication

1. In Firebase Console, navigate to **Build > Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"** provider
5. **Enable** the first toggle (Email/Password)
6. Leave "Email link (passwordless sign-in)" disabled
7. Click **"Save"**

### Authentication Settings (Optional but Recommended)

- Go to **Settings** (gear icon) in Authentication
- Under **Authorized domains**, your localhost and app domains should be listed
- For production, add your actual domain

## Step 4: Create Firestore Database

1. In Firebase Console, navigate to **Build > Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add security rules next)
4. Choose a Firestore location (select closest to your users):
   - `us-central1` (Iowa) - Default
   - `europe-west1` (Belgium)
   - `asia-southeast1` (Singapore)
   - Or other available regions
5. Click **"Enable"**

### Collections Structure

The app will automatically create documents in these collections:

- **users/** - User profile data
- **activities/** - Carbon footprint activity logs
- **insights/** - User insights and recommendations

You don't need to manually create these collections; they'll be created when the app writes data.

## Step 5: Configure Firestore Security Rules

1. In Firestore Database, go to the **"Rules"** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Activities collection - users can only access their own activities
    match /activities/{activityId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Insights collection - users can only access their own insights
    match /insights/{userId} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

3. Click **"Publish"** to apply the rules

### Security Rules Explanation

- **Users can only access their own data**: Each user can only read/write documents where their `userId` matches their authentication UID
- **Authentication required**: All operations require the user to be logged in
- **Activity ownership**: Users can only create activities with their own `userId` and can only modify/delete their own activities
- **Insights protection**: Personal insights are restricted to the user who owns them

## Step 6: Enable Firestore Offline Persistence

Offline persistence is already configured in the app code (`firebaseService.ts`). This allows:

- Users to access their data when offline
- Activities logged offline to sync automatically when back online
- Improved performance with local caching

No additional Firebase Console configuration needed for this feature.

## Step 9: Verify Setup

After completing the above steps, verify your setup:

1. ✅ Firebase project created
2. ✅ Web app registered and config values copied to `firebase.config.ts`
3. ✅ Email/Password authentication enabled
4. ✅ Firestore database created
5. ✅ Security rules published
6. ✅ Firestore indexes created
7. ✅ Offline persistence enabled in code

## Testing Your Configuration

1. Update `firebase.config.ts` with your actual Firebase credentials
2. Run the app: `npm start`
3. Try registering a new user
4. Check Firebase Console > Authentication to see the new user
5. Log an activity in the app
6. Check Firebase Console > Firestore Database to see the activity document

## Step 8: Create Required Firestore Indexes

**⚠️ IMPORTANT: This step is REQUIRED for the app to work properly.**

Firestore requires composite indexes for queries that filter and sort by multiple fields. When you first run the app, you'll see an error with a link to create the required index.

### Quick Setup (Recommended)

1. Run the app and navigate to the activities screen
2. You'll see an error in the console with a link like:
   ```
   https://console.firebase.google.com/v1/r/project/YOUR_PROJECT/firestore/indexes?create_composite=...
   ```
3. Click the link to automatically configure the index
4. Click **"Create Index"** in Firebase Console
5. Wait 1-2 minutes for the index to build
6. Restart your app

### Manual Setup

If you prefer to create the index manually:

1. Go to **Firestore Database > Indexes** tab
2. Click **"Create Index"**
3. Configure:
   - **Collection ID**: `activities`
   - **Fields**:
     - `userId` - Ascending
     - `date` - Descending
   - **Query scope**: Collection
4. Click **"Create"**
5. Wait for status to change from "Building" to "Enabled"

For detailed instructions, see [FIRESTORE_INDEX_SETUP.md](./FIRESTORE_INDEX_SETUP.md).

## Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Double-check that you copied the correct `apiKey` from Firebase Console
- Ensure there are no extra spaces or quotes

### "Missing or insufficient permissions"
- Verify that security rules are published correctly
- Check that the user is authenticated before accessing Firestore

### "Persistence failed: Multiple tabs open"
- This is a warning, not an error
- Offline persistence can only be enabled in one tab at a time
- The app will still work normally

### "Quota exceeded"
- Free tier limits: 50K reads, 20K writes, 20K deletes per day
- Monitor usage in Firebase Console > Usage and billing
- Consider upgrading to Blaze (pay-as-you-go) plan if needed

## Firebase Console Quick Links

- **Project Overview**: https://console.firebase.google.com/project/YOUR_PROJECT_ID
- **Authentication**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication
- **Firestore Database**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore
- **Usage & Billing**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/usage

## Next Steps

After completing Firebase setup:

1. Proceed to Task 3: Implement authentication service and context
2. Test user registration and login
3. Implement activity logging functionality

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
