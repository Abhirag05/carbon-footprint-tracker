# Firebase Setup Quick Reference

Quick checklist for configuring Firebase backend services.

## ✅ Setup Checklist

### 1. Create Firebase Project
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Click "Add project"
- [ ] Name: `carbon-footprint-tracker`
- [ ] Complete project creation

### 2. Register Web App
- [ ] Click Web icon (`</>`)
- [ ] Register app
- [ ] Copy config values to `firebase.config.ts`

### 3. Enable Authentication
- [ ] Navigate to: Build > Authentication
- [ ] Click "Get started"
- [ ] Enable "Email/Password" provider
- [ ] Save

### 4. Create Firestore Database
- [ ] Navigate to: Build > Firestore Database
- [ ] Click "Create database"
- [ ] Select "Production mode"
- [ ] Choose location (e.g., `us-central1`)
- [ ] Enable

### 5. Configure Security Rules
- [ ] Go to Firestore > Rules tab
- [ ] Copy rules from `FIRESTORE_RULES.md`
- [ ] Publish rules

### 6. Verify Setup
- [ ] Update `firebase.config.ts` with actual credentials
- [ ] Run app: `npm start`
- [ ] Test user registration
- [ ] Check Firebase Console for new user
- [ ] Test activity logging
- [ ] Check Firestore for activity document

## 📋 Collections Structure

```
users/{userId}
├── email: string
├── displayName: string
├── createdAt: timestamp
└── preferences: object

activities/{activityId}
├── userId: string
├── type: string
├── category: string
├── date: timestamp
├── emissions: number
├── details: object
├── createdAt: timestamp
└── syncStatus: string

insights/{userId}
├── recommendations: array
├── achievements: array
└── lastUpdated: timestamp
```

## 🔒 Security Rules Summary

- ✅ Users can only access their own data
- ✅ All operations require authentication
- ✅ Activities are user-scoped
- ✅ Insights are user-scoped
- ❌ No cross-user data access
- ❌ No unauthenticated access

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `firebase.config.ts` | Firebase credentials |
| `src/services/firebaseService.ts` | Firebase initialization & offline persistence |
| `src/utils/validateFirebaseConfig.ts` | Config validation utility |
| `FIREBASE_SETUP.md` | Detailed setup guide |
| `FIRESTORE_RULES.md` | Security rules documentation |

## 🚀 Features Enabled

- ✅ Email/Password Authentication
- ✅ Firestore Database with offline persistence
- ✅ User data isolation via security rules
- ✅ Automatic sync when back online
- ✅ Local caching for better performance

## 📞 Support

If you encounter issues:
1. Check `FIREBASE_SETUP.md` for detailed instructions
2. Review `FIRESTORE_RULES.md` for security rules help
3. Verify config with validation utility
4. Check Firebase Console for error logs

## 🔗 Quick Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
