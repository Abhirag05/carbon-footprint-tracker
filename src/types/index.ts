// Core type definitions for the Carbon Footprint Tracker app

export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

export type ActivityType = 'transportation' | 'energy' | 'food' | 'waste';

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  emissionKg: number;
  date: Date;
  metadata?: Record<string, any>;
  synced: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Insight {
  id: string;
  type: 'trend' | 'comparison' | 'recommendation';
  title: string;
  description: string;
  data?: any;
}

export type ChartPeriod = 'week' | 'month' | 'year';
export type ChartType = 'line' | 'bar' | 'pie';

export interface EmissionData {
  date: string;
  value: number;
  category?: ActivityType;
}
