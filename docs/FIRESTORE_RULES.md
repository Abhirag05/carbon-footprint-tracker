# Firestore Security Rules Documentation

This document explains the Firestore security rules for the Carbon Footprint Tracker app and provides examples of how they work.

## Overview

Firestore security rules ensure that:
- Users can only access their own data
- All operations require authentication
- Data integrity is maintained
- Unauthorized access is prevented

## Complete Security Rules

Copy these rules to Firebase Console > Firestore Database > Rules:

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

## Rule Breakdown

### Helper Functions

#### `isAuthenticated()`
```javascript
function isAuthenticated() {
  return request.auth != null;
}
```
- Checks if the user is logged in
- Returns `true` if user has a valid authentication token
- Returns `false` for anonymous/unauthenticated requests

#### `isOwner(userId)`
```javascript
function isOwner(userId) {
  return isAuthenticated() && request.auth.uid == userId;
}
```
- Checks if the authenticated user owns the resource
- Compares the user's UID with the document's userId
- Ensures users can only access their own data

### Collection Rules

#### Users Collection

```javascript
match /users/{userId} {
  allow read, write: if isOwner(userId);
}
```

**What this means:**
- Users can read their own profile: `/users/abc123` (if their UID is `abc123`)
- Users can update their own profile
- Users CANNOT read other users' profiles
- Unauthenticated users CANNOT access any user data

**Examples:**

✅ **Allowed:**
```javascript
// User with UID "abc123" reading their own profile
db.collection('users').doc('abc123').get()
```

❌ **Denied:**
```javascript
// User with UID "abc123" trying to read another user's profile
db.collection('users').doc('xyz789').get()

// Unauthenticated user trying to read any profile
db.collection('users').doc('abc123').get()
```

#### Activities Collection

```javascript
match /activities/{activityId} {
  allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
  allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
  allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
}
```

**What this means:**
- Users can only read activities where `userId` matches their UID
- Users can create activities but must set `userId` to their own UID
- Users can update/delete only their own activities
- Prevents users from creating activities for other users

**Examples:**

✅ **Allowed:**
```javascript
// User "abc123" creating their own activity
db.collection('activities').add({
  userId: 'abc123',  // Must match authenticated user's UID
  type: 'transportation',
  emissions: 5.2,
  // ... other fields
})

// User "abc123" reading their own activities
db.collection('activities')
  .where('userId', '==', 'abc123')
  .get()

// User "abc123" deleting their own activity
db.collection('activities').doc('activity123').delete()
```

❌ **Denied:**
```javascript
// User "abc123" trying to create activity for another user
db.collection('activities').add({
  userId: 'xyz789',  // Different from authenticated user
  type: 'transportation',
  // ... other fields
})

// User "abc123" trying to read another user's activities
db.collection('activities')
  .where('userId', '==', 'xyz789')
  .get()

// Unauthenticated user trying to access activities
db.collection('activities').get()
```

#### Insights Collection

```javascript
match /insights/{userId} {
  allow read, write: if isOwner(userId);
}
```

**What this means:**
- Insights documents are stored with userId as the document ID
- Users can only access insights document with their own UID
- Similar to users collection but for insights data

**Examples:**

✅ **Allowed:**
```javascript
// User "abc123" reading their own insights
db.collection('insights').doc('abc123').get()

// User "abc123" updating their own insights
db.collection('insights').doc('abc123').set({
  recommendations: [...],
  achievements: [...]
})
```

❌ **Denied:**
```javascript
// User "abc123" trying to read another user's insights
db.collection('insights').doc('xyz789').get()
```

## Testing Security Rules

### Using Firebase Console

1. Go to Firestore Database > Rules
2. Click on "Rules Playground" tab
3. Test different scenarios:

**Test 1: Authenticated user reading own data**
- Simulation type: `get`
- Location: `/users/abc123`
- Auth: Authenticated with UID `abc123`
- Expected: ✅ Allowed

**Test 2: Authenticated user reading other's data**
- Simulation type: `get`
- Location: `/users/xyz789`
- Auth: Authenticated with UID `abc123`
- Expected: ❌ Denied

**Test 3: Unauthenticated access**
- Simulation type: `get`
- Location: `/users/abc123`
- Auth: Unauthenticated
- Expected: ❌ Denied

### Using Firebase Emulator (Optional)

For local testing, you can use Firebase Emulator Suite:

```bash
npm install -g firebase-tools
firebase init emulators
firebase emulators:start
```

## Common Scenarios

### Scenario 1: User Registration
When a new user registers:
1. Firebase Authentication creates the user (UID: `abc123`)
2. App creates user profile document at `/users/abc123`
3. Security rule allows this because `isOwner('abc123')` returns true

### Scenario 2: Logging an Activity
When a user logs an activity:
1. User is authenticated (UID: `abc123`)
2. App creates activity with `userId: 'abc123'`
3. Security rule checks `request.resource.data.userId == request.auth.uid`
4. Rule allows creation because both are `abc123`

### Scenario 3: Viewing Activity Log
When a user views their activities:
1. App queries: `activities.where('userId', '==', 'abc123')`
2. Security rule checks each document's `resource.data.userId`
3. Only returns activities where `userId` matches authenticated user

### Scenario 4: Malicious User Attempt
If a malicious user tries to access another user's data:
1. User `abc123` tries to read `/users/xyz789`
2. Security rule checks `isOwner('xyz789')`
3. Returns false because `request.auth.uid` is `abc123`, not `xyz789`
4. Request is denied

## Advanced Rules (Optional Enhancements)

### Data Validation

Add validation to ensure data integrity:

```javascript
match /activities/{activityId} {
  allow create: if isAuthenticated() 
    && request.resource.data.userId == request.auth.uid
    && request.resource.data.type in ['transportation', 'energy', 'food', 'waste']
    && request.resource.data.emissions is number
    && request.resource.data.emissions >= 0;
}
```

### Rate Limiting

Prevent abuse by limiting writes:

```javascript
match /activities/{activityId} {
  allow create: if isAuthenticated() 
    && request.resource.data.userId == request.auth.uid
    && request.time < resource.data.createdAt + duration.value(1, 's'); // Max 1 per second
}
```

### Field-Level Security

Allow partial updates while protecting certain fields:

```javascript
match /users/{userId} {
  allow update: if isOwner(userId)
    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['createdAt', 'uid']);
}
```

## Troubleshooting

### "Missing or insufficient permissions"

**Cause:** Security rules are denying the operation

**Solutions:**
1. Verify user is authenticated
2. Check that `userId` in document matches authenticated user's UID
3. Ensure security rules are published in Firebase Console
4. Check Firebase Console > Firestore > Usage tab for denied requests

### Rules not taking effect

**Cause:** Rules not published or cached

**Solutions:**
1. Click "Publish" in Firebase Console after editing rules
2. Wait a few seconds for rules to propagate
3. Clear app cache and restart
4. Check rules version in Firebase Console

### Testing shows "Allowed" but app shows "Denied"

**Cause:** Mismatch between test conditions and actual app conditions

**Solutions:**
1. Verify user is actually authenticated in the app
2. Check that document structure matches what rules expect
3. Use Firebase Console > Firestore > Usage to see actual denied requests
4. Add console.log to see actual auth state and document data

## Best Practices

1. **Always require authentication** for sensitive data
2. **Use helper functions** to keep rules DRY and maintainable
3. **Test rules thoroughly** before deploying to production
4. **Monitor denied requests** in Firebase Console
5. **Keep rules simple** - complex rules are harder to maintain and debug
6. **Document your rules** - explain why each rule exists
7. **Use least privilege** - only grant minimum necessary permissions

## Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Reference](https://firebase.google.com/docs/reference/security/firestore)
- [Common Security Rules Patterns](https://firebase.google.com/docs/firestore/security/rules-conditions)
