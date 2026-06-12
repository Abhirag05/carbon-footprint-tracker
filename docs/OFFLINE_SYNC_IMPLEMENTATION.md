# Offline Support and Sync Implementation

## Overview
This document describes the offline support and sync functionality implemented in the Carbon Footprint Tracker app.

## Features Implemented

### 1. Sync Status Indicators
- **Location**: HomeScreen, ProfileScreen
- **Component**: `SyncStatusIndicator.tsx`
- **Features**:
  - Visual indicator showing current sync status (synced, pending, syncing, error)
  - Displays count of pending activities
  - Color-coded status (green for synced, orange for pending, blue for syncing, red for error)
  - Compact and full display modes

### 2. Offline Mode Banner
- **Location**: All main screens (HomeScreen, ActivityLogScreen, AddActivityScreen, InsightsScreen)
- **Component**: `OfflineBanner.tsx`
- **Features**:
  - Displays when device is offline
  - Informs users that activities will be saved locally
  - Automatically dismisses when connection is restored

### 3. Background Sync
- **Location**: `App.tsx`
- **Implementation**:
  - Listens to app state changes
  - Automatically triggers sync when app returns to foreground
  - Uses `AppState.addEventListener` to detect state changes

### 4. Manual Sync
- **Location**: ProfileScreen
- **Features**:
  - Manual sync button for users to trigger sync
  - Shows pending activity count
  - Disabled when offline or no pending activities
  - Provides feedback on sync success/failure

### 5. Connectivity Detection
- **Service**: `syncService.ts`
- **Features**:
  - Real-time connectivity monitoring using NetInfo
  - Automatic sync when connection is restored
  - Connectivity state available in ActivityContext

### 6. Offline Activity Storage
- **Service**: `syncService.ts`
- **Features**:
  - Activities saved to AsyncStorage when offline
  - Queue-based sync system
  - Conflict resolution using timestamps
  - Persistent storage across app restarts

## Components

### SyncStatusIndicator
```typescript
Props:
- status: SyncStatus ('synced' | 'pending' | 'syncing' | 'error')
- pendingCount?: number
- compact?: boolean
```

### OfflineBanner
```typescript
Props:
- visible: boolean
- onDismiss?: () => void
```

## Services

### syncService.ts
Key functions:
- `queueActivityForSync()` - Queue activities for offline sync
- `syncPendingActivities()` - Sync all pending activities
- `checkConnectivity()` - Check internet connectivity
- `getSyncStatus()` - Get current sync status
- `getPendingActivityCount()` - Get count of pending activities
- `setupConnectivityListener()` - Setup connectivity change listener

## Context Integration

### ActivityContext
New state properties:
- `syncStatus: SyncStatus` - Current sync status
- `isConnected: boolean` - Connectivity state

New actions:
- `syncPendingActivities()` - Manually trigger sync

## User Experience

### When Online
1. Activities are saved directly to Firestore
2. Sync status shows "Synced" with green indicator
3. Real-time updates from Firestore

### When Offline
1. Orange banner appears at top of screen
2. Activities are saved to local storage
3. Sync status shows "Pending" with count
4. Activities marked as unsynced in UI

### When Connection Restored
1. Banner automatically dismisses
2. Background sync automatically triggers
3. Pending activities uploaded to Firestore
4. Sync status updates to "Synced"
5. Local storage cleared after successful sync

## Testing Checklist

### Manual Testing
- [x] Offline banner displays when device goes offline
- [x] Activities can be created while offline
- [x] Offline activities are stored locally
- [x] Sync status indicator shows correct state
- [x] Background sync triggers when app returns to foreground
- [x] Manual sync button works in ProfileScreen
- [x] Pending activity count is accurate
- [x] Activities sync when connection is restored
- [x] Conflict resolution works correctly
- [x] UI updates after successful sync

### Edge Cases
- [x] Multiple offline activities sync correctly
- [x] Sync errors are handled gracefully
- [x] App works correctly after restart with pending activities
- [x] Sync status persists across app sessions

## Requirements Coverage

This implementation satisfies all requirements from task 13:

✅ **Display sync status indicator in UI (synced, pending, error)**
- Implemented in HomeScreen and ProfileScreen
- Shows current status with visual indicators
- Displays pending activity count

✅ **Show offline mode banner when no connectivity**
- Implemented in all main screens
- Automatically shows/hides based on connectivity
- Clear messaging to users

✅ **Implement background sync when app returns to foreground**
- Implemented in App.tsx using AppState listener
- Automatically triggers sync on app activation
- Handles errors gracefully

✅ **Test offline activity creation and online sync**
- All functionality tested and working
- Activities can be created offline
- Sync works when connection is restored

## Related Requirements

This implementation addresses the following requirements from the requirements document:

- **Requirement 6.1**: Activities stored locally when offline ✅
- **Requirement 6.2**: Automatic sync within 10 seconds when online ✅
- **Requirement 6.3**: Local activities removed after successful sync ✅
- **Requirement 6.4**: Conflict resolution using timestamps ✅

## Future Enhancements

Potential improvements for future iterations:
1. Retry logic with exponential backoff for failed syncs
2. Detailed sync history/logs
3. Batch sync optimization for large numbers of pending activities
4. Sync progress indicator for large syncs
5. User notification when sync completes in background
