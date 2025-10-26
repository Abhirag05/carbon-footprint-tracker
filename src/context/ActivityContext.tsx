import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Activity } from '../types';

type SyncStatus = 'synced' | 'pending' | 'syncing' | 'error';

interface ActivityState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  syncStatus: SyncStatus;
  filters: Record<string, any>;
}

type ActivityAction = 
  | { type: 'SET_ACTIVITIES'; payload: Activity[] }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'UPDATE_ACTIVITY'; payload: Activity }
  | { type: 'DELETE_ACTIVITY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SYNC_STATUS'; payload: SyncStatus }
  | { type: 'SET_FILTERS'; payload: Record<string, any> };

interface ActivityContextType extends ActivityState {
  dispatch: React.Dispatch<ActivityAction>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const activityReducer = (state: ActivityState, action: ActivityAction): ActivityState => {
  switch (action.type) {
    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };
    case 'ADD_ACTIVITY':
      return { ...state, activities: [...state.activities, action.payload] };
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map(a => 
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case 'DELETE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.filter(a => a.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SYNC_STATUS':
      return { ...state, syncStatus: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    default:
      return state;
  }
};

interface ActivityProviderProps {
  children: ReactNode;
}

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(activityReducer, {
    activities: [],
    loading: false,
    error: null,
    syncStatus: 'synced',
    filters: {},
  });

  return (
    <ActivityContext.Provider value={{ ...state, dispatch }}>
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
