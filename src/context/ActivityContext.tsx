import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Activity, ActivityType } from '../types';
import * as activityService from '../services/activityService';
import * as syncService from '../services/syncService';
import { useAuth } from './AuthContext';

interface ActivityFilters {
  startDate?: Date;
  endDate?: Date;
  type?: ActivityType;
}

interface ActivityState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  syncStatus: syncService.SyncStatus;
  filters: ActivityFilters;
  isConnected: boolean;
}

type ActivityAction =
  | { type: 'SET_ACTIVITIES'; payload: Activity[] }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'UPDATE_ACTIVITY'; payload: Activity }
  | { type: 'DELETE_ACTIVITY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SYNC_STATUS'; payload: syncService.SyncStatus }
  | { type: 'SET_FILTERS'; payload: ActivityFilters }
  | { type: 'SET_CONNECTIVITY'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

interface ActivityContextType extends ActivityState {
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateActivity: (id: string, updates: Partial<Omit<Activity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  setFilters: (filters: ActivityFilters) => void;
  refreshActivities: () => Promise<void>;
  syncPendingActivities: () => Promise<void>;
  clearError: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const activityReducer = (state: ActivityState, action: ActivityAction): ActivityState => {
  switch (action.type) {
    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload, loading: false, error: null };

    case 'ADD_ACTIVITY':
      return {
        ...state,
        activities: [action.payload, ...state.activities],
        loading: false,
        error: null,
      };

    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map((activity) =>
          activity.id === action.payload.id ? action.payload : activity
        ),
        loading: false,
        error: null,
      };

    case 'DELETE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.filter((activity) => activity.id !== action.payload),
        loading: false,
        error: null,
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_SYNC_STATUS':
      return { ...state, syncStatus: action.payload };

    case 'SET_FILTERS':
      return { ...state, filters: action.payload };

    case 'SET_CONNECTIVITY':
      return { ...state, isConnected: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};

interface ActivityProviderProps {
  children: ReactNode;
}

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const [state, dispatch] = useReducer(activityReducer, {
    activities: [],
    loading: false,
    error: null,
    syncStatus: 'synced',
    filters: {},
    isConnected: true,
  });

  // Setup connectivity listener
  useEffect(() => {
    const unsubscribe = syncService.setupConnectivityListener((isConnected) => {
      dispatch({ type: 'SET_CONNECTIVITY', payload: isConnected });
    });

    // Initial connectivity check
    syncService.checkConnectivity().then((isConnected) => {
      dispatch({ type: 'SET_CONNECTIVITY', payload: isConnected });
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to activities when user is authenticated
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'SET_ACTIVITIES', payload: [] });
      return;
    }

    console.log('ActivityContext: Setting up activity subscription for user:', user.id);
    dispatch({ type: 'SET_LOADING', payload: true });

    const unsubscribe = activityService.subscribeToActivities(
      user.id,
      (activities) => {
        console.log('ActivityContext: Received activities update:', activities.length);
        dispatch({ type: 'SET_ACTIVITIES', payload: activities });
      },
      state.filters
    );

    return () => {
      console.log('ActivityContext: Cleaning up activity subscription');
      unsubscribe();
    };
  }, [user, state.filters]);

  // Update sync status periodically
  useEffect(() => {
    const updateSyncStatus = async () => {
      const status = await syncService.getSyncStatus();
      dispatch({ type: 'SET_SYNC_STATUS', payload: status });
    };

    updateSyncStatus();
    const interval = setInterval(updateSyncStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  /**
   * Add a new activity
   */
  const addActivity = async (
    activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to add activities');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const isConnected = await syncService.checkConnectivity();

      if (isConnected) {
        // Online: Save directly to Firestore
        // Don't dispatch ADD_ACTIVITY here - let the subscription handle it
        await activityService.createActivity(activityData);
        dispatch({ type: 'SET_LOADING', payload: false });
      } else {
        // Offline: Queue for sync
        const tempId = await syncService.queueActivityForSync(activityData);

        // Create temporary activity for local display
        const tempActivity: Activity = {
          ...activityData,
          id: tempId,
          createdAt: new Date(),
          updatedAt: new Date(),
          synced: false,
        };

        dispatch({ type: 'ADD_ACTIVITY', payload: tempActivity });
        dispatch({ type: 'SET_SYNC_STATUS', payload: 'pending' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add activity';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  /**
   * Update an existing activity
   */
  const updateActivity = async (
    id: string,
    updates: Partial<Omit<Activity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to update activities');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const isConnected = await syncService.checkConnectivity();

      if (isConnected) {
        // Online: Update directly in Firestore
        const updatedActivity = await activityService.updateActivity(id, updates);
        dispatch({ type: 'UPDATE_ACTIVITY', payload: updatedActivity });
      } else {
        // Offline: Queue for sync
        const existingActivity = state.activities.find((a) => a.id === id);
        if (!existingActivity) {
          throw new Error('Activity not found');
        }

        const updatedData = { ...existingActivity, ...updates };
        await syncService.queueActivityForSync(updatedData, 'update', id);

        // Update local state
        const tempActivity: Activity = {
          ...updatedData,
          updatedAt: new Date(),
          synced: false,
        };

        dispatch({ type: 'UPDATE_ACTIVITY', payload: tempActivity });
        dispatch({ type: 'SET_SYNC_STATUS', payload: 'pending' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update activity';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  /**
   * Delete an activity
   */
  const deleteActivity = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to delete activities');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await activityService.deleteActivity(id);
      dispatch({ type: 'DELETE_ACTIVITY', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete activity';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  /**
   * Set activity filters
   */
  const setFilters = (filters: ActivityFilters): void => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  /**
   * Refresh activities (for pull-to-refresh)
   */
  const refreshActivities = async (): Promise<void> => {
    if (!user) {
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const activities = await activityService.getActivities(user.id, state.filters);
      dispatch({ type: 'SET_ACTIVITIES', payload: activities });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh activities';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  /**
   * Manually trigger sync of pending activities
   */
  const syncPendingActivitiesManual = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'syncing' });

      const result = await syncService.syncPendingActivities();

      if (result.errors > 0) {
        dispatch({ type: 'SET_ERROR', payload: result.errorMessages.join(', ') });
        dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' });
      } else {
        dispatch({ type: 'SET_SYNC_STATUS', payload: 'synced' });

        // Refresh activities after successful sync
        if (user) {
          await refreshActivities();
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' });
    }
  };

  /**
   * Clear error message
   */
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: ActivityContextType = {
    ...state,
    addActivity,
    updateActivity,
    deleteActivity,
    setFilters,
    refreshActivities,
    syncPendingActivities: syncPendingActivitiesManual,
    clearError,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within ActivityProvider');
  }
  return context;
};
