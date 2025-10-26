import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { ActivityProvider } from './src/context/ActivityContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <ActivityProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </ActivityProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
