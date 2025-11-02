import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseService';
import { User } from '../types';
import { withRetry } from '../utils/retryHelper';
import { handleError } from '../utils/errorHandler';

/**
 * Authentication Service
 * Handles all Firebase Authentication operations
 */

/**
 * Sign up a new user with email and password
 * Creates user account in Firebase Auth and user profile in Firestore
 * @param email - User's email address
 * @param password - User's password (min 8 characters)
 * @returns User object
 * @throws Error with user-friendly message on failure
 */
export const signUp = async (email: string, password: string): Promise<User> => {
  try {
    // Create user account in Firebase Authentication (no retry for auth operations)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Create user profile document in Firestore (with retry)
    const userProfile: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || email,
      displayName: firebaseUser.displayName || undefined,
      createdAt: new Date(),
    };

    await withRetry(
      () => setDoc(doc(db, 'users', firebaseUser.uid), {
        email: userProfile.email,
        displayName: userProfile.displayName || null,
        createdAt: serverTimestamp(),
        preferences: {
          units: 'metric',
          notifications: true,
        },
      }),
      { maxAttempts: 3 }
    );

    return userProfile;
  } catch (error) {
    const errorMessage = handleError(error, 'sign up');
    throw new Error(errorMessage);
  }
};

/**
 * Sign in an existing user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns User object
 * @throws Error with user-friendly message on failure
 */
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    // Sign in with Firebase Authentication (no retry for auth operations)
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Fetch user profile from Firestore (with retry)
    const userDoc = await withRetry(
      () => getDoc(doc(db, 'users', firebaseUser.uid)),
      { maxAttempts: 3 }
    );

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: userData.displayName || undefined,
        createdAt: userData.createdAt?.toDate() || new Date(),
      };
    }

    // Fallback if Firestore document doesn't exist
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || email,
      displayName: firebaseUser.displayName || undefined,
      createdAt: new Date(),
    };
  } catch (error) {
    const errorMessage = handleError(error, 'sign in');
    throw new Error(errorMessage);
  }
};

/**
 * Sign out the current user
 * @throws Error with user-friendly message on failure
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    const errorMessage = handleError(error, 'sign out');
    throw new Error(errorMessage);
  }
};

/**
 * Get the currently authenticated user
 * @returns User object or null if not authenticated
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    return null;
  }

  try {
    // Fetch user profile from Firestore (with retry)
    const userDoc = await withRetry(
      () => getDoc(doc(db, 'users', firebaseUser.uid)),
      { maxAttempts: 2 }
    );

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: userData.displayName || undefined,
        createdAt: userData.createdAt?.toDate() || new Date(),
      };
    }

    // Fallback if Firestore document doesn't exist
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || undefined,
      createdAt: new Date(),
    };
  } catch (error) {
    handleError(error, 'fetch user profile');
    // Return basic user info if Firestore fetch fails
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || undefined,
      createdAt: new Date(),
    };
  }
};

/**
 * Listen to authentication state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChanged = (
  callback: (user: User | null) => void
): (() => void) => {
  return firebaseOnAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        // Fetch user profile from Firestore (with retry)
        const userDoc = await withRetry(
          () => getDoc(doc(db, 'users', firebaseUser.uid)),
          { maxAttempts: 2 }
        );

        if (userDoc.exists()) {
          const userData = userDoc.data();
          callback({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: userData.displayName || undefined,
            createdAt: userData.createdAt?.toDate() || new Date(),
          });
        } else {
          // Fallback if Firestore document doesn't exist
          callback({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            createdAt: new Date(),
          });
        }
      } catch (error) {
        handleError(error, 'fetch user profile in auth state listener');
        // Return basic user info if Firestore fetch fails
        callback({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined,
          createdAt: new Date(),
        });
      }
    } else {
      callback(null);
    }
  });
};


