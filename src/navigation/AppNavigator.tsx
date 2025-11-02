import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { navigationTheme } from '../theme/theme';

/**
 * AppNavigator - Root navigation component
 * Conditionally renders AuthNavigator or MainTabNavigator based on authentication state
 */
const AppNavigator: React.FC = () => {
  const { user, initializing } = useAuth();

  // Show loading spinner while checking auth state
  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? (
        // User is authenticated - show main app with bottom tabs
        <MainTabNavigator />
      ) : (
        // User is not authenticated - show auth screen
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AppNavigator;
