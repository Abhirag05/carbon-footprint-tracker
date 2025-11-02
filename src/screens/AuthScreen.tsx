import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  Card
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, shadows, borderRadius } from '../theme/theme';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, register, loading, error, clearError } = useAuth();

  /**
   * Validate email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  /**
   * Validate password strength
   */
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  /**
   * Validate confirm password matches
   */
  const validateConfirmPassword = (): boolean => {
    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    // Clear previous errors
    clearError();

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword();

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password);
      }
      // Navigation will be handled automatically by AuthContext
    } catch (error) {
      // Error is already set in context and displayed
      console.error('Authentication error:', error);
    }
  };

  /**
   * Toggle between login and registration modes
   */
  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearError();
    setEmailError('');
    setPasswordError('');
    setConfirmPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Sign in to track your carbon footprint'
                : 'Start tracking your environmental impact'}
            </Text>

            {/* Email Input */}
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) validateEmail(text);
              }}
              onBlur={() => validateEmail(email)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={Boolean(emailError)}
              disabled={Boolean(loading)}
              style={styles.input}
            />
            {emailError ? (
              <HelperText type="error" visible={true}>
                {emailError}
              </HelperText>
            ) : null}

            {/* Password Input */}
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) validatePassword(text);
              }}
              onBlur={() => validatePassword(password)}
              mode="outlined"
              secureTextEntry={Boolean(!showPassword)}
              autoCapitalize="none"
              autoComplete={isLogin ? 'password' : 'password-new'}
              error={Boolean(passwordError)}
              disabled={Boolean(loading)}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
            />
            {passwordError ? (
              <HelperText type="error" visible={true}>
                {passwordError}
              </HelperText>
            ) : null}

            {/* Confirm Password Input (Registration only) */}
            {!isLogin && (
              <>
                <TextInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  mode="outlined"
                  secureTextEntry={Boolean(!showPassword)}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  disabled={Boolean(loading)}
                  style={styles.input}
                />
                <HelperText type="info" visible={true}>
                  Password must be at least 8 characters
                </HelperText>
              </>
            )}

            {/* Error Message */}
            {error ? (
              <HelperText type="error" visible={true} style={styles.errorText}>
                {error}
              </HelperText>
            ) : null}

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={Boolean(loading)}
              disabled={Boolean(loading)}
              style={styles.submitButton}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            {/* Toggle Mode Button */}
            <Button
              mode="text"
              onPress={toggleMode}
              disabled={Boolean(loading)}
              style={styles.toggleButton}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  card: {
    ...shadows.lg,
    borderRadius: borderRadius.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  input: {
    marginBottom: spacing.xs,
  },
  errorText: {
    fontSize: 14,
    marginTop: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.md,
    paddingVertical: 6,
  },
  toggleButton: {
    marginTop: spacing.sm,
  },
});

export default AuthScreen;
