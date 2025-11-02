/**
 * Utility to validate Firebase configuration
 * This helps ensure that Firebase credentials are properly configured
 */

import firebaseConfig from '../../firebase.config';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates that Firebase configuration has been properly set up
 * @returns ValidationResult with validation status and messages
 */
export const validateFirebaseConfig = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if config values are still placeholders
  const placeholderValues = [
    'YOUR_API_KEY',
    'YOUR_AUTH_DOMAIN',
    'YOUR_PROJECT_ID',
    'YOUR_STORAGE_BUCKET',
    'YOUR_MESSAGING_SENDER_ID',
    'YOUR_APP_ID'
  ];

  if (placeholderValues.includes(firebaseConfig.apiKey)) {
    errors.push('API Key has not been configured. Please update firebase.config.ts with your actual Firebase credentials.');
  }

  if (placeholderValues.includes(firebaseConfig.authDomain)) {
    errors.push('Auth Domain has not been configured.');
  }

  if (placeholderValues.includes(firebaseConfig.projectId)) {
    errors.push('Project ID has not been configured.');
  }

  if (placeholderValues.includes(firebaseConfig.storageBucket)) {
    warnings.push('Storage Bucket has not been configured (optional for this app).');
  }

  if (placeholderValues.includes(firebaseConfig.messagingSenderId)) {
    errors.push('Messaging Sender ID has not been configured.');
  }

  if (placeholderValues.includes(firebaseConfig.appId)) {
    errors.push('App ID has not been configured.');
  }

  // Check format of configured values
  if (!placeholderValues.includes(firebaseConfig.apiKey)) {
    if (firebaseConfig.apiKey.length < 20) {
      warnings.push('API Key seems too short. Please verify it is correct.');
    }
  }

  if (!placeholderValues.includes(firebaseConfig.authDomain)) {
    if (!firebaseConfig.authDomain.includes('firebaseapp.com')) {
      warnings.push('Auth Domain should typically end with firebaseapp.com');
    }
  }

  if (!placeholderValues.includes(firebaseConfig.projectId)) {
    if (firebaseConfig.projectId.length < 3) {
      warnings.push('Project ID seems too short. Please verify it is correct.');
    }
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings
  };
};

/**
 * Logs validation results to console
 * Useful for debugging during development
 */
export const logValidationResults = (): void => {
  const result = validateFirebaseConfig();

  if (result.isValid) {
    console.log('✅ Firebase configuration is valid');
    
    if (result.warnings.length > 0) {
      console.warn('⚠️ Warnings:');
      result.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
  } else {
    console.error('❌ Firebase configuration is invalid');
    console.error('Errors:');
    result.errors.forEach(error => console.error(`  - ${error}`));
    
    if (result.warnings.length > 0) {
      console.warn('⚠️ Warnings:');
      result.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    console.log('\nPlease follow the setup guide in FIREBASE_SETUP.md');
  }
};

/**
 * Gets a user-friendly error message for display in the app
 */
export const getConfigErrorMessage = (): string | null => {
  const result = validateFirebaseConfig();
  
  if (!result.isValid) {
    return 'Firebase is not configured. Please check FIREBASE_SETUP.md for setup instructions.';
  }
  
  return null;
};
