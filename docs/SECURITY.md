# Security Overview

This document describes the security model, configuration, and practices for the Carbon Footprint Tracker app.

## 1. Credentials and Environment Variables

The application uses Firebase for backend storage and authentication. All credentials are loaded dynamically via environment variables to avoid exposing sensitive keys in source control:

- **Local Development**: Configuration is loaded from a local `.env` file (which is git-ignored). A template of this configuration is provided in `.env.example`.
- **Firebase Config Loading**: The configuration is initialized in [firebase.config.ts](../firebase.config.ts) using `process.env.EXPO_PUBLIC_FIREBASE_*`.
- **Validation**: At runtime, [validateFirebaseConfig.ts](../src/utils/validateFirebaseConfig.ts) verifies that all environment variables are present and configured correctly, notifying the user if the app has not been set up.

> [!WARNING]
> Never commit your `.env` file or hardcoded credentials to version control. Always use `.env.example` as a safe template.

## 2. Authentication

The app uses Firebase Authentication to authenticate users securely:
- **Provider**: Email and password authentication is supported.
- **Client Handling**: Firebase handles auth tokens securely on the client side, storing and refreshing sessions.
- **Requirement**: All database interactions require a valid user token.

## 3. Database Security Rules (Firestore)

Firestore security rules are configured to restrict access to authenticated users and ensure that users can only access their own data.

The published rules are defined as follows:

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
    
    // Users collection - users can only read/write their own profiles
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

### Access Matrix

| Collection | Create | Read | Update | Delete | Restriction |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `users` | Owner | Owner | Owner | Owner | Restricts reads and writes to matching `userId` |
| `activities` | Owner | Owner | Owner | Owner | Matches the `userId` field inside the activity document |
| `insights` | Owner | Owner | Owner | Owner | Restricts reads and writes to matching `userId` |

## 4. Local Storage

For offline capabilities, the app caches data using Async Storage:
- Offline activity additions are cached locally.
- Sync mechanisms check connection state and push pending activities to Firestore once online.
- Sensitive credentials or auth passwords are not cached in local storage.

---
*Securing the environment and data for a sustainable future.*
