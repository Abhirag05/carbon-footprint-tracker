import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Activity } from '../types';
import { createActivity, updateActivity } from './activityService';

/**
 * Sync Service
 * Handles offline activity storage and synchronization with Firestore
 */

const PENDING_ACTIVITIES_KEY = '@carbon_tracker:pending_activities';
const SYNC_STATUS_KEY = '@carbon_tracker:sync_status';

export type SyncStatus = 'synced' | 'pending' | 'syncing' | 'error';

interface PendingActivity {
  tempId: string;
  activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>;
  timestamp: number;
  operation: 'create' | 'update';
  activityId?: string; // For update operations
}

/**
 * Queue an activity for sync when offline
 * @param activity - Activity data to queue
 * @param operation - Operation type ('create' or 'update')
 * @param activityId - Activity ID (required for update operations)
 * @returns Temporary ID for the queued activity
 */
export const queueActivityForSync = async (
  activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>,
  operation: 'create' | 'update' = 'create',
  activityId?: string
): Promise<string> => {
  try {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const pendingActivity: PendingActivity = {
      tempId,
      activity,
      timestamp: Date.now(),
      operation,
      activityId,
    };

    // Get existing pending activities
    const existingData = await AsyncStorage.getItem(PENDING_ACTIVITIES_KEY);
    const pendingActivities: PendingActivity[] = existingData ? JSON.parse(existingData) : [];

    // Add new activity to queue
    pendingActivities.push(pendingActivity);

    // Save updated queue
    await AsyncStorage.setItem(PENDING_ACTIVITIES_KEY, JSON.stringify(pendingActivities));

    // Update sync status
    await updateSyncStatus('pending');

    console.log(`Activity queued for sync: ${tempId}`);
    return tempId;
  } catch (error) {
    console.error('Error queuing activity for sync:', error);
    throw new Error('Failed to queue activity for offline sync');
  }
};

/**
 * Sync all pending activities to Firestore
 * @returns Object with success count, error count, and any errors
 */
export const syncPendingActivities = async (): Promise<{
  success: number;
  errors: number;
  errorMessages: string[];
}> => {
  try {
    // Check connectivity first
    const isConnected = await checkConnectivity();
    if (!isConnected) {
      console.log('No internet connection, skipping sync');
      return { success: 0, errors: 0, errorMessages: [] };
    }

    // Update sync status
    await updateSyncStatus('syncing');

    // Get pending activities
    const existingData = await AsyncStorage.getItem(PENDING_ACTIVITIES_KEY);
    if (!existingData) {
      await updateSyncStatus('synced');
      return { success: 0, errors: 0, errorMessages: [] };
    }

    const pendingActivities: PendingActivity[] = JSON.parse(existingData);

    if (pendingActivities.length === 0) {
      await updateSyncStatus('synced');
      return { success: 0, errors: 0, errorMessages: [] };
    }

    console.log(`Syncing ${pendingActivities.length} pending activities`);

    let successCount = 0;
    let errorCount = 0;
    const errorMessages: string[] = [];
    const remainingActivities: PendingActivity[] = [];

    // Process each pending activity
    for (const pending of pendingActivities) {
      try {
        // Reconstruct activity with proper Date objects
        const activityToSync = {
          ...pending.activity,
          date: new Date(pending.activity.date),
        };

        if (pending.operation === 'create') {
          await createActivity(activityToSync);
          console.log(`Successfully synced activity: ${pending.tempId}`);
          successCount++;
        } else if (pending.operation === 'update' && pending.activityId) {
          await updateActivity(pending.activityId, activityToSync);
          console.log(`Successfully updated activity: ${pending.activityId}`);
          successCount++;
        } else {
          throw new Error('Invalid operation or missing activity ID');
        }
      } catch (error) {
        console.error(`Error syncing activity ${pending.tempId}:`, error);
        errorCount++;
        errorMessages.push(`Failed to sync activity: ${error instanceof Error ? error.message : 'Unknown error'}`);

        // Keep failed activities in queue for retry
        remainingActivities.push(pending);
      }
    }

    // Update pending activities (remove successful ones)
    if (remainingActivities.length > 0) {
      await AsyncStorage.setItem(PENDING_ACTIVITIES_KEY, JSON.stringify(remainingActivities));
      await updateSyncStatus('error');
    } else {
      await AsyncStorage.removeItem(PENDING_ACTIVITIES_KEY);
      await updateSyncStatus('synced');
    }

    console.log(`Sync complete: ${successCount} success, ${errorCount} errors`);
    return { success: successCount, errors: errorCount, errorMessages };
  } catch (error) {
    console.error('Error during sync:', error);
    await updateSyncStatus('error');
    return {
      success: 0,
      errors: 1,
      errorMessages: ['Sync failed: ' + (error instanceof Error ? error.message : 'Unknown error')],
    };
  }
};

/**
 * Check internet connectivity
 * @returns True if connected, false otherwise
 */
export const checkConnectivity = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === true && state.isInternetReachable !== false;
  } catch (error) {
    console.error('Error checking connectivity:', error);
    return false;
  }
};

/**
 * Get current sync status
 * @returns Current sync status
 */
export const getSyncStatus = async (): Promise<SyncStatus> => {
  try {
    const status = await AsyncStorage.getItem(SYNC_STATUS_KEY);
    return (status as SyncStatus) || 'synced';
  } catch (error) {
    console.error('Error getting sync status:', error);
    return 'synced';
  }
};

/**
 * Update sync status
 * @param status - New sync status
 */
const updateSyncStatus = async (status: SyncStatus): Promise<void> => {
  try {
    await AsyncStorage.setItem(SYNC_STATUS_KEY, status);
  } catch (error) {
    console.error('Error updating sync status:', error);
  }
};

/**
 * Get count of pending activities
 * @returns Number of pending activities
 */
export const getPendingActivityCount = async (): Promise<number> => {
  try {
    const existingData = await AsyncStorage.getItem(PENDING_ACTIVITIES_KEY);
    if (!existingData) {
      return 0;
    }
    const pendingActivities: PendingActivity[] = JSON.parse(existingData);
    return pendingActivities.length;
  } catch (error) {
    console.error('Error getting pending activity count:', error);
    return 0;
  }
};

/**
 * Clear all pending activities (use with caution)
 */
export const clearPendingActivities = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PENDING_ACTIVITIES_KEY);
    await updateSyncStatus('synced');
    console.log('Cleared all pending activities');
  } catch (error) {
    console.error('Error clearing pending activities:', error);
    throw new Error('Failed to clear pending activities');
  }
};

/**
 * Handle sync conflict using timestamp comparison
 * @param localActivity - Local activity data
 * @param remoteActivity - Remote activity data
 * @returns Activity to keep (most recent based on updatedAt)
 */
export const handleSyncConflict = (
  localActivity: Activity,
  remoteActivity: Activity
): Activity => {
  // Compare timestamps - keep the most recent
  const localTime = localActivity.updatedAt.getTime();
  const remoteTime = remoteActivity.updatedAt.getTime();

  if (localTime > remoteTime) {
    console.log('Conflict resolved: keeping local activity (more recent)');
    return localActivity;
  } else {
    console.log('Conflict resolved: keeping remote activity (more recent)');
    return remoteActivity;
  }
};

/**
 * Setup connectivity listener to auto-sync when online
 * @param onConnectivityChange - Callback when connectivity changes
 * @returns Unsubscribe function
 */
export const setupConnectivityListener = (
  onConnectivityChange?: (isConnected: boolean) => void
): (() => void) => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    const isConnected = state.isConnected === true && state.isInternetReachable !== false;
    console.log('Connectivity changed:', isConnected ? 'online' : 'offline');

    if (onConnectivityChange) {
      onConnectivityChange(isConnected);
    }

    // Auto-sync when coming back online
    if (isConnected) {
      syncPendingActivities().catch((error) => {
        console.error('Auto-sync failed:', error);
      });
    }
  });

  return unsubscribe;
};
