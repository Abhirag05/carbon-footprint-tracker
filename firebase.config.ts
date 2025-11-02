// Firebase configuration
// Configuration values are loaded from environment variables (.env file)
// 
// Setup Instructions:
// 1. Copy .env.example to .env
// 2. Go to https://console.firebase.google.com/
// 3. Create a new project or select existing project
// 4. Click on "Add app" and select Web (</>) platform
// 5. Register your app and copy the configuration values to .env
// 6. Enable Authentication > Sign-in method > Email/Password
// 7. Create Firestore Database in production mode
// 8. Update security rules as documented in firebaseService.ts
//
// Note: In Expo, environment variables must be prefixed with EXPO_PUBLIC_ to be accessible

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

// Validate that all required environment variables are set
const requiredEnvVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error(
    '❌ Missing required environment variables:',
    missingEnvVars.join(', ')
  );
  console.error('Please copy .env.example to .env and fill in your Firebase credentials.');
}

export default firebaseConfig;
