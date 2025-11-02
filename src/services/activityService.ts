import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  QueryConstraint,
  Unsubscribe,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseService';
import { Activity, ActivityType } from '../types';
import { withRetry } from '../utils/retryHelper';
import { handleError } from '../utils/errorHandler';

/**
 * Activity Service
 * Handles all Firestore operations for activities
 */

/**
 * Create a new activity in Firestore
 * @param activityData - Activity data without id
 * @returns Created activity with id
 * @throws Error with user-friendly message on failure
 */
export const createActivity = async (
  activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Activity> => {
  try {
    const activitiesRef = collection(db, 'activities');

    const activityToSave = {
      ...activityData,
      date: Timestamp.fromDate(activityData.date),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Create activity with retry logic
    const docRef = await withRetry(
      () => addDoc(activitiesRef, activityToSave),
      { maxAttempts: 3 }
    );

    // Fetch the created document to get server-generated fields
    const docSnap = await withRetry(
      () => getDoc(docRef),
      { maxAttempts: 2 }
    );

    if (!docSnap.exists()) {
      throw new Error('Failed to retrieve created activity');
    }

    return convertFirestoreActivity(docSnap.id, docSnap.data());
  } catch (error) {
    const errorMessage = handleError(error, 'save activity');
    throw new Error(errorMessage);
  }
};

/**
 * Get activities with optional filtering
 * @param userId - User ID to filter activities
 * @param filters - Optional filters (dateRange, type)
 * @returns Array of activities
 * @throws Error with user-friendly message on failure
 */
export const getActivities = async (
  userId: string,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    type?: ActivityType;
  }
): Promise<Activity[]> => {
  try {
    const activitiesRef = collection(db, 'activities');
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
    ];

    // Add type filter before orderBy to avoid index issues
    if (filters?.type) {
      constraints.push(where('type', '==', filters.type));
    }

    // Add date range filters
    if (filters?.startDate) {
      constraints.push(where('date', '>=', Timestamp.fromDate(filters.startDate)));
    }
    if (filters?.endDate) {
      constraints.push(where('date', '<=', Timestamp.fromDate(filters.endDate)));
    }

    // Add orderBy last
    constraints.push(orderBy('date', 'desc'));

    const q = query(activitiesRef, ...constraints);

    // Fetch activities with retry logic
    const querySnapshot = await withRetry(
      () => getDocs(q),
      { maxAttempts: 3 }
    );

    const activities: Activity[] = [];
    querySnapshot.forEach((doc) => {
      activities.push(convertFirestoreActivity(doc.id, doc.data()));
    });

    return activities;
  } catch (error: any) {
    // Check if it's an index error
    if (error?.code === 'failed-precondition' && error?.message?.includes('index')) {
      handleError(error, 'fetch activities');
      console.error('⚠️  FIRESTORE INDEX REQUIRED ⚠️');
      console.error('Please create the required index by clicking this link:');
      const indexUrl = error?.message?.match(/https:\/\/[^\s]+/)?.[0];
      if (indexUrl) {
        console.error(indexUrl);
      }
      throw new Error('Database index required. Please check console for setup instructions.');
    }

    const errorMessage = handleError(error, 'load activities');
    throw new Error(errorMessage);
  }
};

/**
 * Update an existing activity
 * @param activityId - Activity ID to update
 * @param updates - Partial activity data to update
 * @returns Updated activity
 * @throws Error with user-friendly message on failure
 */
export const updateActivity = async (
  activityId: string,
  updates: Partial<Omit<Activity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<Activity> => {
  try {
    const activityRef = doc(db, 'activities', activityId);

    // Convert Date to Timestamp if date is being updated
    const updateData: any = { ...updates };
    if (updates.date) {
      updateData.date = Timestamp.fromDate(updates.date);
    }
    updateData.updatedAt = serverTimestamp();

    // Update activity with retry logic
    await withRetry(
      () => updateDoc(activityRef, updateData),
      { maxAttempts: 3 }
    );

    // Fetch the updated document
    const docSnap = await withRetry(
      () => getDoc(activityRef),
      { maxAttempts: 2 }
    );

    if (!docSnap.exists()) {
      throw new Error('Activity not found');
    }

    return convertFirestoreActivity(docSnap.id, docSnap.data());
  } catch (error) {
    const errorMessage = handleError(error, 'update activity');
    throw new Error(errorMessage);
  }
};

/**
 * Delete an activity
 * @param activityId - Activity ID to delete
 * @throws Error with user-friendly message on failure
 */
export const deleteActivity = async (activityId: string): Promise<void> => {
  try {
    const activityRef = doc(db, 'activities', activityId);

    // Delete activity with retry logic
    await withRetry(
      () => deleteDoc(activityRef),
      { maxAttempts: 3 }
    );
  } catch (error) {
    const errorMessage = handleError(error, 'delete activity');
    throw new Error(errorMessage);
  }
};

/**
 * Subscribe to real-time activity updates
 * @param userId - User ID to filter activities
 * @param callback - Function to call when activities change
 * @param filters - Optional filters (dateRange, type)
 * @returns Unsubscribe function
 */
export const subscribeToActivities = (
  userId: string,
  callback: (activities: Activity[]) => void,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    type?: ActivityType;
  }
): Unsubscribe => {
  try {
    const activitiesRef = collection(db, 'activities');
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
    ];

    // Add type filter before orderBy to avoid index issues
    if (filters?.type) {
      constraints.push(where('type', '==', filters.type));
    }

    // Add date range filters
    if (filters?.startDate) {
      constraints.push(where('date', '>=', Timestamp.fromDate(filters.startDate)));
    }
    if (filters?.endDate) {
      constraints.push(where('date', '<=', Timestamp.fromDate(filters.endDate)));
    }

    // Add orderBy last
    constraints.push(orderBy('date', 'desc'));

    const q = query(activitiesRef, ...constraints);

    return onSnapshot(
      q,
      (querySnapshot) => {
        const activities: Activity[] = [];
        querySnapshot.forEach((doc) => {
          activities.push(convertFirestoreActivity(doc.id, doc.data()));
        });
        callback(activities);
      },
      (error: any) => {
        // Check if it's an index error and provide helpful message
        if (error?.code === 'failed-precondition' && error?.message?.includes('index')) {
          handleError(error, 'activity subscription');
          console.error('⚠️  FIRESTORE INDEX REQUIRED ⚠️');
          console.error('Please create the required index by clicking this link:');
          const indexUrl = error?.message?.match(/https:\/\/[^\s]+/)?.[0];
          if (indexUrl) {
            console.error(indexUrl);
          }
          console.error('After creating the index, restart the app.');
        } else {
          handleError(error, 'activity subscription');
        }

        callback([]);
      }
    );
  } catch (error) {
    handleError(error, 'set up activity subscription');
    return () => { }; // Return empty unsubscribe function
  }
};

/**
 * Convert Firestore document data to Activity object
 * @param id - Document ID
 * @param data - Firestore document data
 * @returns Activity object
 */
const convertFirestoreActivity = (id: string, data: any): Activity => {
  return {
    id,
    userId: data.userId,
    type: data.type,
    description: data.description,
    emissionKg: data.emissionKg,
    date: data.date?.toDate() || new Date(),
    metadata: data.metadata || {},
    synced: data.synced !== false, // Default to true if not specified
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};
