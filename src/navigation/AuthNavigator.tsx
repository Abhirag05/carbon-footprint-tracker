import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from '../screens/AuthScreen';

export type AuthStackParamList = {
  Auth: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

/**
 * AuthNavigator - Navigation for unauthenticated users
 * Displays the authentication screen for login and registration
 */
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f5f5f5' },
      }}
    >
      <Stack.Screen 
        name="Auth" 
        component={AuthScreen}
        options={{
          title: 'Sign In',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
