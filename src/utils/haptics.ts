import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptic feedback utility functions
 * Provides consistent haptic feedback across the app
 */

/**
 * Light haptic feedback for subtle interactions
 * Use for: button taps, selections, toggles
 */
export const lightHaptic = async () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
            console.warn('Haptic feedback not available:', error);
        }
    }
};

/**
 * Medium haptic feedback for standard interactions
 * Use for: form submissions, confirmations, swipe actions
 */
export const mediumHaptic = async () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (error) {
            console.warn('Haptic feedback not available:', error);
        }
    }
};

/**
 * Heavy haptic feedback for important interactions
 * Use for: deletions, errors, critical actions
 */
export const heavyHaptic = async () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } catch (error) {
            console.warn('Haptic feedback not available:', error);
        }
    }
};

/**
 * Success haptic feedback
 * Use for: successful operations, achievements
 */
export const successHaptic = async () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.warn('Haptic feedback not available:', error);
        }
    }
};

/**
 * Warning haptic feedback
 * Use for: warnings, validation errors
 */
export const warningHaptic = async () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } catch (error) {
            console.warn('Haptic feedback not available:', error);
        }
    }
};

/**
 * Error haptic feedback
 * Use for: errors, failed operations
 */
export const errorHaptic = async () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } catch (error) {
            console.warn('Haptic feedback not available:', error);
        }
    }
};

/**
 * Selection haptic feedback
 * Use for: picker selections, slider changes
 */
export const selectionHaptic = async () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        try {
            await Haptics.selectionAsync();
        } catch (error) {
            console.warn('Haptic feedback not available:', error);
        }
    }
};

export default {
    light: lightHaptic,
    medium: mediumHaptic,
    heavy: heavyHaptic,
    success: successHaptic,
    warning: warningHaptic,
    error: errorHaptic,
    selection: selectionHaptic,
};
