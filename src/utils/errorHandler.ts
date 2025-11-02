/**
 * Error Handler Utility
 * Provides user-friendly error messages for Firebase and other errors
 */

import { FirebaseError } from 'firebase/app';
import { isNetworkError, isPermissionError } from './retryHelper';

/**
 * Convert any error to a user-friendly message
 * @param error - Error object
 * @param context - Optional context for more specific messages
 * @returns User-friendly error message
 */
export function getErrorMessage(error: any, context?: string): string {
    if (!error) {
        return 'An unexpected error occurred';
    }

    // Handle Firebase errors
    if (error.code) {
        const firebaseMessage = getFirebaseErrorMessage(error);
        if (firebaseMessage) {
            return firebaseMessage;
        }
    }

    // Handle network errors
    if (isNetworkError(error)) {
        return 'Network error. Please check your internet connection and try again.';
    }

    // Handle permission errors
    if (isPermissionError(error)) {
        return 'You do not have permission to perform this action.';
    }

    // Handle Error objects
    if (error instanceof Error) {
        return error.message || 'An unexpected error occurred';
    }

    // Handle string errors
    if (typeof error === 'string') {
        return error;
    }

    // Fallback with context
    if (context) {
        return `Failed to ${context}. Please try again.`;
    }

    return 'An unexpected error occurred. Please try again.';
}

/**
 * Get user-friendly message for Firebase errors
 * @param error - Firebase error object
 * @returns User-friendly error message or null
 */
function getFirebaseErrorMessage(error: any): string | null {
    const code = error.code?.toLowerCase() || '';

    // Authentication errors
    if (code.startsWith('auth/')) {
        return getAuthErrorMessage(code);
    }

    // Firestore errors
    if (code.startsWith('firestore/') || !code.includes('/')) {
        return getFirestoreErrorMessage(code);
    }

    return null;
}

/**
 * Get user-friendly message for Firebase Auth errors
 * @param code - Firebase Auth error code
 * @returns User-friendly error message
 */
function getAuthErrorMessage(code: string): string {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'This email address is already registered. Please sign in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/operation-not-allowed':
            return 'Email/password authentication is not enabled. Please contact support.';
        case 'auth/weak-password':
            return 'Password is too weak. Please use at least 8 characters.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/user-not-found':
            return 'No account found with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/requires-recent-login':
            return 'This action requires recent authentication. Please sign in again.';
        case 'auth/expired-action-code':
            return 'This link has expired. Please request a new one.';
        case 'auth/invalid-action-code':
            return 'This link is invalid. Please request a new one.';
        default:
            return 'Authentication error. Please try again.';
    }
}

/**
 * Get user-friendly message for Firestore errors
 * @param code - Firestore error code
 * @returns User-friendly error message
 */
function getFirestoreErrorMessage(code: string): string {
    switch (code) {
        case 'permission-denied':
        case 'firestore/permission-denied':
            return 'You do not have permission to access this data.';
        case 'not-found':
        case 'firestore/not-found':
            return 'The requested data was not found.';
        case 'already-exists':
        case 'firestore/already-exists':
            return 'This data already exists.';
        case 'resource-exhausted':
        case 'firestore/resource-exhausted':
            return 'Too many requests. Please try again later.';
        case 'failed-precondition':
        case 'firestore/failed-precondition':
            return 'Operation failed. Please ensure all requirements are met.';
        case 'aborted':
        case 'firestore/aborted':
            return 'Operation was aborted. Please try again.';
        case 'out-of-range':
        case 'firestore/out-of-range':
            return 'Invalid data range provided.';
        case 'unimplemented':
        case 'firestore/unimplemented':
            return 'This feature is not yet implemented.';
        case 'internal':
        case 'firestore/internal':
            return 'Internal server error. Please try again later.';
        case 'unavailable':
        case 'firestore/unavailable':
            return 'Service temporarily unavailable. Please try again.';
        case 'data-loss':
        case 'firestore/data-loss':
            return 'Data loss detected. Please contact support.';
        case 'unauthenticated':
        case 'firestore/unauthenticated':
            return 'You must be signed in to perform this action.';
        case 'deadline-exceeded':
        case 'firestore/deadline-exceeded':
            return 'Request timeout. Please try again.';
        case 'cancelled':
        case 'firestore/cancelled':
            return 'Operation was cancelled.';
        case 'invalid-argument':
        case 'firestore/invalid-argument':
            return 'Invalid data provided. Please check your input.';
        default:
            return 'Database error. Please try again.';
    }
}

/**
 * Log error for debugging purposes
 * @param error - Error object
 * @param context - Context where error occurred
 */
export function logError(error: any, context?: string): void {
    const prefix = context ? `[${context}]` : '[Error]';
    console.error(prefix, error);

    // Log additional details for Firebase errors
    if (error?.code) {
        console.error(`${prefix} Error code:`, error.code);
    }

    // Log stack trace if available
    if (error?.stack) {
        console.error(`${prefix} Stack trace:`, error.stack);
    }
}

/**
 * Handle error with logging and user-friendly message
 * @param error - Error object
 * @param context - Context where error occurred
 * @returns User-friendly error message
 */
export function handleError(error: any, context?: string): string {
    logError(error, context);
    return getErrorMessage(error, context);
}
