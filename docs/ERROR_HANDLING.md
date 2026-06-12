# Error Handling and Loading States

This document describes the comprehensive error handling and loading state management system implemented in the Carbon Footprint Tracker app.

## Overview

The app implements a multi-layered error handling strategy that includes:

1. **LoadingSpinner Component** - Displays loading states during async operations
2. **ErrorMessage Component** - Shows user-friendly error messages with retry options
3. **ErrorBoundary** - Catches and handles React component errors
4. **Retry Logic** - Automatically retries failed network operations
5. **Firebase Error Handler** - Converts Firebase errors to user-friendly messages

## Components

### LoadingSpinner

A customizable loading indicator component.

**Location:** `src/components/LoadingSpinner.tsx`

**Props:**
- `size?: 'small' | 'large'` - Size of the spinner (default: 'large')
- `color?: string` - Color of the spinner (default: '#4CAF50')
- `message?: string` - Optional message to display below spinner
- `fullScreen?: boolean` - Whether to take full screen (default: true)

**Usage:**
```tsx
import LoadingSpinner from '../components/LoadingSpinner';

// Full screen loading
<LoadingSpinner message="Loading your data..." />

// Inline loading
<LoadingSpinner size="small" fullScreen={false} />
```

### ErrorMessage

A component for displaying user-friendly error messages with retry and dismiss options.

**Location:** `src/components/ErrorMessage.tsx`

**Props:**
- `message: string` - Error message to display
- `onRetry?: () => void` - Optional retry callback
- `onDismiss?: () => void` - Optional dismiss callback
- `type?: 'error' | 'warning' | 'info'` - Message type (default: 'error')
- `fullScreen?: boolean` - Whether to center on screen (default: false)

**Usage:**
```tsx
import ErrorMessage from '../components/ErrorMessage';

<ErrorMessage
  message="Failed to load data"
  onRetry={handleRetry}
  onDismiss={clearError}
  type="error"
/>
```

### ErrorBoundary

A React error boundary that catches component errors and displays a fallback UI.

**Location:** `App.tsx`

**Features:**
- Catches all React component errors
- Displays user-friendly error message
- Provides "Try Again" button to reset error state
- Logs errors to console for debugging

**Usage:**
The ErrorBoundary is already wrapped around the entire app in `App.tsx`. No additional setup needed.

## Utilities

### Retry Helper

Provides automatic retry logic for network operations with exponential backoff.

**Location:** `src/utils/retryHelper.ts`

**Functions:**

#### `withRetry<T>(fn, options)`

Executes a function with retry logic.

**Parameters:**
- `fn: () => Promise<T>` - Async function to execute
- `options?: RetryOptions`
  - `maxAttempts?: number` - Maximum retry attempts (default: 3)
  - `delayMs?: number` - Initial delay between retries (default: 1000ms)
  - `backoffMultiplier?: number` - Multiplier for exponential backoff (default: 2)
  - `shouldRetry?: (error) => boolean` - Custom retry condition

**Usage:**
```tsx
import { withRetry } from '../utils/retryHelper';

const data = await withRetry(
  () => fetchDataFromAPI(),
  { maxAttempts: 3, delayMs: 1000 }
);
```

#### `isNetworkError(error)`

Checks if an error is network-related.

#### `isPermissionError(error)`

Checks if an error is permission-related.

### Error Handler

Converts errors (especially Firebase errors) to user-friendly messages.

**Location:** `src/utils/errorHandler.ts`

**Functions:**

#### `getErrorMessage(error, context?)`

Converts any error to a user-friendly message.

**Parameters:**
- `error: any` - Error object
- `context?: string` - Optional context for more specific messages

**Returns:** User-friendly error message string

**Usage:**
```tsx
import { getErrorMessage } from '../utils/errorHandler';

try {
  await someOperation();
} catch (error) {
  const message = getErrorMessage(error, 'save data');
  // message: "Failed to save data. Please try again."
}
```

#### `handleError(error, context?)`

Logs error and returns user-friendly message.

**Usage:**
```tsx
import { handleError } from '../utils/errorHandler';

try {
  await someOperation();
} catch (error) {
  const message = handleError(error, 'load activities');
  setError(message);
}
```

#### `logError(error, context?)`

Logs error details to console for debugging.

## Service Integration

### Authentication Service

The `authService.ts` has been enhanced with:
- Retry logic for Firestore operations (not for auth operations)
- User-friendly error messages for all Firebase Auth errors
- Proper error handling in all functions

**Error Handling:**
- Invalid credentials → "Invalid email or password. Please try again."
- Network errors → "Network error. Please check your internet connection."
- Too many attempts → "Too many failed attempts. Please try again later."

### Activity Service

The `activityService.ts` has been enhanced with:
- Retry logic for all Firestore operations (create, read, update, delete)
- Special handling for Firestore index errors
- User-friendly error messages

**Error Handling:**
- Network errors → Automatic retry with exponential backoff
- Index errors → Helpful console message with index creation link
- Permission errors → "You do not have permission to access this data."

## Context Integration

### AuthContext

Already includes:
- Loading state management
- Error state management
- `clearError()` function to dismiss errors

### ActivityContext

Already includes:
- Loading state management
- Error state management
- `clearError()` function to dismiss errors
- Connectivity status tracking

## Screen Integration

### HomeScreen

Enhanced with:
- Loading spinner on initial load
- Error message display with retry option
- Error handling in refresh operation

### AuthScreen

Already includes:
- Form validation errors
- Authentication error display
- Loading states

### AddActivityScreen

Already includes:
- Validation error alerts
- Save error handling
- Success/offline notifications

## Firebase Error Codes

### Authentication Errors

| Code | User-Friendly Message |
|------|----------------------|
| `auth/email-already-in-use` | This email address is already registered. Please sign in instead. |
| `auth/invalid-email` | Please enter a valid email address. |
| `auth/weak-password` | Password is too weak. Please use at least 8 characters. |
| `auth/user-not-found` | No account found with this email address. |
| `auth/wrong-password` | Incorrect password. Please try again. |
| `auth/too-many-requests` | Too many failed attempts. Please try again later. |
| `auth/network-request-failed` | Network error. Please check your internet connection. |

### Firestore Errors

| Code | User-Friendly Message |
|------|----------------------|
| `permission-denied` | You do not have permission to access this data. |
| `not-found` | The requested data was not found. |
| `unavailable` | Service temporarily unavailable. Please try again. |
| `deadline-exceeded` | Request timeout. Please try again. |
| `failed-precondition` | Operation failed. Please ensure all requirements are met. |

## Best Practices

### 1. Always Use Try-Catch

```tsx
try {
  await someAsyncOperation();
} catch (error) {
  const message = handleError(error, 'operation name');
  setError(message);
}
```

### 2. Provide Context

```tsx
// Good - provides context
const message = handleError(error, 'save activity');

// Bad - no context
const message = handleError(error);
```

### 3. Use Retry for Network Operations

```tsx
// Good - retries on network failure
await withRetry(() => fetchData(), { maxAttempts: 3 });

// Bad - no retry
await fetchData();
```

### 4. Clear Errors on Retry

```tsx
const handleRetry = () => {
  clearError(); // Clear previous error
  loadData();   // Try again
};
```

### 5. Show Loading States

```tsx
// Show loading during async operations
setLoading(true);
try {
  await operation();
} finally {
  setLoading(false);
}
```

## Testing Error Handling

### Simulate Network Errors

1. Turn off internet connection
2. Try to perform operations
3. Verify offline handling and error messages

### Simulate Firebase Errors

1. Use invalid credentials for auth errors
2. Modify Firestore rules for permission errors
3. Delete data for not-found errors

### Test Retry Logic

1. Add console logs in retry helper
2. Simulate intermittent network failures
3. Verify exponential backoff behavior

## Future Enhancements

- Error reporting service integration (e.g., Sentry)
- Offline error queue for analytics
- Custom error types for better categorization
- Error recovery suggestions based on error type
- User feedback mechanism for persistent errors
