import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase.config';
import { logValidationResults } from '../utils/validateFirebaseConfig';

// Validate Firebase configuration in development
if (__DEV__) {
  logValidationResults();
}

// Initialize Firebase
let app;
let auth;
let db;

try {
  console.log('Initializing Firebase...');
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');

  // Initialize Firebase Authentication
  // Note: The AsyncStorage warning can be ignored - Firebase will use AsyncStorage
  // automatically when @react-native-async-storage/async-storage is installed
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully');

  // Initialize Firestore Database
  // Firestore automatically handles offline persistence in React Native
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { auth, db };
export default app;

/**
 * Firestore Collections Structure:
 * 
 * users/{userId}
 *   - email: string
 *   - displayName: string
 *   - createdAt: timestamp
 *   - preferences: {
 *       units: 'metric' | 'imperial'
 *       notifications: boolean
 *     }
 * 
 * activities/{activityId}
 *   - userId: string (reference to user)
 *   - type: 'transportation' | 'energy' | 'food' | 'waste'
 *   - category: string
 *   - date: timestamp
 *   - emissions: number (CO2 equivalent in kg)
 *   - details: object (type-specific data)
 *   - createdAt: timestamp
 *   - syncStatus: 'synced' | 'pending' | 'error'
 * 
 * insights/{userId}
 *   - recommendations: array
 *   - achievements: array
 *   - lastUpdated: timestamp
 */

/**
 * Firestore Security Rules (to be configured in Firebase Console):
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     
 *     // Helper function to check if user is authenticated
 *     function isAuthenticated() {
 *       return request.auth != null;
 *     }
 *     
 *     // Helper function to check if user owns the resource
 *     function isOwner(userId) {
 *       return isAuthenticated() && request.auth.uid == userId;
 *     }
 *     
 *     // Users collection - users can only read/write their own data
 *     match /users/{userId} {
 *       allow read, write: if isOwner(userId);
 *     }
 *     
 *     // Activities collection - users can only access their own activities
 *     match /activities/{activityId} {
 *       allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
 *       allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
 *       allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
 *     }
 *     
 *     // Insights collection - users can only access their own insights
 *     match /insights/{userId} {
 *       allow read, write: if isOwner(userId);
 *     }
 *   }
 * }
 * 
 * To apply these rules:
 * 1. Go to Firebase Console > Firestore Database > Rules
 * 2. Copy and paste the rules above
 * 3. Click "Publish"
 */
