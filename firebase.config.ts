// Firebase configuration
// Replace these values with your actual Firebase project credentials from Firebase Console
// 
// Setup Instructions:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing project
// 3. Click on "Add app" and select Web (</>) platform
// 4. Register your app and copy the configuration values below
// 5. Enable Authentication > Sign-in method > Email/Password
// 6. Create Firestore Database in production mode
// 7. Update security rules as documented in firebaseService.ts

const firebaseConfig = {
  apiKey: "AIzaSyB8bKqAig2XrF42EmrV9hhPBxOoH6Z5Log",
  authDomain: "mariantrack.firebaseapp.com",
  projectId: "mariantrack",
  storageBucket: "mariantrack.firebasestorage.app",
  messagingSenderId: "870669348117",
  appId: "1:870669348117:web:3de4faf8d5a88067a60d1c",
  // measurementId is not needed for React Native and can cause errors
  // measurementId: "G-6WKJ5JN5CH"
};

export default firebaseConfig;
